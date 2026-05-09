"use client"

import React, { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { SocialLink, TikTokLink } from "@/lib/siteContent"
import { useSiteContent } from "@/lib/useSiteContent"

type UploadTarget =
  | "homepageImageUrl"
  | "finestImageUrl"
  | "homepageVideoUrl"
  | "finestVideoUrl"
  | "contactTikTokProfileImageUrl"

const mediaSlots: Array<{
  field: UploadTarget
  number: string
  label: string
  location: string
  clickBehavior: string
  recommendation: string
}> = [
  {
    field: "homepageVideoUrl",
    number: "Media 1",
    label: "Homepage intro video",
    location: "Top of the homepage, before the headline.",
    clickBehavior: "Users play this video in place. It should not send them away from the site.",
    recommendation: "Best as a short direct upload from Aime.",
  },
  {
    field: "homepageImageUrl",
    number: "Media 2",
    label: "Homepage feature image",
    location: "Homepage feature area below the intro video.",
    clickBehavior: "Visual only for now. Primary buttons below still route inside the site.",
    recommendation: "Best as a direct image upload.",
  },
  {
    field: "finestVideoUrl",
    number: "Media 3",
    label: "Finest at 50 video",
    location: "Top section of the Finest at 50 Method page.",
    clickBehavior: "Users play this video in place. Longer polished videos can use YouTube/Vimeo.",
    recommendation: "Use direct upload for short clips, YouTube/Vimeo for longer videos.",
  },
  {
    field: "finestImageUrl",
    number: "Media 4",
    label: "Finest at 50 banner image",
    location: "Feature image area on the Finest at 50 Method page.",
    clickBehavior: "Visual only for now.",
    recommendation: "Best as a direct image upload.",
  },
  {
    field: "contactTikTokProfileImageUrl",
    number: "Media 5",
    label: "Contact TikTok profile picture",
    location: "TikTok profile card on the Contact page.",
    clickBehavior: "Image is visual only. The card button opens the TikTok profile.",
    recommendation: "Upload the PicLicorice profile image or Aime's preferred brand photo.",
  },
]

const cropOptions = [
  ["center center", "Center"],
  ["center top", "Top"],
  ["center bottom", "Bottom"],
  ["left center", "Left"],
  ["right center", "Right"],
  ["35% center", "Nudge left"],
  ["65% center", "Nudge right"],
]

const cropControls: Array<{
  field: "homepageImagePosition" | "finestImagePosition" | "shopImagePosition" | "routineImagePosition"
  label: string
  helper: string
}> = [
  {
    field: "homepageImagePosition",
    label: "Homepage hero crop",
    helper: "Controls the image behind the Watch Aime first play button.",
  },
  {
    field: "finestImagePosition",
    label: "Finest at 50 crop",
    helper: "Controls the homepage Finest card and the Finest page banner.",
  },
  {
    field: "shopImagePosition",
    label: "Shop page crop",
    helper: "Controls the top image on the internal shop page.",
  },
  {
    field: "routineImagePosition",
    label: "Routine page crop",
    helper: "Controls the image beside the routine questionnaire.",
  },
]

const supportedImageExtensions = [".png", ".jpg", ".jpeg", ".webp"]
const supportedVideoExtensions = [".mp4", ".webm", ".mov", ".m4v"]

const fileExtension = (fileName: string) => {
  const index = fileName.lastIndexOf(".")
  return index >= 0 ? fileName.slice(index).toLowerCase() : ""
}

const isVideoTarget = (target: UploadTarget) => target.toLowerCase().includes("video")

const isSupportedUpload = (file: File, target: UploadTarget) => {
  const extension = fileExtension(file.name)

  if (isVideoTarget(target)) {
    return file.type.startsWith("video/") || supportedVideoExtensions.includes(extension)
  }

  return (
    file.type === "image/png" ||
    file.type === "image/jpeg" ||
    file.type === "image/webp" ||
    supportedImageExtensions.includes(extension)
  )
}

export default function AdminPage() {
  const { content, setContent, status, error, saveContent } = useSiteContent()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [sessionEmail, setSessionEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState("")
  const [draggingField, setDraggingField] = useState("")
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false)

  const isSupabaseReady = Boolean(supabase)
  const canSaveLive = isSupabaseReady && Boolean(sessionEmail)

  useEffect(() => {
    if (!supabase) return

    const checkAdmin = async (emailAddress: string) => {
      if (!supabase) return

      if (!emailAddress) {
        setIsAuthorizedAdmin(false)
        return
      }

      const { data } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", emailAddress)
        .maybeSingle()

      setIsAuthorizedAdmin(Boolean(data?.email))
    }

    supabase.auth.getSession().then(({ data }) => {
      const activeEmail = data.session?.user.email || ""
      setSessionEmail(activeEmail)
      checkAdmin(activeEmail)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeEmail = session?.user.email || ""
      setSessionEmail(activeEmail)
      checkAdmin(activeEmail)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const featuredLinks = useMemo(
    () => content.tiktokLinks.filter((link) => link.isFeatured && link.url),
    [content.tiktokLinks]
  )

  const updateField = (field: keyof typeof content, value: string) => {
    setContent({ ...content, [field]: value })
  }

  const updateTikTokLink = (id: string, updates: Partial<TikTokLink>) => {
    setContent({
      ...content,
      tiktokLinks: content.tiktokLinks.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    })
  }

  const addTikTokLink = () => {
    setContent({
      ...content,
      tiktokLinks: [
        ...content.tiktokLinks,
        {
          id: crypto.randomUUID(),
          label: "New TikTok link",
          url: "",
          description: "",
          isFeatured: false,
        },
      ],
    })
  }

  const removeTikTokLink = (id: string) => {
    setContent({
      ...content,
      tiktokLinks: content.tiktokLinks.filter((link) => link.id !== id),
    })
  }

  const updateSocialLink = (id: SocialLink["id"], updates: Partial<SocialLink>) => {
    setContent({
      ...content,
      socialLinks: content.socialLinks.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    })
  }

  const signIn = async () => {
    setMessage("")

    if (!supabase) {
      setMessage("Supabase is not configured yet. You can still edit locally in this browser.")
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setMessage(signInError.message)
      return
    }

    setMessage("Signed in.")
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setMessage("Signed out.")
  }

  const save = async () => {
    if (supabase && sessionEmail && !isAuthorizedAdmin) {
      setMessage(`Signed in as ${sessionEmail}, but this email is not in admin_users yet.`)
      return
    }

    setIsSaving(true)
    setMessage("")
    const result = await saveContent(content)
    setMessage(result.message)
    setIsSaving(false)
  }

  const uploadFileForTarget = async (file: File, target: UploadTarget) => {
    setUploadingField(target)
    setMessage("")

    if (!isSupportedUpload(file, target)) {
      setMessage(
        isVideoTarget(target)
          ? "Could not import that video. Try an MP4, WebM, MOV, or paste a hosted video URL."
          : "Could not import that image. Try a PNG, JPG, JPEG, or WebP file."
      )
      setUploadingField("")
      return
    }

    if (!supabase || !sessionEmail) {
      if (file.size > 700_000) {
        setMessage("Sign in with Supabase before uploading larger files. For now, paste a public URL.")
        setUploadingField("")
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        updateField(target, String(reader.result || ""))
        setMessage("Added locally. Sign in and configure Supabase Storage for live uploads.")
        setUploadingField("")
      }
      reader.readAsDataURL(file)
      return
    }

    const fallbackName = isVideoTarget(target) ? "upload.mp4" : "upload.jpg"
    const cleanName = (file.name || fallbackName).toLowerCase().replace(/[^a-z0-9.-]/g, "-")
    const path = `${target}/${Date.now()}-${cleanName}`
    const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      setMessage(uploadError.message)
      setUploadingField("")
      return
    }

    const { data } = supabase.storage.from("site-media").getPublicUrl(path)
    updateField(target, data.publicUrl)
    setMessage("Upload ready. Save changes to publish it.")
    setUploadingField("")
  }

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>, target: UploadTarget) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    await uploadFileForTarget(file, target)
  }

  const droppedUrl = (event: DragEvent<HTMLElement>) => {
    const uriList = event.dataTransfer.getData("text/uri-list")
    const plainText = event.dataTransfer.getData("text/plain")
    const html = event.dataTransfer.getData("text/html")
    const htmlMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i)
    const value = uriList || plainText || htmlMatch?.[1] || ""
    const firstLine = value.split("\n").find((line) => line && !line.startsWith("#")) || ""

    return /^https?:\/\//i.test(firstLine) || /^data:image\//i.test(firstLine) || /^blob:/i.test(firstLine)
      ? firstLine
      : ""
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>, target: UploadTarget) => {
    event.preventDefault()
    event.stopPropagation()
    setDraggingField("")

    const file = event.dataTransfer.files?.[0]
    if (file) {
      await uploadFileForTarget(file, target)
      return
    }

    const url = droppedUrl(event)
    if (url && !url.startsWith("blob:")) {
      updateField(target, url)
      setMessage("Dropped URL added. Save changes to publish it.")
      return
    }

    setMessage(
      url.startsWith("blob:")
        ? "That drag source gave the browser a temporary blob link, not a reusable file. Save the image as PNG/JPG/WebP first, then drop the saved file here."
        : "Drop a PNG, JPG, JPEG, WebP, or video file from your computer, or paste a direct hosted URL."
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white pb-16">
      <header className="sticky top-0 z-50 bg-[#0f0f14]/95 backdrop-blur border-b border-white/10 px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono tracking-[0.18em] text-[#ff4da6] uppercase">PicLicorice Admin</div>
            <h1 className="text-2xl font-semibold tracking-tight">Aime dashboard</h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {[
              ["Home", "/"],
              ["Routine", "/routine"],
              ["Finest", "/formula"],
              ["Shop", "/shop"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-xs px-3 py-2 rounded-full border border-white/15 hover:bg-white/5">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-3">Dashboard navigation</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Home", "/"],
                ["Routine", "/routine"],
                ["Finest", "/formula"],
                ["Shop", "/shop"],
                ["Contact", "/contact"],
                ["Live Factory", "/admin/live-factory"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="h-10 rounded-xl border border-white/15 flex items-center justify-center text-xs hover:bg-white/5">
                  {label}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-3">Admin tools</div>
            <Link href="/admin/live-factory" className="block rounded-xl border border-white/15 px-4 py-3 text-sm hover:bg-white/5">
              Live Factory Command
              <span className="block text-xs text-white/45 mt-1">Stubbed for now. Admin-only command workspace later.</span>
            </Link>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-3">Publishing status</div>
            <div className="text-xs text-white/60 leading-relaxed space-y-2">
              <p>Status: {status}</p>
              <p>{canSaveLive ? `Signed in as ${sessionEmail}` : "Not signed in for live publishing."}</p>
              {sessionEmail && !isAuthorizedAdmin && (
                <p className="text-[#ff4da6]">
                  This account cannot save live yet. Add it to `admin_users` or sign in with an approved admin email.
                </p>
              )}
              {error && <p className="text-[#ff4da6]">{error}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-3">Admin session</div>
            {sessionEmail ? (
              <div className="space-y-3">
                <p className="text-xs text-white/55 break-all">{sessionEmail}</p>
                <button onClick={signOut} className="w-full h-11 rounded-xl border border-white/15 text-sm hover:bg-white/5">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-white/55 leading-relaxed">
                  Sign in through the PicLicorice gate first. This panel is a backup if the session expires.
                </p>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="w-full rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm"
                />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  type="password"
                  className="w-full rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm"
                />
                <button onClick={signIn} className="w-full h-11 rounded-xl bg-[#ff4da6] text-black text-sm font-semibold">
                  Sign in
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-3">Featured links</div>
            <div className="space-y-3">
              {featuredLinks.length ? (
                featuredLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#ff4da6] break-all">
                    {link.label}
                  </a>
                ))
              ) : (
                <p className="text-xs text-white/45">No featured TikTok links yet.</p>
              )}
            </div>
          </section>
        </aside>

        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <div className="text-sm font-semibold">Core links</div>
                <p className="text-xs text-white/45 mt-1">Aime can update these any time.</p>
              </div>
              <button
                onClick={save}
                disabled={isSaving}
                className="h-11 px-5 rounded-xl bg-[#ff4da6] text-black text-sm font-semibold disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>

            <label className="block text-xs text-white/50 mb-2">TikTok Shop / Showcase URL</label>
            <input
              value={content.shopUrl}
              onChange={(event) => updateField("shopUrl", event.target.value)}
              className="w-full rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm"
            />
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-2">Social links</div>
            <p className="text-xs text-white/45 leading-relaxed mb-5">
              These appear on the Contact page. Keep them simple and current.
            </p>
            <div className="space-y-4">
              {content.socialLinks.map((link) => (
                <div key={link.id} className="rounded-2xl border border-white/10 bg-[#0f0f14] p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="text-sm font-semibold">{link.label}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-white/35 font-mono">{link.id}</div>
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs text-white/60">
                      <input
                        type="checkbox"
                        checked={link.isEnabled}
                        onChange={(event) => updateSocialLink(link.id, { isEnabled: event.target.checked })}
                      />
                      Show
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input
                      value={link.handle}
                      onChange={(event) => updateSocialLink(link.id, { handle: event.target.value })}
                      placeholder="@handle"
                      className="rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                    />
                    <input
                      value={link.url}
                      onChange={(event) => updateSocialLink(link.id, { url: event.target.value })}
                      placeholder="https://..."
                      className="rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                    />
                  </div>
                  <textarea
                    value={link.description}
                    onChange={(event) => updateSocialLink(link.id, { description: event.target.value })}
                    placeholder="Short description"
                    className="w-full min-h-20 rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-2">Numbered media slots</div>
            <p className="text-xs text-white/45 leading-relaxed mb-5">
              These are the blank spaces where Aime can upload owned media or paste an embed/source URL.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {mediaSlots.map((slot) => (
                <div
                  key={slot.field}
                  onDragEnter={(event) => {
                    event.preventDefault()
                    setDraggingField(slot.field)
                  }}
                  onDragOver={(event) => {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "copy"
                    setDraggingField(slot.field)
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault()
                    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                      setDraggingField("")
                    }
                  }}
                  onDrop={(event) => handleDrop(event, slot.field)}
                  className={`rounded-2xl border bg-[#0f0f14] p-4 transition-all ${
                    draggingField === slot.field
                      ? "border-[#ff4da6] bg-[#ff4da6]/10 shadow-[0_0_0_1px_rgba(255,77,166,0.35)]"
                      : "border-white/10"
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-[0.16em] font-mono text-[#ff4da6] mb-2">{slot.number}</div>
                  <label className="block text-sm font-semibold mb-2">{slot.label}</label>
                  <div className="space-y-2 mb-4 text-xs text-white/50 leading-relaxed">
                    <p><span className="text-white/75">Appears:</span> {slot.location}</p>
                    <p><span className="text-white/75">Click:</span> {slot.clickBehavior}</p>
                    <p><span className="text-white/75">Best:</span> {slot.recommendation}</p>
                  </div>
                  <input
                    value={String(content[slot.field] || "")}
                    onChange={(event) => updateField(slot.field, event.target.value)}
                    placeholder="Paste public URL, YouTube/Vimeo URL, or uploaded file URL"
                    className="w-full rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm mb-3"
                  />
                  <input
                    type="file"
                    accept={isVideoTarget(slot.field) ? "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v" : "image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"}
                    onChange={(event) => uploadFile(event, slot.field)}
                    className="block w-full text-xs text-white/55 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white"
                  />
                  <div
                    className={`mt-3 rounded-xl border border-dashed px-4 py-4 text-center text-xs transition-all ${
                      draggingField === slot.field
                        ? "border-[#ff4da6] bg-[#ff4da6]/10 text-white"
                        : "border-white/15 bg-white/[0.03] text-white/45"
                    }`}
                  >
                    Drop PNG/JPG/WebP here, or use Choose File.
                  </div>
                  {uploadingField === slot.field && <p className="mt-2 text-xs text-[#ff4da6]">Uploading...</p>}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-2">Image crop controls</div>
            <p className="text-xs text-white/45 leading-relaxed mb-5">
              Use these when an uploaded image is good but the crop lands in the wrong place. Save after changing.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {cropControls.map((control) => (
                <div key={control.field} className="rounded-2xl border border-white/10 bg-[#0f0f14] p-4">
                  <label className="block text-sm font-semibold mb-2">{control.label}</label>
                  <p className="mb-3 text-xs leading-relaxed text-white/45">{control.helper}</p>
                  <select
                    value={String(content[control.field] || "center center")}
                    onChange={(event) => updateField(control.field, event.target.value)}
                    className="w-full rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                  >
                    {cropOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <div className="text-sm font-semibold">Media 5+: Featured TikTok links</div>
                <p className="text-xs text-white/45 mt-1">These appear as content cards on the homepage. They are not tied to main buttons.</p>
              </div>
              <button onClick={addTikTokLink} className="h-10 px-4 rounded-xl border border-white/15 text-sm hover:bg-white/5">
                Add link
              </button>
            </div>

            <div className="space-y-4">
              {content.tiktokLinks.map((link) => (
                <div key={link.id} className="rounded-2xl border border-white/10 bg-[#0f0f14] p-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      value={link.label}
                      onChange={(event) => updateTikTokLink(link.id, { label: event.target.value })}
                      placeholder="Label"
                      className="rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                    />
                    <input
                      value={link.url}
                      onChange={(event) => updateTikTokLink(link.id, { url: event.target.value })}
                      placeholder="TikTok URL"
                      className="rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                    />
                  </div>
                  <textarea
                    value={link.description}
                    onChange={(event) => updateTikTokLink(link.id, { description: event.target.value })}
                    placeholder="Short description"
                    className="mt-3 w-full min-h-20 rounded-xl bg-[#1c1c24] border border-white/10 px-4 py-3 text-sm"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm text-white/65">
                      <input
                        type="checkbox"
                        checked={link.isFeatured}
                        onChange={(event) => updateTikTokLink(link.id, { isFeatured: event.target.checked })}
                      />
                      Feature on site
                    </label>
                    <button onClick={() => removeTikTokLink(link.id)} className="text-xs text-white/45 hover:text-[#ff4da6]">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#1c1c24] p-5">
            <div className="text-sm font-semibold mb-5">Contact and disclosures</div>
            <label className="block text-xs text-white/50 mb-2">Contact headline</label>
            <input
              value={content.contactHeadline}
              onChange={(event) => updateField("contactHeadline", event.target.value)}
              className="w-full rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm mb-4"
            />
            <label className="block text-xs text-white/50 mb-2">Contact body</label>
            <textarea
              value={content.contactBody}
              onChange={(event) => updateField("contactBody", event.target.value)}
              className="w-full min-h-28 rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm mb-4"
            />
            <label className="block text-xs text-white/50 mb-2">TikTok profile URL fallback</label>
            <input
              value={content.contactTikTokProfileUrl}
              onChange={(event) => updateField("contactTikTokProfileUrl", event.target.value)}
              placeholder="https://www.tiktok.com/@pic_licorice"
              className="w-full rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm mb-4"
            />
            <p className="text-xs text-white/45 leading-relaxed mb-4">
              The Contact page now uses the Social links section. This fallback stays here for older saved content and should match the TikTok social URL.
            </p>
            <label className="block text-xs text-white/50 mb-2">Disclosure text</label>
            <textarea
              value={content.disclosureText}
              onChange={(event) => updateField("disclosureText", event.target.value)}
              className="w-full min-h-28 rounded-xl bg-[#0f0f14] border border-white/10 px-4 py-3 text-sm"
            />
          </section>

          {message && (
            <div className="rounded-2xl border border-[#ff4da6]/30 bg-[#ff4da6]/10 px-5 py-4 text-sm text-white">
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
