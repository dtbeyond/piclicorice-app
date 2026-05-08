"use client"

import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { useSiteContent } from "@/lib/useSiteContent"

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
          <section className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6">
            <div className="text-xs uppercase font-mono tracking-[0.16em] text-[#7C9C9B] mb-4">Socials</div>
            <div className="space-y-3">
              {enabledSocials.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-black/10 bg-[#faf8f4] p-4 active:border-[#B01F85]/50"
                >
                  {link.id === "tiktok" && content.contactTikTokProfileImageUrl ? (
                    <img
                      src={content.contactTikTokProfileImageUrl}
                      alt="@pic_licorice profile"
                      className="w-12 h-12 rounded-2xl object-cover border border-black/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center text-sm font-black uppercase border border-black/10">
                      {link.id === "instagram" ? "IG" : link.id === "facebook" ? "FB" : "TT"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{link.label}</div>
                      <div className="text-xs text-[#B01F85]">Open</div>
                    </div>
                    <div className="text-xs text-black/50 mt-1 truncate">{link.handle}</div>
                    {link.description && <div className="text-xs text-black/45 mt-1 leading-relaxed">{link.description}</div>}
                  </div>
                </a>
              ))}
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
