"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaBars, FaTimes } from "react-icons/fa"

type SiteHeaderProps = {
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  actionVariant?: "shop" | "plain"
}

const menuLinks = [
  ["Finest at 50", "/formula"],
  ["Rituals", "/routine"],
  ["Skin Favorites", "/shop"],
  ["Reviews", "/reviews"],
  ["Join the glow", "/subscribe"],
  ["Contact", "/contact"],
]

const desktopLinks = menuLinks.slice(0, 4)

export default function SiteHeader({
  actionLabel = "Join the glow",
  actionHref = "/subscribe",
  onAction,
  actionVariant = "shop",
}: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
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
      <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 rounded-full border border-white/70 bg-white/74 px-4 py-2 shadow-[0_18px_60px_rgba(17,26,51,0.08)] backdrop-blur-xl">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#111A33] shadow-[0_10px_22px_rgba(17,17,17,0.12)] ring-1 ring-black/10">
              <img
                src="/assets/piclicorice/piclicorice-pl-logo.webp"
                alt="PicLicorice logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold tracking-tight">PicLicorice</div>
              <div className="-mt-1 hidden text-[10px] tracking-[0.02em] text-black/45 sm:block">honoring skin&apos;s natural beauty</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {desktopLinks.map(([label, href]) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "bg-white/72 text-[#111A33]" : "text-[#111A33]/68 hover:bg-white/70 hover:text-[#111A33]"
                  }`}
                >
                  {label}
                </Link>
              )
            })}
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
              className="pl-soft-button flex h-10 w-10 items-center justify-center rounded-full text-black md:hidden"
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
            className="ml-auto flex h-full w-full max-w-[380px] flex-col rounded-[32px] border border-black/10 bg-[#fbf7f2] p-5 text-black shadow-[0_24px_80px_rgba(17,17,17,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="pl-kicker">Menu</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">Join the finest era.</div>
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
                  className="pl-soft-button rounded-[22px] px-5 py-4 text-sm font-semibold hover:border-[#0F7F91]/30"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="pl-card pl-card-teal mt-auto p-5">
              <div className="pl-kicker pl-kicker-pink mb-2 text-[10px]">Join the glow</div>
              <p className="text-sm leading-relaxed text-black/58">
                Sunday rituals, mindset notes, and skincare honesty - straight to your inbox.
              </p>
              <Link
                href="/subscribe"
                onClick={() => setIsMenuOpen(false)}
                className="shop-now-button mt-4 inline-flex h-11 items-center justify-center rounded-full px-5 text-xs font-bold tracking-[0.08em]"
              >
                Join the glow
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
