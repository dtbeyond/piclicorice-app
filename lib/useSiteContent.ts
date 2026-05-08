"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  defaultSiteContent,
  normalizeSiteContent,
  SITE_CONTENT_ID,
  SITE_CONTENT_STORAGE_KEY,
  SiteContent,
} from "@/lib/siteContent"

type LoadState = "idle" | "loading" | "ready" | "local-fallback" | "error"

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)
  const [status, setStatus] = useState<LoadState>("idle")
  const [error, setError] = useState("")

  const loadContent = useCallback(async () => {
    setStatus("loading")
    setError("")

    const localContent = window.localStorage.getItem(SITE_CONTENT_STORAGE_KEY)
    if (localContent) {
      try {
        setContent(normalizeSiteContent(JSON.parse(localContent)))
      } catch {}
    }

    if (!supabase) {
      setStatus("local-fallback")
      return
    }

    const { data, error: loadError } = await supabase
      .from("site_content")
      .select("content")
      .eq("id", SITE_CONTENT_ID)
      .maybeSingle()

    if (loadError) {
      setError(loadError.message)
      setStatus("local-fallback")
      return
    }

    if (data?.content) {
      const normalized = normalizeSiteContent(data.content as Partial<SiteContent>)
      setContent(normalized)
      window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(normalized))
    }

    setStatus("ready")
  }, [])

  useEffect(() => {
    loadContent()
  }, [loadContent])

  const saveContent = useCallback(async (nextContent: SiteContent) => {
    const normalized = normalizeSiteContent(nextContent)
    setContent(normalized)
    window.localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(normalized))

    if (!supabase) {
      setStatus("local-fallback")
      return { ok: false, message: "Saved in this browser only. Supabase is not configured yet." }
    }

    const { error: saveError } = await supabase
      .from("site_content")
      .upsert(
        {
          id: SITE_CONTENT_ID,
          content: normalized,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

    if (saveError) {
      setError(saveError.message)
      setStatus("local-fallback")
      return { ok: false, message: saveError.message }
    }

    setStatus("ready")
    return { ok: true, message: "Saved live." }
  }, [])

  return { content, setContent, status, error, saveContent, reloadContent: loadContent }
}
