"use client"

import { useState } from "react"
import Link from "next/link"
import { FaBars, FaTimes } from "react-icons/fa"

type SiteHeaderProps = {
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  actionVariant?: "shop" | "plain"
}

const menuLinks = [
  ["Home", "/"],
  ["Start", "/routine"],
  ["Finest", "/formula"],
  ["Picks", "/shop"],
  ["Subscribe", "/subscribe"],
  ["Contact", "/contact"],
]

export default function SiteHeader({
  actionLabel = "Subscribe",
  actionHref = "/subscribe",
  onAction,
  actionVariant = "shop",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const actionClass =
    actionVariant === "shop"
      ? "shop-now-button"
      : "border border-black/15 bg-white/70 text-black hover:bg-white"

  const actionContent = (
    <span
      className={`inline-flex h-10 min-w-[116px] items-center justify-center rounded-full px-5 text-center text-xs font-semibold tracking-wide transition-colors ${actionClass}`}
    >
      {actionLabel}
    </span>
  )

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#faf8f4]/88 px-4 py-3.5 shadow-[0_10px_34px_rgba(41,35,31,0.05)] backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex w-full max-w-[1040px] items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111111] shadow-[0_10px_22px_rgba(17,17,17,0.12)] ring-1 ring-black/10">
              <img
                src="/assets/piclicorice/piclicorice-pl-logo.jpeg"
                alt="PicLicorice logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold tracking-tight">PicLicorice</div>
              <div className="-mt-1 text-[10px] tracking-[0.02em] text-black/45">honoring skin&apos;s natural beauty</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/" className="rounded-full px-4 py-2 text-xs font-semibold text-black/62 hover:bg-white hover:text-black">
              Home
            </Link>
            <Link href="/subscribe" className="rounded-full px-4 py-2 text-xs font-semibold text-black/62 hover:bg-white hover:text-black">
              Subscribe
            </Link>
            <Link href="/shop" className="rounded-full px-4 py-2 text-xs font-semibold text-black/62 hover:bg-white hover:text-black">
              Picks
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {onAction ? (
              <button onClick={onAction} className="hidden whitespace-nowrap sm:block" type="button">
                {actionContent}
              </button>
            ) : (
              <Link href={actionHref} className="hidden whitespace-nowrap sm:block">
                {actionContent}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="pl-soft-button flex h-10 w-10 items-center justify-center rounded-full text-black"
              aria-label="Open menu"
            >
              <FaBars aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[240] bg-black/35 p-4 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
          <div
            className="ml-auto flex h-full w-full max-w-[380px] flex-col rounded-[32px] border border-black/10 bg-[#faf8f4] p-5 text-black shadow-[0_24px_80px_rgba(17,17,17,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="pl-kicker">Menu</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">Simplify your life.</div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="pl-soft-button flex h-10 w-10 items-center justify-center rounded-full"
                aria-label="Close menu"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-2">
              {menuLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="pl-soft-button rounded-[22px] px-5 py-4 text-sm font-semibold hover:border-[#B01F85]/30"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="pl-card pl-card-teal mt-auto p-5">
              <div className="pl-kicker pl-kicker-pink mb-2 text-[10px]">Weekly drop</div>
              <p className="text-sm leading-relaxed text-black/58">
                A simple note, one useful download, and a calmer way to choose what belongs in your rotation.
              </p>
              <Link
                href="/subscribe"
                onClick={() => setIsMenuOpen(false)}
                className="shop-now-button mt-4 inline-flex h-11 items-center justify-center rounded-full px-5 text-xs font-bold tracking-[0.08em]"
              >
                Join your finest era
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
