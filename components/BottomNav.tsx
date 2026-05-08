"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaBookOpen, FaHeartbeat, FaHome, FaRegCommentDots, FaShoppingBag } from "react-icons/fa"
import type { IconType } from "react-icons"
import { RHYTHM_STORAGE_KEY } from "@/lib/rhythm"

const baseNavItems: { label: string; href: string; Icon: IconType }[] = [
  { label: "Home", href: "/", Icon: FaHome },
  { label: "Start", href: "/routine", Icon: FaHeartbeat },
  { label: "Finest", href: "/formula", Icon: FaBookOpen },
  { label: "Picks", href: "/shop", Icon: FaShoppingBag },
  { label: "Contact", href: "/contact", Icon: FaRegCommentDots },
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
    item.href === "/routine" ? { ...item, label: hasRhythm ? "Rhythm" : "Start" } : item
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#faf8f4]/96 px-2 pb-2 pt-2 shadow-[0_-12px_30px_rgba(17,17,17,0.06)] backdrop-blur">
      <div className="mx-auto grid w-full max-w-[760px] grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.Icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-16 flex-col items-center justify-center gap-1 rounded-[18px] text-center text-[11px] font-semibold tracking-tight transition-all sm:h-[68px] sm:text-xs ${
                isActive
                  ? "bg-white text-[#B01F85] shadow-[0_8px_18px_rgba(176,31,133,0.10)]"
                  : "text-black/58 hover:bg-white/70 hover:text-black"
              }`}
            >
              <Icon className={`h-[20px] w-[20px] ${isActive ? "scale-105" : ""}`} aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
