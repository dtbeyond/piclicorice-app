"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Routine", href: "/routine" },
  { label: "Finest", href: "/formula" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-[#faf8f4]/96 px-3 py-2 shadow-[0_-12px_30px_rgba(17,17,17,0.06)] backdrop-blur">
      <div className="mx-auto grid w-full max-w-[760px] grid-cols-5 gap-1.5">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-12 items-center justify-center rounded-full text-center text-[13px] font-semibold tracking-tight transition-all sm:h-13 sm:text-sm ${
                isActive
                  ? "border border-black/15 bg-white text-[#B01F85] shadow-[0_8px_18px_rgba(176,31,133,0.10)]"
                  : "text-black/68 hover:bg-white/70 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
