"use client"

import { FaHeart, FaRegComment, FaRegBookmark, FaTiktok } from "react-icons/fa"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { useSiteContent } from "@/lib/useSiteContent"

const reviewCards = [
  {
    handle: "soft girl era",
    metric: "48.2K",
    quote: "The ceramide serum changed my skin barrier in 2 weeks.",
    tone: "bg-[#10233d]",
  },
  {
    handle: "vienna",
    metric: "127K",
    quote: "POV: you're 46 and finally putting yourself first.",
    tone: "bg-gradient-to-br from-[#10233d] to-[#7d5b71]",
  },
  {
    handle: "sunshower",
    metric: "31.7K",
    quote: "My morning is unrecognizable. Matcha, journal, SPF.",
    tone: "bg-[#0f3145]",
  },
  {
    handle: "luther",
    metric: "92.4K",
    quote: "No botox. Just barrier care, sleep, and joy.",
    tone: "bg-gradient-to-br from-[#10233d] to-[#7d5b71]",
  },
]

export default function ReviewsPage() {
  const { content } = useSiteContent()
  const tiktok = content.socialLinks.find((link) => link.id === "tiktok" && link.url)

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1040px] px-4 pt-10 sm:px-6">
        <section className="mb-8 text-center">
          <div className="pl-kicker mb-4">Reviews</div>
          <h1 className="pl-display mx-auto max-w-[680px] text-5xl leading-[0.98] sm:text-7xl">
            Real notes from the glow-up.
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-[#111A33]/62">
            Social proof should feel like community, not pressure. This page is staged for TikTok reviews and lived-in rituals.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reviewCards.map((review) => (
            <article
              key={review.handle}
              className={`relative min-h-[270px] overflow-hidden rounded-[28px] border border-white/18 p-5 text-white shadow-[0_24px_70px_rgba(17,26,51,0.18)] ${review.tone}`}
            >
              <div className="absolute right-5 top-5 grid gap-4 text-xl text-white/92">
                <FaHeart aria-hidden="true" />
                <FaRegComment aria-hidden="true" />
                <FaRegBookmark aria-hidden="true" />
              </div>
              <div className="mt-16 max-w-[80%] font-serif text-lg font-semibold italic leading-snug">
                &quot;{review.quote}&quot;
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-white/70">
                  <FaTiktok className="text-[10px]" aria-hidden="true" />
                  {review.handle}
                </div>
                <div className="text-xs font-bold text-white">{review.metric}</div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[32px] border border-[#111A33]/10 bg-[#111A33] p-7 text-center text-white shadow-[0_24px_80px_rgba(17,26,51,0.16)]">
          <FaTiktok className="mx-auto mb-4 text-3xl" aria-hidden="true" />
          <h2 className="pl-display text-4xl">Watch more on TikTok</h2>
          <p className="mx-auto mt-3 max-w-[520px] text-sm leading-relaxed text-white/68">
            Pull real TikTok review embeds here once Aime has the exact posts she wants featured.
          </p>
          {tiktok && (
            <a
              href={tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-[#111A33]"
            >
              Open TikTok
            </a>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
