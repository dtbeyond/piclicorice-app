"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { FaTiktok } from "react-icons/fa"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { buildRhythmResult, isCompleteRhythm, normalizeRhythmAnswers, RHYTHM_STORAGE_KEY, type SavedRhythm } from "@/lib/rhythm"
import { useSiteContent } from "@/lib/useSiteContent"

type EducationPanel = {
  title: string
  intro: string
  sections: { label: string; body: string }[]
}

type GuidedEntry = {
  label: string
  description: string
  href?: string
  panel?: EducationPanel
}

const founderPortraitUrl = "/assets/piclicorice/founder-portrait-CT9BX5H9.webp"

const tickerItems = [
  "New weekly drops",
  "Inside-out transformation",
  "Consistency over intensity",
  "Guidance before shopping",
  "Finest at 50 as self-investment",
]

const guidedEntries: GuidedEntry[] = [
  {
    label: "Start Your Skin Edit",
    description: "Answer a few simple questions and leave with a calmer plan.",
    href: "/routine",
  },
  {
    label: "Dry Skin",
    description: "Start with comfort, hydration, and barrier support.",
    panel: {
      title: "Dry Skin",
      intro: "Dry skin can feel tight, dull, flaky, or uncomfortable. The goal is not more products. It is better support.",
      sections: [
        { label: "What you may notice", body: "Tightness after washing, rough patches, makeup sitting unevenly, or skin that feels like it needs comfort quickly." },
        { label: "Common reasons", body: "Weather changes, over-cleansing, not enough moisturizing support, or using strong treatments before the basics feel steady." },
        { label: "Simple management", body: "Keep cleansing gentle, add a hydration layer, seal with moisturizer, and let the routine stay boring long enough to work." },
        { label: "Dry vs. dehydrated", body: "Dry skin needs oil and barrier support. Dehydrated skin needs water support. Many people need a little of both." },
        { label: "Product guidance", body: "Look for glycerin, hyaluronic acid, ceramides, and soft moisturizers. Patch test first and start slowly." },
      ],
    },
  },
  {
    label: "Sensitive Skin",
    description: "Choose fewer steps and make irritation less likely.",
    panel: {
      title: "Sensitive Skin",
      intro: "Sensitive skin usually does best when the routine is predictable, gentle, and not crowded with strong actives.",
      sections: [
        { label: "What you may notice", body: "Stinging, redness, heat, or skin that reacts quickly when you change products." },
        { label: "Common reasons", body: "Too many new products, fragrance, harsh scrubs, alcohol-heavy toners, or strong acids used too often." },
        { label: "Simple management", body: "Change one thing at a time, give each step room to prove itself, and keep treatment products occasional." },
        { label: "Product guidance", body: "Barrier support, ceramides, gentle hydration, and low-stress moisturizers are usually a calmer starting point." },
      ],
    },
  },
  {
    label: "Acne",
    description: "Calm the routine before chasing every breakout.",
    panel: {
      title: "Acne-Prone Skin",
      intro: "Breakouts are frustrating, but the first move is usually a routine your skin can tolerate consistently.",
      sections: [
        { label: "What you may notice", body: "Clogged pores, recurring bumps, inflamed spots, or breakouts that worsen after product changes." },
        { label: "Common reasons", body: "Heavy products, stress, inconsistent cleansing, makeup removal gaps, or harsh acne products used too aggressively." },
        { label: "Simple management", body: "Start with a gentle cleanser, light hydration, moisturizer, and SPF. Add treatment slowly only when the base is steady." },
        { label: "Product guidance", body: "Avoid scrubs and essential-oil-heavy clean beauty products if your skin is reactive. Patch test first and start slowly." },
      ],
    },
  },
  {
    label: "Skin Longevity",
    description: "Support skin over time without panic-buying stronger formulas.",
    panel: {
      title: "Skin Longevity",
      intro: "Skin longevity is about consistency, sun care, barrier support, and choosing active ingredients with patience.",
      sections: [
        { label: "What helps most", body: "Daily SPF, steady moisture, antioxidants, repair-focused nights, and treatments used at a frequency your skin can handle." },
        { label: "What to avoid", body: "Stacking every strong active at once or treating your skin like it has to be fixed overnight." },
        { label: "Product guidance", body: "Retinoids, peptides, vitamin C, and barrier creams can all have a place, but the order and timing matter." },
      ],
    },
  },
  {
    label: "Glow Maintenance",
    description: "Keep brightness soft, realistic, and not over-exfoliated.",
    panel: {
      title: "Glow Maintenance",
      intro: "A healthy glow usually comes from hydrated, calm, protected skin, not from constantly resurfacing it.",
      sections: [
        { label: "What helps", body: "Hydration, SPF, gentle exfoliation only when needed, and enough moisturizer to keep the skin comfortable." },
        { label: "Go slow if", body: "You are sensitive, dry, red, or already using treatment products. More glow should not mean more irritation." },
        { label: "Product guidance", body: "Vitamin C, mild exfoliants, and glow-focused serums can help, but you may not need them if your basics are not steady yet." },
      ],
    },
  },
  {
    label: "Low-Stress Skincare",
    description: "Build a routine you can repeat on real-life days.",
    panel: {
      title: "Low-Stress Skincare",
      intro: "The best routine is not the most impressive one. It is the one you can keep when life is full.",
      sections: [
        { label: "Simple plan", body: "Cleanse, hydrate, moisturize, protect in the morning. Cleanse, support, moisturize at night." },
        { label: "What to skip", body: "Impulse buying, overlapping treatments, and products you only use because the internet made them feel urgent." },
        { label: "Product guidance", body: "Choose fewer products with clearer jobs. You can always add later when your skin feels calm." },
      ],
    },
  },
]

