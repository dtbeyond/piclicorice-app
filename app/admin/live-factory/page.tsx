"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function AdminLiveFactoryPage() {
  const [email, setEmail] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (!supabase) {
        setIsReady(true)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      const activeEmail = sessionData.session?.user.email || ""
      setEmail(activeEmail)

      if (activeEmail) {
        const { data } = await supabase.from("admin_users").select("email").eq("email", activeEmail).maybeSingle()
        setIsAuthorized(Boolean(data?.email))
      }

      setIsReady(true)
    }

    checkAccess()
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white">
      <main className="max-w-3xl mx-auto px-5 py-10">
        <Link href="/admin" className="text-xs text-white/50 hover:text-white">
          Back to Aime dashboard
        </Link>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#1c1c24] p-7">
          <div className="text-xs uppercase font-mono tracking-[0.18em] text-[#ff4da6] mb-4">Admin only</div>
          <h1 className="text-4xl font-semibold tracking-tighter leading-none mb-4">Live Factory Command</h1>

          {!isReady && <p className="text-white/60 text-sm">Checking access...</p>}

          {isReady && !isAuthorized && (
            <div className="rounded-2xl border border-[#ff4da6]/30 bg-[#ff4da6]/10 p-4 text-sm text-white/75">
              {email ? `${email} is signed in, but this account is not in admin_users.` : "Sign in with an admin account first."}
            </div>
          )}

          {isReady && isAuthorized && (
            <div className="space-y-5">
              <p className="text-white/65 text-sm leading-relaxed">
                This is reserved for the Live Factory command workspace. It will stay out of public navigation and only be reachable from the admin dashboard.
              </p>
              <div className="rounded-2xl border border-white/10 bg-[#0f0f14] p-5">
                <div className="text-sm font-semibold mb-2">Stub status</div>
                <p className="text-xs text-white/50 leading-relaxed">
                  Future build: connect existing Live Factory tools, internal command notes, content ops, and admin-only workflows here.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
