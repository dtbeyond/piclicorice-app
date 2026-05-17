"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { FaTiktok } from "react-icons/fa"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { buildRhythmResult, isCompleteRhythm, RHYTHM_STORAGE_KEY, type SavedRhythm } from "@/lib/rhythm"
import { useSiteContent } from "@/lib/useSiteContent"

const tickerItems = [
  "New rituals dropping weekly",
  "Inside-out transformation",
  "No more survivor mode",
  "Tested by me, loved by us",
  "Finest at 50 - a lifestyle movement",
]

function FinestTicker() {
  const items = [...tickerItems, ...tickerItems]

  return (
    <section className="pl-ticker mt-12" aria-label="PicLicorice highlights">
      <div className="pl-ticker-track">
        {[0, 1].map((group) => (
          <div key={group} className="pl-ticker-group" aria-hidden={group === 1}>
            {items.map((item, index) => (
              <span key={`${group}-${item}-${index}`} className="pl-ticker-item">
                {index % 5 === 0 && "💌 "}
                {index % 5 === 1 && "🌸 "}
                {index % 5 === 2 && "💫 "}
                {index % 5 === 3 && "💙 "}
                {index % 5 === 4 && "✨ "}
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

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

      <main className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
        <section className="grid gap-8 pt-8 pb-12 sm:pt-12 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div className="xl:order-1">
            <div className="pl-pill mb-6 px-4 py-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#177f91]" />
              A lifestyle-beauty movement
            </div>
            <h1 className="pl-display max-w-[680px] text-[56px] leading-[0.95] text-[#111A33] sm:text-7xl">
              Your <em>finest</em> era starts now.
            </h1>
            <p className="mt-6 max-w-[560px] text-base leading-relaxed text-[#111A33]/64 sm:text-lg">
              Skincare, mindset, body &amp; soul rituals for women rewriting what aging looks like. No more survivor mode - only inside-out transformation.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-[0.9fr_1fr]">
              <Link
                href="/formula"
                className="shop-now-button flex h-14 items-center justify-center rounded-full px-7 text-sm font-bold"
              >
                Read my story
              </Link>
              <Link
                href="/shop"
                className="pl-soft-button flex h-14 items-center justify-center rounded-full px-7 text-sm font-semibold text-black"
              >
                ✨ Shop the rituals
              </Link>
            </div>
            <div className="mt-10 grid max-w-[520px] grid-cols-3 divide-x divide-[#111A33]/12 text-[#111A33]">
              {[
                ["47→50", "The journey"],
                ["100%", "Tested by me"],
                ["∞", "Soft & strong"],
              ].map(([value, label]) => (
                <div key={label} className="px-5 first:pl-0">
                  <div className="pl-display text-2xl leading-none">{value}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#111A33]/50">{label}</div>
                </div>
              ))}
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

          <div className="media-card relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-[0_28px_90px_rgba(17,26,51,0.18)] sm:aspect-[4/5] xl:order-2">
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
            <div className="absolute inset-0 bg-linear-to-t from-[#111A33]/64 via-transparent to-transparent" />
            <div className="absolute left-5 top-8 hidden rounded-[18px] border border-white/50 bg-white/70 px-5 py-4 shadow-[0_18px_48px_rgba(17,26,51,0.16)] backdrop-blur md:block">
              <div className="pl-kicker text-[10px]">Glow tracker</div>
              <div className="pl-display mt-1 text-xl">Day 84 ✨</div>
            </div>
            <div className="absolute bottom-6 left-5 right-5 rounded-[20px] border border-white/18 bg-[#111A33]/90 p-5 text-white shadow-[0_16px_48px_rgba(17,26,51,0.24)] backdrop-blur">
              <div className="font-serif text-sm font-semibold italic text-white/95">&quot;It&apos;s never too late to become your best self.&quot;</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7dfe2]">Founder, age 47</div>
            </div>
            <div className="absolute bottom-28 right-5 hidden rounded-[18px] border border-white/50 bg-white/52 px-5 py-4 shadow-[0_18px_48px_rgba(17,26,51,0.16)] backdrop-blur md:block">
              <div className="pl-kicker pl-kicker-pink text-[10px]">Mood</div>
              <div className="pl-display mt-1 text-xl">Soft &amp; strong</div>
            </div>
          </div>
        </section>
      </main>

      <FinestTicker />

      <main className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
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
                  className="pl-card pl-card-pink group flex min-h-28 items-center gap-4 p-4 hover:border-[#0F7F91]/35 active:border-[#0F7F91]/50"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#111A33] text-2xl text-white shadow-[0_12px_24px_rgba(17,17,17,0.14)]">
                    <FaTiktok className="relative z-10" aria-hidden="true" />
                    <FaTiktok className="absolute -translate-x-0.5 translate-y-0.5 text-[#25F4EE] opacity-85" aria-hidden="true" />
                    <FaTiktok className="absolute translate-x-0.5 -translate-y-0.5 text-[#FE2C55] opacity-85" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="pl-kicker text-[10px]">TikTok</div>
                    <div className="mt-1 text-sm font-semibold">{link.label}</div>
                    {link.description && <div className="mt-1 text-xs leading-relaxed text-black/55">{link.description}</div>}
                  </div>
                  <div className="rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-black/38 group-hover:text-[#0F7F91]">
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
