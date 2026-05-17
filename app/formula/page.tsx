"use client"

import React, { useMemo, useState } from "react"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { ingredients, type Ingredient } from "@/data/ingredients"
import { useSiteContent } from "@/lib/useSiteContent"

const finestThemes = [
  ["Hydration", "Keep the rhythm soft, steady, and water-supportive before chasing stronger actives.", "from-[#9FC8CA]/20 via-white to-[#fbf7f2]"],
  ["Maturity", "Work with the skin you have now instead of forcing a routine built for someone else.", "from-[#f5eee8] via-white to-[#0F7F91]/8"],
  ["Internal Balance", "Rest, stress, nutrition, and consistency all show up on the surface.", "from-white via-[#fbf7f2] to-[#9FC8CA]/16"],
  ["Consistency", "Small steps repeated calmly beat a shelf full of products used chaotically.", "from-[#f9e4e6] via-white to-[#9FC8CA]/12"],
]

const categoryFilters = [
  { value: "all", label: "All" },
  { value: "hydration", label: "Hydration" },
  { value: "skin-barrier", label: "Barrier" },
  { value: "redness", label: "Redness" },
  { value: "anti-aging", label: "Aging" },
  { value: "texture", label: "Texture" },
  { value: "glow", label: "Glow" },
]

const finestDiscoveryCards = [
  {
    title: "Next-gen hydrators",
    eyebrow: "Water + bounce",
    body: "Modern hydration is about more than one serum. Think humectants, barrier sealers, and formulas that help skin stay comfortable longer.",
    examples: ["hyaluronic acid", "glycerin", "polyglutamic acid", "beta-glucan"],
    note: "Start here when skin feels dry, tight, dull, or overworked.",
  },
  {
    title: "Smart aging actives",
    eyebrow: "Firmness + tone",
    body: "A calmer way to support mature skin: steady ingredients, realistic timing, and no pressure to overdo the strongest product first.",
    examples: ["peptides", "niacinamide", "vitamin C", "growth-factor style products"],
    note: "Best when the base routine is already steady.",
  },
  {
    title: "Retinoid evolution",
    eyebrow: "Texture + renewal",
    body: "Retinoids can be powerful, but the win is consistency and tolerance. Frequency matters as much as strength.",
    examples: ["retinol", "retinal", "bakuchiol", "recovery nights"],
    note: "Go slow if skin is reactive, dry, or newly irritated.",
  },
  {
    title: "Barrier & healing support",
    eyebrow: "Comfort first",
    body: "When skin feels hot, tight, itchy, flaky, or easily bothered, barrier support belongs before aggressive correction.",
    examples: ["ceramides", "panthenol", "centella", "colloidal oatmeal"],
    note: "This is often the missing piece when nothing seems to work.",
  },
  {
    title: "Antioxidants & environmental defense",
    eyebrow: "Daily protection",
    body: "Sun, pollution, stress, and environment all add up. Antioxidants pair best with daily SPF and a routine you actually repeat.",
    examples: ["vitamin C", "green tea", "resveratrol", "coenzyme Q10"],
    note: "A good daytime category for glow and prevention.",
  },
  {
    title: "Microbiome + skin health",
    eyebrow: "Balance",
    body: "Skin does better when it is not constantly stripped. Gentle cleansing and supportive formulas help the surface stay less chaotic.",
    examples: ["prebiotics", "postbiotics", "gentle cleansers", "barrier creams"],
    note: "Useful when skin feels easily thrown off.",
  },
  {
    title: "Specialty vision stars",
    eyebrow: "Targeted support",
    body: "These are the promising or condition-aware products Aime may want to explain carefully before they land in someone's routine.",
    examples: ["hyperpigmentation support", "body skin support", "sensitive-skin tools", "integrative care"],
    note: "Good for future content, popups, and deeper education.",
  },
]

function pairsWellWith(ingredient: Ingredient) {
  if (ingredient.categories.includes("hydration")) return "Moisturizer, ceramides, glycerin, and SPF."
  if (ingredient.categories.includes("anti-aging")) return "Hydration, barrier support, peptides, and daily SPF."
  if (ingredient.categories.includes("redness")) return "Ceramides, panthenol, gentle cleanser, and simple moisturizer."
  if (ingredient.categories.includes("oily-skin")) return "Lightweight hydration, niacinamide, and non-heavy moisturizers."
  return "A simple cleanser, moisturizer, and SPF."
}

