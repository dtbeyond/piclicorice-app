"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { FaTiktok } from "react-icons/fa"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { buildRhythmResult, isCompleteRhythm, RHYTHM_STORAGE_KEY, type SavedRhythm } from "@/lib/rhythm"
import { useSiteContent } from "@/lib/useSiteContent"

export default function PicLicoriceHome() {
  const { content } = useSiteContent()
  const [savedRhythm, setSavedRhythm] = useState<SavedRhythm | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(RHYTHM_STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as SavedRhythm
      if (parsed.answers && isCompleteRhythm(parsed.answers)) setSavedRhythm(parsed)
    } catch {}
  }, [])

  const savedResult = savedRhythm ? buildRhythmResult(savedRhythm.answers) : null
  const featuredLinks = content.tiktokLinks.filter((link) => link.isFeatured && link.url)

  const heroImages = [
    content.homepageImageUrl || "/assets/piclicorice/home-hero-mobile-4x5.png",
    "/assets/piclicorice/piclicorice_home_finest_at_50_v2_16x9.png",
    "/assets/piclicorice/home-hero-watch-aime-16x10.png",
    "/assets/piclicorice/piclicorice_shop_routine_basics_v2_16x9.png",
  ].filter(Boolean)

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader actionLabel="Explore Picks" actionHref="/shop" />

      <main className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
        <section className="grid gap-8 pt-6 sm:pt-10 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div className="xl:order-1">
            <div className="pl-kicker mb-4">The Skincare Edit</div>
            <h1 className="max-w-[680px] text-[44px] font-semibold leading-[0.94] tracking-tighter sm:text-6xl">
              Join your finest era.
            </h1>
            <p className="mt-5 max-w-[560px] text-base leading-relaxed text-black/60 sm:text-lg">
              Stop guessing what works. Simple routines, glow-forward formulas, and products worth keeping in rotation.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href="/subscribe"
                className="shop-now-button flex h-14 items-center justify-center rounded-full px-7 text-sm font-bold tracking-[0.08em]"
              >
                Subscribe
              </Link>
              <Link
                href="/routine"
                className="pl-soft-button flex h-14 items-center justify-center rounded-full px-7 text-sm font-semibold text-black"
              >
                Start
              </Link>
            </div>
            {savedResult && (
              <Link
                href="/routine"
                className="pl-card pl-card-teal mt-5 block p-5"
              >
                <div className="pl-kicker pl-kicker-pink mb-2 text-[10px]">Welcome back</div>
                <div className="text-sm font-semibold">Your current rhythm is {savedResult.summaryTags}.</div>
                <p className="mt-2 text-xs leading-relaxed text-black/52">Open your rhythm and keep the routine calm.</p>
              </Link>
            )}
          </div>

          <div className="media-card relative aspect-[4/5] overflow-hidden sm:aspect-[16/10] xl:order-2">
            {heroImages.map((src, index) => (
              <img
                key={`${src}-${index}`}
                src={src}
                alt="PicLicorice skincare editorial"
                className="home-media-slide absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: index === 0 ? content.homepageImagePosition : "center center",
                  animationDelay: `${index * 6}s`,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-[#faf8f4]/86 via-white/24 to-black/5" />
            <div className="absolute bottom-5 left-5 right-5 rounded-[24px] border border-white/50 bg-white/72 p-5 shadow-[0_16px_48px_rgba(41,35,31,0.12)] backdrop-blur">
              <div className="pl-kicker text-[10px]">PicLicorice</div>
              <div className="mt-1 text-xl font-semibold tracking-tight">Honoring skin&apos;s natural beauty.</div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <Link href="/subscribe" className="pl-card pl-card-pink p-6">
            <div className="pl-kicker pl-kicker-pink mb-3">Weekly drop</div>
            <h2 className="text-2xl font-semibold tracking-tight">Newsletter + simple PDF.</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/58">One calm note, one useful download, then you move on.</p>
          </Link>
          <Link href="/formula" className="pl-card pl-card-teal p-6">
            <div className="pl-kicker mb-3">Finest</div>
            <h2 className="text-2xl font-semibold tracking-tight">The ingredient map.</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/58">Hydrators, retinoids, barrier support, antioxidants, and more.</p>
          </Link>
          <Link href="/shop" className="pl-card pl-card-teal p-6">
            <div className="pl-kicker mb-3">Picks</div>
            <h2 className="text-2xl font-semibold tracking-tight">Choose by need.</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/58">Browse by lifestyle, skin concern, or age group before opening the shop.</p>
          </Link>
        </section>

        {featuredLinks.length > 0 && (
          <section className="mt-10">
            <div className="mb-5">
              <div className="pl-kicker mb-1">Join us on TikTok</div>
              <div className="text-lg font-medium">Social links from Aime</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {featuredLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-card pl-card-pink group flex min-h-28 items-center gap-4 p-4 hover:border-[#B01F85]/35 active:border-[#B01F85]/50"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#111111] text-2xl text-white shadow-[0_12px_24px_rgba(17,17,17,0.14)]">
                    <FaTiktok className="relative z-10" aria-hidden="true" />
                    <FaTiktok className="absolute -translate-x-0.5 translate-y-0.5 text-[#25F4EE] opacity-85" aria-hidden="true" />
                    <FaTiktok className="absolute translate-x-0.5 -translate-y-0.5 text-[#FE2C55] opacity-85" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="pl-kicker text-[10px]">TikTok</div>
                    <div className="mt-1 text-sm font-semibold">{link.label}</div>
                    {link.description && <div className="mt-1 text-xs leading-relaxed text-black/55">{link.description}</div>}
                  </div>
                  <div className="rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-black/38 group-hover:text-[#B01F85]">
                    Open
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
