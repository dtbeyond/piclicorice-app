"use client"

import React from "react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { useSiteContent } from "@/lib/useSiteContent"

const pickPaths = [
  {
    title: "By age group",
    eyebrow: "20s / 30s / 40s / 50+",
    body: "Start with skin stage and timing, then keep the picks realistic.",
  },
  {
    title: "By lifestyle",
    eyebrow: "Daily rhythm",
    body: "Diet, hydration, sleep, stress, sun exposure, environment, habits, and current routine.",
  },
  {
    title: "By skin concern",
    eyebrow: "Most common",
    body: "Acne, eczema, psoriasis, rosacea, sun damage, aging, and irritation-aware support.",
  },
]

const lifestyleBuckets = ["Diet + hydration", "Sleep + stress", "Sun + environment", "Personal substances", "Daily habits + skincare"]
const concernBuckets = ["Acne", "Eczema", "Psoriasis", "Rosacea", "Sun damage + aging", "Skin irritation"]

export default function ShopPageInner() {
  const { content } = useSiteContent()

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[760px] px-4 pt-10 sm:px-6">
        <section className="media-card">
          <div className="bg-white">
            <img
              src="/assets/piclicorice/piclicorice_shop_routine_basics_v2_16x9.png"
              alt="Aime's skincare product picks"
              className="h-64 w-full object-cover sm:h-72"
              style={{ objectPosition: content.shopImagePosition }}
            />
            <div className="p-7">
              <div className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-[#7C9C9B]">Aime&apos;s Picks</div>
              <h1 className="mb-4 max-w-[560px] text-5xl font-semibold leading-none tracking-tighter">
                Explore picks after the edit.
              </h1>
              <p className="mb-7 max-w-[540px] text-[15px] leading-relaxed text-black/60">
                Shop by age group, lifestyle, or skin concern so the product path feels guided before it opens Aime&apos;s TikTok Shop.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={content.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-now-button inline-flex h-16 items-center justify-center rounded-full px-9 font-bold tracking-[0.08em]"
                >
                  EXPLORE PICKS
                </a>
                <Link
                  href="/routine"
                  className="inline-flex h-16 items-center justify-center rounded-full border border-black/15 bg-white/60 px-8 font-semibold text-black"
                >
                  Start First
                </Link>
              </div>
              <div className="mt-5 font-mono text-[10px] tracking-widest text-black/35">OPENS TIKTOK SHOP</div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {pickPaths.map((path) => (
            <div key={path.title} className="rounded-[24px] border border-black/10 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/12 p-5">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B01F85]">{path.eyebrow}</div>
              <h2 className="text-xl font-semibold tracking-tight">{path.title}</h2>
              <p className="mt-3 text-xs leading-relaxed text-black/58">{path.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white/80 p-6">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#7C9C9B]">Lifestyle lens</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {lifestyleBuckets.map((bucket) => (
              <div key={bucket} className="rounded-[18px] border border-black/10 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/10 px-4 py-3 text-sm font-semibold">
                {bucket}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white/80 p-6">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#7C9C9B]">Skin concern lens</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {concernBuckets.map((bucket) => (
              <div key={bucket} className="rounded-[18px] border border-black/10 bg-linear-to-br from-white via-[#fff7fc] to-[#B01F85]/8 px-4 py-3 text-sm font-semibold">
                {bucket}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-[#7C9C9B]/28 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/12 p-6">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#7C9C9B]">Coming next</div>
          <p className="text-sm leading-relaxed text-black/60">
            These sections are staged for Aime to attach real picks, popups, and condition-aware notes without making the page feel like a chaotic catalog.
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
