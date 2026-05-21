"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaBookOpen, FaHeartbeat, FaHome, FaRegCommentDots, FaShoppingBag } from "react-icons/fa"
import type { IconType } from "react-icons"
import { RHYTHM_STORAGE_KEY } from "@/lib/rhythm"

const baseNavItems: { label: string; href: string; Icon: IconType }[] = [
  { label: "Home", href: "/", Icon: FaHome },
  { label: "Finest", href: "/formula", Icon: FaBookOpen },
  { label: "Rituals", href: "/routine", Icon: FaHeartbeat },
  { label: "Favorites", href: "/shop", Icon: FaShoppingBag },
  { label: "Reviews", href: "/reviews", Icon: FaRegCommentDots },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [hasRhythm, setHasRhythm] = useState(false)

  useEffect(() => {
    const checkSavedRhythm = () => {
      setHasRhythm(Boolean(localStorage.getItem(RHYTHM_STORAGE_KEY)))
    }

    checkSavedRhythm()
    window.addEventListener("storage", checkSavedRhythm)
    window.addEventListener("focus", checkSavedRhythm)
    window.addEventListener("piclicorice-rhythm-updated", checkSavedRhythm)

    return () => {
      window.removeEventListener("storage", checkSavedRhythm)
      window.removeEventListener("focus", checkSavedRhythm)
      window.removeEventListener("piclicorice-rhythm-updated", checkSavedRhythm)
    }
  }, [])

  const navItems = baseNavItems.map((item) =>
    item.href === "/routine" && hasRhythm ? { ...item, label: "Ritual" } : item
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#fbf7f2]/92 px-2 pb-2 pt-2 shadow-[0_-18px_48px_rgba(41,35,31,0.08)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid w-full max-w-[640px] grid-cols-5 gap-1.5">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.Icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-16 flex-col items-center justify-center gap-1 rounded-[22px] text-center text-[11px] font-semibold tracking-tight transition-all sm:h-[66px] sm:text-xs ${
                isActive
                  ? "bg-white text-[#0F7F91] shadow-[0_12px_28px_rgba(15,127,145,0.14)] ring-1 ring-[#0F7F91]/10"
                  : "text-black/56 hover:bg-white/72 hover:text-black"
              }`}
            >
              <Icon className={`h-[21px] w-[21px] ${isActive ? "scale-110" : ""}`} aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
