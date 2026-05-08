"use client"

import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { useSiteContent } from "@/lib/useSiteContent"

const socialStyles = {
  tiktok: {
    card: "from-[#111111]/5 via-white to-[#FE2C55]/8 hover:border-[#25F4EE]/60",
    iconWrap: "bg-[#111111] text-white shadow-[0_12px_26px_rgba(17,17,17,0.16)]",
    Icon: FaTiktok,
    label: "text-[#111111]",
  },
  instagram: {
    card: "from-[#FEDA75]/12 via-white to-[#D62976]/10 hover:border-[#D62976]/45",
    iconWrap: "bg-linear-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white shadow-[0_12px_26px_rgba(214,41,118,0.16)]",
    Icon: FaInstagram,
    label: "text-[#C13584]",
  },
  facebook: {
    card: "from-[#1877F2]/10 via-white to-[#7C9C9B]/10 hover:border-[#1877F2]/45",
    iconWrap: "bg-[#1877F2] text-white shadow-[0_12px_26px_rgba(24,119,242,0.16)]",
    Icon: FaFacebookF,
    label: "text-[#1877F2]",
  },
} as const

export default function ContactPage() {
  const { content } = useSiteContent()
  const enabledSocials = content.socialLinks.filter((link) => link.isEnabled && link.url)

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader />

      <main className="w-full max-w-[760px] mx-auto px-4 sm:px-6 pt-10">
        <section className="rounded-[2rem] border border-black/10 bg-white p-7">
          <div className="text-xs uppercase font-mono tracking-[0.18em] text-[#7C9C9B] mb-4">Contact</div>
          <h1 className="text-4xl font-semibold tracking-tighter leading-none mb-4">{content.contactHeadline}</h1>
          <p className="text-black/60 text-[15px] leading-relaxed">
            {content.contactBody}
          </p>
        </section>

        {enabledSocials.length > 0 && (
          <section className="mt-8 rounded-[2rem] border border-black/10 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/10 p-6">
            <div className="text-xs uppercase font-mono tracking-[0.16em] text-[#7C9C9B] mb-4">Socials</div>
            <div className="space-y-3">
              {enabledSocials.map((link) => {
                const style = socialStyles[link.id]
                const Icon = style.Icon

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 rounded-2xl border border-black/10 bg-linear-to-br ${style.card} p-4 transition-all active:border-[#B01F85]/50`}
                  >
                    <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${style.iconWrap}`}>
                      {link.id === "tiktok" && (
                        <>
                          <Icon className="absolute -translate-x-0.5 translate-y-0.5 text-[#25F4EE] opacity-85" aria-hidden="true" />
                          <Icon className="absolute translate-x-0.5 -translate-y-0.5 text-[#FE2C55] opacity-85" aria-hidden="true" />
                        </>
                      )}
                      <Icon className="relative z-10" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-semibold">{link.label}</div>
                        <div className={`text-xs font-semibold ${style.label}`}>Open</div>
                      </div>
                      <div className="text-xs text-black/50 mt-1 truncate">{link.handle}</div>
                      {link.description && <div className="text-xs text-black/45 mt-1 leading-relaxed">{link.description}</div>}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6">
          <div className="text-xs uppercase font-mono tracking-[0.16em] text-[#7C9C9B] mb-3">Disclosures</div>
          <p className="text-sm text-black/60 leading-relaxed">
            {content.disclosureText}
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
