"use client"

import React from "react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { useSiteContent } from "@/lib/useSiteContent"

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
                Explore picks that fit the rhythm.
              </h1>
              <p className="mb-7 max-w-[540px] text-[15px] leading-relaxed text-black/60">
                Start with simple, vetted skincare picks through Aime&apos;s TikTok Shop. This page keeps guidance first, so shopping supports the rhythm instead of replacing it.
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
                  Start Your Rhythm First
                </Link>
              </div>
              <div className="mt-5 font-mono text-[10px] tracking-widest text-black/35">OPENS TIKTOK SHOP</div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[24px] border border-black/10 bg-white p-6">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-[#7C9C9B]">Men&apos;s Essentials</div>
          <p className="text-sm leading-relaxed text-black/60">
            Coming next. For launch, this stays simple so Aime can update product direction directly in TikTok Shop.
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