function avoidMixingWith(ingredient: Ingredient) {
  if (ingredient.id === "retinol") return "Strong acids, scrubs, and too many active serums on the same night."
  if (ingredient.id === "vitamin-c") return "Very strong exfoliants if your skin is already reactive."
  if (ingredient.id === "salicylic-acid" || ingredient.id === "lactic-acid") return "Retinol on the same night until your skin is very steady."
  if (ingredient.categories.includes("skin-barrier")) return "Nothing major. Keep it simple if your skin is irritated."
  return ingredient.avoidIf || "Over-layering with several new products at once."
}

function bestFor(ingredient: Ingredient) {
  return ingredient.categories
    .slice(0, 3)
    .map((category) => category.replace(/-/g, " "))
    .join(" / ")
}

export default function FinestAt50Page() {
  const { content } = useSiteContent()
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedIds, setExpandedIds] = useState<string[]>(["hyaluronic-acid"])
  const [activeDiscovery, setActiveDiscovery] = useState<(typeof finestDiscoveryCards)[number] | null>(null)

  const filteredIngredients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return ingredients.filter((ingredient) => {
      const matchesCategory = activeCategory === "all" || ingredient.categories.includes(activeCategory)
      const matchesQuery =
        !normalizedQuery ||
        ingredient.name.toLowerCase().includes(normalizedQuery) ||
        ingredient.keywords.some((keyword) => keyword.toLowerCase().includes(normalizedQuery)) ||
        ingredient.whatItDoes.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[900px] px-4 pt-8 sm:px-6">
        <section className="media-card relative mb-6 aspect-[16/9]">
          {content.finestVideoUrl ? (
            <video
              src={content.finestVideoUrl}
              controls
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: content.finestImagePosition }}
            />
          ) : content.finestImageUrl ? (
            <img
              src={content.finestImageUrl}
              alt="Finest at 50 skincare lineup"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: content.finestImagePosition }}
            />
          ) : (
            <div className="absolute inset-0 bg-[#f7f4ef]/92" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/18 via-transparent to-white/5" />
        </section>

        <section className="pl-card mb-8 p-7 text-black sm:p-9">
          <div className="pl-kicker pl-kicker-pink mb-3">Finest at 50</div>
          <h1 className="mb-4 max-w-[720px] text-4xl font-semibold leading-[0.98] tracking-tighter sm:text-6xl">
            Your skin reflects how you live, not just what you apply.
          </h1>
          <p className="max-w-[620px] text-[15px] leading-relaxed text-black/62">
            This is skincare with less panic and more rhythm: hydration, maturity, internal balance, and consistency over chaos.
          </p>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {finestThemes.map(([title, body, tone]) => (
            <div key={title} className={`pl-card bg-linear-to-br ${tone} p-5`}>
              <div className="mb-2 text-lg font-semibold tracking-tight">{title}</div>
              <p className="text-xs leading-relaxed text-black/60">{body}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <div className="pl-kicker mb-3">Join your finest era</div>
          <h2 className="mb-3 text-3xl font-semibold tracking-tighter">Tap a category and let it make sense.</h2>
          <p className="mb-5 max-w-[680px] text-[15px] leading-relaxed text-black/60">
            These are the owner&apos;s content lanes: ingredient families Aime can explain without turning the page into a product wall.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {finestDiscoveryCards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => setActiveDiscovery(card)}
                className="pl-card pl-card-teal group min-h-36 p-5 text-left transition-all hover:border-[#0F7F91]/25"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="h-2 w-10 rounded-full bg-linear-to-r from-[#0F7F91] to-[#9FC8CA]" />
                  <span className="pl-kicker text-[10px] group-hover:text-[#0F7F91]">
                    Open
                  </span>
                </div>
                <div className="pl-kicker text-[10px]">{card.eyebrow}</div>
                <div className="mt-2 text-xl font-semibold tracking-tight">{card.title}</div>
                <p className="mt-3 text-xs leading-relaxed text-black/58">{card.note}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="pl-kicker mb-3">Ingredient Library</div>
          <h2 className="mb-3 text-3xl font-semibold tracking-tighter">A calm reference, not a shopping panic list.</h2>
          <p className="mb-6 text-[15px] leading-relaxed text-black/60">
            Search by ingredient or filter by need. Open each card for pairing notes, caution notes, and Aime&apos;s plain-English read.
          </p>

          <div className="pl-card pl-card-teal mb-4 grid gap-3 p-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ingredients, goals, or keywords"
              className="h-12 rounded-full border border-black/10 bg-[#fbf7f2] px-5 text-sm outline-none placeholder:text-black/35 focus:border-[#0F7F91]"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveCategory(filter.value)}
                  className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-all ${
                    activeCategory === filter.value
                      ? "border-[#111A33] bg-white text-[#0F7F91] shadow-[0_8px_16px_rgba(15,127,145,0.10)]"
                      : "pl-soft-button border-black/10 text-black/62"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-black/45">
              <span className="rounded-full bg-[#9FC8CA]/12 px-3 py-1">AM: daytime friendly</span>
              <span className="rounded-full bg-[#0F7F91]/8 px-3 py-1">PM: evening preferred</span>
              <span className="rounded-full bg-[#f3efea] px-3 py-1">Either: flexible placement</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredIngredients.map((ingredient) => {
              const expanded = expandedIds.includes(ingredient.id)

              return (
                <article
                  key={ingredient.id}
                  className="pl-card pl-card-teal p-5"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(ingredient.id)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                  >
                    <span>
                      <span className="block text-xl font-semibold tracking-tight">{ingredient.name}</span>
                      <span className="mt-2 block text-sm leading-relaxed text-black/62">{ingredient.whatItDoes}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-[#f3efea] px-3 py-1 font-mono text-[10px] text-black/55">
                        {ingredient.routinePlacement || "Either"}
                      </span>
                      <span className="text-xl text-black/45">{expanded ? "-" : "+"}</span>
                    </span>
                  </button>

                  {expanded && (
                    <div className="mt-5 grid gap-3 border-t border-black/10 pt-5 sm:grid-cols-2">
                      {[
                        ["Best for", bestFor(ingredient)],
                        ["Pairs well with", pairsWellWith(ingredient)],
                        ["Avoid mixing with", avoidMixingWith(ingredient)],
                        ["Go slow if", ingredient.avoidIf || "Your skin feels hot, tight, itchy, or newly irritated."],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-[18px] border border-white/70 bg-linear-to-br from-white via-[#fbf7f2] to-[#9FC8CA]/10 p-4">
                          <div className="pl-kicker mb-1 text-[10px]">{label}</div>
                          <div className="text-sm leading-relaxed text-black/64">{value}</div>
                        </div>
                      ))}
                      <div className="rounded-[18px] border border-[#0F7F91]/10 bg-linear-to-br from-[#f9e4e6] via-white to-[#0F7F91]/8 p-4 sm:col-span-2">
                        <div className="pl-kicker pl-kicker-pink mb-1 text-[10px]">Aime&apos;s note</div>
                        <div className="text-sm leading-relaxed text-black/68">{ingredient.whyItMatters}</div>
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      </main>

      {activeDiscovery && (
        <div className="fixed inset-0 z-[220] flex items-end bg-black/35 p-4 backdrop-blur-sm sm:items-center sm:justify-center" onClick={() => setActiveDiscovery(null)}>
          <div
            className="pl-card w-full max-w-[560px] bg-[#fbf7f2] p-6 text-black shadow-[0_24px_80px_rgba(17,17,17,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="pl-kicker">{activeDiscovery.eyebrow}</div>
                <h2 className="mt-2 text-3xl font-semibold tracking-tighter">{activeDiscovery.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveDiscovery(null)}
                className="pl-soft-button flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                aria-label="Close"
              >
                x
              </button>
            </div>
            <p className="text-sm leading-relaxed text-black/64">{activeDiscovery.body}</p>
            <div className="mt-5 grid gap-2">
              {activeDiscovery.examples.map((example) => (
                <div key={example} className="rounded-[18px] border border-black/10 bg-white/72 px-4 py-3 text-sm font-semibold capitalize">
                  {example}
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[20px] border border-[#0F7F91]/12 bg-linear-to-br from-[#f9e4e6] via-white to-[#0F7F91]/8 p-4">
              <div className="pl-kicker pl-kicker-pink mb-1 text-[10px]">Aime&apos;s note</div>
              <div className="text-sm leading-relaxed text-black/66">{activeDiscovery.note}</div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