const philosophyPoints = [
  ["Less is better", "You do not need a ten-step routine to take yourself seriously."],
  ["Consistency over perfection", "Your skin does not need a perfect week. It needs a plan you can return to."],
  ["Pause before buying", "Not every trending product belongs on your shelf, even if it is a good product."],
  ["Calm is the goal", "Skincare should make the day feel more grounded, not more overwhelming."],
]

const recommendationCards = [
  {
    title: "Barrier-first basics",
    for: "For skin that feels dry, tight, reactive, or inconsistent.",
    why: "These options support comfort before adding stronger treatment steps.",
    skip: "You may not need this if your skin already feels balanced and comfortable.",
  },
  {
    title: "Glow support",
    for: "For dullness, uneven tone, or skin that looks tired but not angry.",
    why: "These picks can support brightness while keeping the routine realistic.",
    skip: "This may not be ideal for very reactive skin until the barrier feels calmer.",
  },
  {
    title: "As-needed treatments",
    for: "For specific concerns, events, or targeted support outside the daily core.",
    why: "Treatments can help, but they do not have to become everyday pressure.",
    skip: "Patch test first and start slowly, especially with active ingredients.",
  },
]

function FinestTicker() {
  return (
    <section className="pl-ticker mt-12" aria-label="PicLicorice highlights">
      <div className="pl-ticker-track">
        {[0, 1].map((group) => (
          <div key={group} className="pl-ticker-group" aria-hidden={group === 1}>
            {tickerItems.map((item, index) => (
              <span key={`${group}-${item}-${index}`} className="pl-ticker-item">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function PanelDialog({ entry, onClose }: { entry: GuidedEntry; onClose: () => void }) {
  if (!entry.panel) return null

  return (
    <div className="fixed inset-0 z-[260] bg-[#111A33]/38 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="mx-auto flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[32px] border border-black/10 bg-[#fbf7f2] shadow-[0_28px_90px_rgba(17,26,51,0.26)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/10 p-6 sm:p-7">
          <div>
            <div className="pl-kicker mb-2">Quick guide</div>
            <h2 className="text-3xl font-semibold tracking-tight">{entry.panel.title}</h2>
            <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-black/60">{entry.panel.intro}</p>
          </div>
          <button type="button" onClick={onClose} className="pl-soft-button h-10 rounded-full px-4 text-sm font-semibold">
            Close
          </button>
        </div>
        <div className="overflow-y-auto p-6 sm:p-7">
          <div className="grid gap-3 sm:grid-cols-2">
            {entry.panel.sections.map((section) => (
              <div key={section.label} className="rounded-[22px] border border-black/8 bg-white/72 p-4">
                <div className="pl-kicker mb-2 text-[10px]">{section.label}</div>
                <p className="text-sm leading-relaxed text-black/64">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[22px] border border-[#0F7F91]/18 bg-[#DDF1F1]/32 p-4 text-xs leading-relaxed text-black/55">
            This is for informational purposes only and is not medical advice. For medical concerns, diagnosis, or treatment, consult a qualified professional.
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/routine" className="shop-now-button inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-bold" onClick={onClose}>
              Start Your Skin Edit
            </Link>
            <Link href="/shop" className="pl-soft-button inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold" onClick={onClose}>
              Browse Skin Favorites
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PicLicoriceHome() {
  const { content } = useSiteContent()
  const [savedRhythm, setSavedRhythm] = useState<SavedRhythm | null>(null)
  const [activeEntry, setActiveEntry] = useState<GuidedEntry | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(RHYTHM_STORAGE_KEY) || localStorage.getItem("pl_rhythm")
    if (!saved) return

    try {
      const parsed = JSON.parse(saved) as SavedRhythm
      const normalizedAnswers = normalizeRhythmAnswers(parsed.answers)
      if (isCompleteRhythm(normalizedAnswers)) setSavedRhythm({ answers: normalizedAnswers, savedAt: parsed.savedAt })
    } catch {}
  }, [])

  const savedResult = savedRhythm ? buildRhythmResult(savedRhythm.answers) : null
  const featuredLinks = content.tiktokLinks.filter((link) => link.isFeatured && link.url)

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader actionLabel="Weekly Drop" actionHref="/subscribe" />

      <main className="mx-auto w-full max-w-[1120px] px-4 sm:px-6">
        <section className="grid gap-8 pt-8 pb-10 sm:pt-12 xl:grid-cols-[1fr_1fr] xl:items-center">
          <div className="xl:order-1">
            <div className="pl-pill mb-6 px-4 py-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-[#177f91]" />
              A lifestyle-beauty movement
            </div>
            <h1 className="pl-display max-w-[680px] text-[52px] leading-[0.96] text-[#111A33] sm:text-7xl">
              Your <em>finest</em> era starts now.
            </h1>
            <p className="mt-6 max-w-[560px] text-base leading-relaxed text-[#111A33]/64 sm:text-lg">
              Calm skincare guidance for women investing in themselves through realistic routines, honest education, and self-care that reduces overwhelm.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_0.9fr]">
              <Link href="/routine" className="shop-now-button flex h-14 items-center justify-center rounded-full px-7 text-sm font-bold">
                Start Your Skin Edit
              </Link>
              <a href="#founder-note" className="pl-soft-button flex h-14 items-center justify-center rounded-full px-7 text-sm font-semibold text-black">
                Read the Founder Note
              </a>
            </div>
            <div className="mt-10 grid max-w-[520px] grid-cols-3 divide-x divide-[#111A33]/12 text-[#111A33]">
              {[
                ["47 to 50", "Self-investment"],
                ["Less", "Better"],
                ["Calm", "Over chaos"],
              ].map(([value, label]) => (
                <div key={label} className="px-5 first:pl-0">
                  <div className="pl-display text-2xl leading-none">{value}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#111A33]/50">{label}</div>
                </div>
              ))}
            </div>
            {savedResult && (
              <Link href="/routine" className="pl-card pl-card-teal mt-5 block p-5">
                <div className="pl-kicker pl-kicker-pink mb-2 text-[10px]">Welcome back</div>
                <div className="text-sm font-semibold">Your current skin edit is {savedResult.summaryTags}.</div>
                <p className="mt-2 text-xs leading-relaxed text-black/52">Open your plan and keep the routine calm.</p>
              </Link>
            )}
          </div>

          <div className="media-card relative aspect-[4/5] overflow-hidden rounded-[32px] shadow-[0_28px_90px_rgba(17,26,51,0.18)] sm:aspect-[4/5] xl:order-2">
            <img
              src={founderPortraitUrl}
              alt="PicLicorice founder portrait"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: content.homepageImagePosition || "center center" }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#111A33]/64 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-5 right-5 rounded-[20px] border border-white/18 bg-[#111A33]/90 p-5 text-white shadow-[0_16px_48px_rgba(17,26,51,0.24)] backdrop-blur">
              <div className="font-serif text-sm font-semibold italic text-white/95">&quot;It&apos;s never too late to become your best self.&quot;</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f7dfe2]">Founder, age 47</div>
            </div>
          </div>
        </section>

        <section id="founder-note" className="pl-card pl-card-pink mt-4 p-7 sm:p-10">
          <div className="pl-kicker mb-5">Founder note</div>
          <blockquote className="pl-display max-w-[900px] text-3xl leading-[1.22] text-[#111A33] sm:text-5xl">
            &ldquo;I spent years surviving instead of thriving. At 47, I finally started building routines for my skin, mind, body, and soul.
            <br />
            <br />
            Finest at 50 is my promise to myself: to arrive at 50 stronger, softer, healthier, happier, and fully alive. And to prove it&apos;s never too late to become your best self.&rdquo;
          </blockquote>
          <div className="mt-8 font-serif text-2xl italic text-[#e9a5b7]">with love, the founder</div>
        </section>
      </main>

      <FinestTicker />

      <main className="mx-auto w-full max-w-[1040px] px-4 sm:px-6">
        <section className="mt-12">
          <div className="mb-5 max-w-[680px]">
            <div className="pl-kicker mb-3">Start gently</div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Choose the doorway that feels familiar.</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/58">
              These are guidance paths, not diagnoses. Start where you recognize yourself and keep the next step simple.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guidedEntries.map((entry) =>
              entry.href ? (
                <Link key={entry.label} href={entry.href} className="pl-card pl-card-teal min-h-36 p-5 transition-transform hover:-translate-y-0.5">
                  <div className="text-lg font-semibold tracking-tight">{entry.label}</div>
                  <p className="mt-3 text-sm leading-relaxed text-black/58">{entry.description}</p>
                  <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0F7F91]">Begin</div>
                </Link>
              ) : (
                <button
                  key={entry.label}
                  type="button"
                  onClick={() => setActiveEntry(entry)}
                  className="pl-card pl-card-teal min-h-36 p-5 text-left transition-transform hover:-translate-y-0.5"
                >
                  <div className="text-lg font-semibold tracking-tight">{entry.label}</div>
                  <p className="mt-3 text-sm leading-relaxed text-black/58">{entry.description}</p>
                  <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0F7F91]">Quick guide</div>
                </button>
              )
            )}
          </div>
        </section>

        <section className="pl-card mt-12 p-7 sm:p-9">
          <div className="pl-kicker mb-4">Calm philosophy</div>
          <h2 className="max-w-[760px] text-3xl font-semibold tracking-tight sm:text-4xl">
            Skincare should help you feel cared for, not crowded.
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {philosophyPoints.map(([title, body]) => (
              <div key={title} className="rounded-[24px] border border-black/8 bg-white/68 p-5">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/58">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 max-w-[760px]">
            <div className="pl-kicker mb-3">Curated skin collection</div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Recommendations should earn their place.</h2>
            <p className="mt-3 text-sm leading-relaxed text-black/58">
              Aime&apos;s favorites are organized to explain who each product is for, why it may help, and when you may want to skip it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {recommendationCards.map((card) => (
              <div key={card.title} className="pl-card pl-card-teal p-6">
                <h3 className="text-xl font-semibold tracking-tight">{card.title}</h3>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-black/60">
                  <p><span className="font-semibold text-black">Who it is for:</span> {card.for}</p>
                  <p><span className="font-semibold text-black">Why it may help:</span> {card.why}</p>
                  <p><span className="font-semibold text-black">Consider skipping:</span> {card.skip}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/shop" className="pl-soft-button mt-5 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold">
            Open Curated Skin Collection
          </Link>
        </section>

        {featuredLinks.length > 0 && (
          <section className="mt-12">
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

        <section className="media-card mt-12 p-8 text-center sm:p-12">
          <div className="pl-kicker mb-4">The Weekly Drop</div>
          <h2 className="pl-display mx-auto max-w-[720px] text-4xl leading-[1.05] sm:text-6xl">
            A calm note for the version of you that is trying.
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-sm leading-relaxed text-black/60 sm:text-base">
            Founder reflections, simple skincare education, guided product notes, and self-care reminders that help you slow down and take care of yourself.
          </p>
          <Link href="/subscribe" className="shop-now-button mt-8 inline-flex h-13 items-center justify-center rounded-full px-8 text-sm font-bold">
            Read the Weekly Drop
          </Link>
        </section>
      </main>

      {activeEntry && <PanelDialog entry={activeEntry} onClose={() => setActiveEntry(null)} />}
      <BottomNav />
    </div>
  )
}
