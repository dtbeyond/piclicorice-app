"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { buildRhythmResult, isCompleteRhythm, RHYTHM_STORAGE_KEY, type SavedRhythm } from "@/lib/rhythm"
import { useSiteContent } from "@/lib/useSiteContent"

export default function PicLicoriceHome() {
  const { content } = useSiteContent()
  const [videoPlaying, setVideoPlaying] = useState(false)
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

  const concernCards = [
    {
      label: "My rhythm feels random",
      body: "Get the order, rhythm, and missing basics cleaned up first.",
      param: "product-not-working",
      tone: "from-[#7C9C9B]/28 via-white to-[#faf8f4]",
    },
    {
      label: "Dry or tight skin",
      body: "Start with hydration and barrier support before stronger actives.",
      param: "dryness",
      tone: "from-[#f5eee8] via-white to-[#7C9C9B]/18",
    },
    {
      label: "Redness or irritation",
      body: "Find a calmer path that does not keep provoking your skin.",
      param: "redness",
      tone: "from-[#B01F85]/10 via-white to-[#faf8f4]",
    },
    {
      label: "Aging, spots, or texture",
      body: "Prioritize steady support without turning your shelf into chaos.",
      param: "wrinkles",
      tone: "from-[#f8f1e7] via-white to-[#7C9C9B]/20",
    },
  ]

  const homeMediaImages = [
    {
      src: content.homepageImageUrl,
      mobileSrc:
        content.homepageImageUrl === "/assets/piclicorice/piclicorice_home_hero_watch_aime_first_v2_16x10.png"
          ? "/assets/piclicorice/piclicorice_home_hero_mobile_backup_v2_4x5.png"
          : "",
      alt: "PicLicorice skincare coaching",
      position: content.homepageImagePosition,
    },
    {
      src: "/assets/piclicorice/piclicorice_shop_routine_basics_v2_16x9.png",
      mobileSrc: "",
      alt: "Skincare rhythm products",
      position: "center center",
    },
    {
      src: "/assets/piclicorice/piclicorice_home_finest_at_50_v2_16x9.png",
      mobileSrc: "",
      alt: "Finest at 50 skincare coaching",
      position: content.finestImagePosition,
    },
    {
      src: "/assets/piclicorice/home-hero-watch-aime-16x10.png",
      mobileSrc: "",
      alt: "Warm skincare editorial",
      position: "center center",
    },
  ].filter((image) => image.src)

  const cardSlideshowImages = [
    "/assets/piclicorice/piclicorice_shop_routine_basics_v2_16x9.png",
    "/assets/piclicorice/piclicorice_home_finest_at_50_v2_16x9.png",
    "/assets/piclicorice/piclicorice_home_hero_watch_aime_first_v2_16x10.png",
  ]

  const featuredLinks = content.tiktokLinks.filter((link) => link.isFeatured && link.url)

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader actionLabel="Start Your Rhythm" actionHref="/routine" actionVariant="shop" />

      <main className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
        <section className="grid gap-8 pt-6 sm:pt-10 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <button
            onClick={() => setVideoPlaying(true)}
            className="media-card group relative flex aspect-[4/5] w-full items-center justify-center text-left sm:aspect-[16/10] xl:order-2"
          >
            <div className="absolute inset-0 bg-[#f7f4ef]/92" />
            {content.homepageVideoUrl ? (
              <video
                src={content.homepageVideoUrl}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              homeMediaImages.map((image, index) => (
                <picture key={`${image.src}-${index}`} className="home-media-slide absolute inset-0">
                  {image.mobileSrc && <source media="(max-width: 640px)" srcSet={image.mobileSrc} />}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: image.position }}
                  />
                </picture>
              ))
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#faf8f4]/82 via-white/28 to-black/5" />
            <div className="relative z-10 flex flex-col items-center px-8 text-center text-black">
              <div className="play-glow mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-[#111111] bg-white transition-transform group-active:scale-95">
                <div className="ml-1 h-0 w-0 border-y-[13px] border-l-[20px] border-y-transparent border-l-[#B01F85]" />
              </div>
              <div className="rounded-full bg-white/82 px-5 py-2 text-sm font-semibold tracking-tight shadow-[0_12px_24px_rgba(17,17,17,0.08)]">
                Watch Aime first
              </div>
            </div>
            <div className="absolute bottom-4 right-4 rounded-full bg-white/80 px-3 py-1 font-mono text-[10px] tracking-widest text-black/55">
              {content.homepageVideoUrl ? "PLAY INTRO" : "ART ROTATION"}
            </div>
          </button>

          <div className="xl:order-1">
            <div className="mb-4 font-mono text-xs uppercase tracking-[0.22em] text-[#7C9C9B]">Warm skincare coaching</div>
            <h1 className="max-w-[680px] text-[42px] font-semibold leading-[0.96] tracking-tighter sm:text-6xl">
              Stop guessing what works. Let&apos;s find your rhythm step by step.
            </h1>
            <p className="mt-5 max-w-[560px] text-base leading-relaxed text-black/58 sm:text-lg">
              Informed shopping, gentle education, and routines that help you feel seen before you buy.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <Link
                href="/routine"
                className="shop-now-button flex aspect-square min-h-[132px] items-center justify-center rounded-[24px] p-4 text-center text-sm font-bold uppercase tracking-[0.12em] transition-transform active:scale-[0.99] sm:min-h-[148px]"
              >
                {savedResult ? "Open My Rhythm" : "Start Your Rhythm"}
              </Link>
              <Link
                href="/shop"
                className="flex aspect-square min-h-[132px] items-center justify-center rounded-[24px] border border-black/12 bg-white/72 p-4 text-center text-sm font-semibold text-black shadow-[0_10px_24px_rgba(17,17,17,0.04)] transition-all hover:border-[#7C9C9B]/55 hover:bg-white active:scale-[0.99] sm:min-h-[148px]"
              >
                Explore Aime&apos;s Picks
              </Link>
              <Link
                href="/formula"
                className="flex aspect-square min-h-[132px] items-center justify-center rounded-[24px] border border-[#7C9C9B]/35 bg-white/52 p-4 text-center text-sm font-semibold text-black transition-all hover:border-[#7C9C9B] hover:bg-white active:scale-[0.99] sm:min-h-[148px]"
              >
                Finest at 50
              </Link>
              <Link
                href="/contact"
                className="flex aspect-square min-h-[132px] items-center justify-center rounded-[24px] border border-[#7C9C9B]/35 bg-white/52 p-4 text-center text-sm font-semibold text-black transition-all hover:border-[#7C9C9B] hover:bg-white active:scale-[0.99] sm:min-h-[148px]"
              >
                Follow Aime
              </Link>
            </div>

            <div className="mt-4 text-xs tracking-wide text-black/45">
              Browse freely. Sign up only when you want downloads, saved rhythms, or files.
            </div>
          </div>
        </section>

        {content.homepageVideoUrl && (
          <section className="media-card mt-10">
            <video src={content.homepageVideoUrl} controls playsInline className="aspect-video w-full object-cover" />
          </section>
        )}

        <section className="mt-12 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Link href="/formula" className="flush-card border border-[#7C9C9B]/35 bg-white text-black transition-transform active:scale-[0.99]">
            <div className="bg-linear-to-br from-white via-[#f7f4ef] to-[#7C9C9B]/20 p-7">
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B01F85]">New from Aime</div>
              <div className="mb-3 text-3xl font-semibold leading-none tracking-tighter">Finest at 50 Method</div>
              <p className="text-sm leading-relaxed text-black/62">Your skin reflects how you live, not just what you apply.</p>
            </div>
            <div className="relative aspect-video overflow-hidden">
              {cardSlideshowImages.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="PicLicorice editorial skincare"
                  className="home-media-slide absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: index === 1 ? content.finestImagePosition : "center center" }}
                />
              ))}
              <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
            </div>
          </Link>

          <div className="flush-card border border-black/10 bg-white p-7">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#7C9C9B]">Not sure where to start?</div>
            <div className="mb-3 text-2xl font-semibold tracking-tight">Choose what feels familiar.</div>
            <p className="mb-5 text-sm leading-relaxed text-black/55">
              Pick the doorway that sounds most like you. Aime&apos;s rhythm builder will narrow it from there.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {concernCards.map((chip, index) => (
                <Link
                  key={chip.param}
                  href={`/routine?concern=${chip.param}`}
                  className={`group relative min-h-[138px] overflow-hidden rounded-[22px] border border-black/10 bg-linear-to-br ${chip.tone} p-4 transition-all hover:border-[#B01F85]/45 hover:bg-white`}
                >
                  <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/78 font-mono text-[11px] text-[#B01F85]">
                    0{index + 1}
                  </span>
                  <span className="block text-[15px] font-semibold leading-tight">{chip.label}</span>
                  <span className="mt-2 block text-xs leading-relaxed text-black/55">{chip.body}</span>
                  <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-black/32 group-hover:text-[#B01F85]">
                    Start
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {savedRhythm && savedResult && (
          <section className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6">
            <div className="mb-2 font-mono text-sm tracking-widest text-[#B01F85]">WELCOME BACK</div>
            <div className="mb-2 text-xl font-semibold tracking-tight">Your current rhythm is {savedResult.summaryTags}.</div>
            <p className="mb-5 max-w-[560px] text-sm leading-relaxed text-black/58">
              Aime would keep this calm and repeatable before adding more products.
            </p>
            <div className="flex gap-3">
              <Link href="/routine" className="flex-1 rounded-2xl bg-[#111111] py-3 text-center text-sm font-semibold text-white">
                Open My Rhythm
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem(RHYTHM_STORAGE_KEY)
                  window.dispatchEvent(new Event("piclicorice-rhythm-updated"))
                  setSavedRhythm(null)
                }}
                className="flex-1 rounded-2xl border border-black/15 py-3 text-center text-sm"
              >
                Start Fresh
              </button>
            </div>
          </section>
        )}

        {featuredLinks.length > 0 && (
          <section className="mt-12">
            <div className="mb-5">
              <div className="mb-1 font-mono text-xs uppercase tracking-[1.5px] text-[#7C9C9B]">From Aime</div>
              <div className="text-lg font-medium">Featured TikTok links</div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {featuredLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-28 items-center gap-4 rounded-[24px] border border-black/10 bg-linear-to-br from-white via-[#faf8f4] to-[#B01F85]/8 p-4 transition-all hover:border-[#B01F85]/35 active:border-[#B01F85]/50"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-[#111111] text-2xl font-black text-white shadow-[0_12px_24px_rgba(17,17,17,0.14)]">
                    <span className="absolute -left-0.5 top-3 text-[#25F4EE] opacity-90">♪</span>
                    <span className="absolute left-1 top-2 text-[#FE2C55] opacity-90">♪</span>
                    <span className="relative">♪</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7C9C9B]">TikTok</div>
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

        <section className="media-card mt-12">
          <div className="grid gap-4 bg-white/72 p-7 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#7C9C9B]">Ready when you are</div>
              <h2 className="text-3xl font-semibold leading-none tracking-tighter">Leave with a rhythm, not another tab.</h2>
              <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-black/58">
                Start with Aime&apos;s rhythm builder, then explore picks only when they fit the plan.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
              <Link href="/routine" className="flex h-14 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-sm font-semibold">
                Start Your Rhythm
              </Link>
              <Link href="/shop" className="shop-now-button flex h-14 items-center justify-center rounded-full px-6 text-sm font-bold tracking-[0.08em]">
                Aime&apos;s Picks
              </Link>
            </div>
          </div>
        </section>
      </main>

      {videoPlaying && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/75 p-6" onClick={() => setVideoPlaying(false)}>
          <div className="w-full max-w-[420px]" onClick={(event) => event.stopPropagation()}>
            <div className="rounded-[2rem] bg-white p-8 text-center text-black">
              {content.homepageVideoUrl ? (
                <video src={content.homepageVideoUrl} controls autoPlay playsInline className="aspect-video w-full rounded-[24px] object-cover" />
              ) : (
                <>
                  <div className="mb-4 font-mono text-sm tracking-[2px] text-[#B01F85]">AIME / FOUNDER</div>
                  <div className="mb-7 text-2xl leading-tight tracking-tight">
                    If your products are not working, it is usually the rhythm.
                  </div>
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#7C9C9B]/40 bg-[#faf8f4] text-3xl">
                    PL
                  </div>
                  <div className="mx-auto max-w-[280px] text-sm leading-relaxed text-black/55">
                    Upload an MP4 or paste a hosted video URL in Admin - Media 1 to replace this preview.
                  </div>
                </>
              )}
              <button onClick={() => setVideoPlaying(false)} className="mt-8 font-mono text-xs tracking-widest text-black/45 hover:text-black">
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
