"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

type Mode = "sign-in" | "sign-up"

export default function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shouldGate = pathname.startsWith("/admin")
  const [isReady, setIsReady] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const [mode, setMode] = useState<Mode>("sign-in")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setIsReady(true)
      setIsAuthed(true)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setIsAuthed(Boolean(data.session))
      setIsReady(true)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session))
      setIsReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const submit = async () => {
    setMessage("")
    setIsSubmitting(true)

    if (!supabase) {
      setIsSubmitting(false)
      setMessage("Login is not configured yet.")
      return
    }

    const credentials = { email: email.trim(), password }
    const result =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials)

    if (result.error) {
      setMessage(result.error.message)
      setIsSubmitting(false)
      return
    }

    if (mode === "sign-up" && !result.data.session) {
      setMessage("Check your email to confirm your account, then come back and sign in.")
    } else {
      setMessage("You're in.")
    }

    setIsSubmitting(false)
  }

  const continueAsGuest = !supabase

  if (!shouldGate) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-screen">
      <div className={!isReady || !isAuthed ? "pointer-events-none select-none blur-sm opacity-45" : ""}>
        {children}
      </div>

      {isReady && !isAuthed && (
        <div className="fixed inset-0 z-[500] bg-[#fbf7f2]/75 backdrop-blur-md flex items-center justify-center px-5">
          <div className="w-full max-w-[390px] rounded-3xl border border-[#9FC8CA]/30 bg-white/95 p-7 shadow-2xl text-[#111A33]">
            <div className="text-xs uppercase font-mono tracking-[0.18em] text-[#0F7F91] mb-3">PicLicorice Admin</div>
            <h1 className="text-4xl font-semibold tracking-tighter leading-none mb-3 text-[#111A33]">
              {mode === "sign-in" ? "Welcome back." : "Create your routine account."}
            </h1>
            <p className="text-sm text-black/60 leading-relaxed mb-6">
              Sign in to manage PicLicorice content and admin-only tools.
            </p>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f3efea] p-1 mb-5">
              <button
                onClick={() => {
                  setMode("sign-in")
                  setMessage("")
                }}
                className={`h-10 rounded-xl text-sm font-medium ${mode === "sign-in" ? "bg-white text-[#111A33] shadow-sm" : "text-black/55"}`}
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setMode("sign-up")
                  setMessage("")
                }}
                className={`h-10 rounded-xl text-sm font-medium ${mode === "sign-up" ? "bg-white text-[#111A33] shadow-sm" : "text-black/55"}`}
              >
                Sign up
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="w-full rounded-2xl bg-white border border-black/10 px-5 py-4 text-sm outline-none focus:border-[#0F7F91]"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="Password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                className="w-full rounded-2xl bg-white border border-black/10 px-5 py-4 text-sm outline-none focus:border-[#0F7F91]"
              />
              <button
                onClick={submit}
                disabled={isSubmitting || !email || password.length < 6}
                className="w-full h-14 rounded-2xl bg-[#111A33] text-white font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Please wait..." : mode === "sign-in" ? "Unlock site" : "Create account"}
              </button>
            </div>

            {message && <div className="mt-5 rounded-2xl bg-[#f3efea] border border-black/10 px-4 py-3 text-sm text-black/70">{message}</div>}

            {continueAsGuest && (
              <div className="mt-5 text-xs text-black/40 leading-relaxed">
                Supabase is not configured in this build, so the gate is open for local preview only.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
