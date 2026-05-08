"use client"

import React, { useMemo, useState } from "react"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { ingredients, type Ingredient } from "@/data/ingredients"
import { useSiteContent } from "@/lib/useSiteContent"

const methodThemes = [
  ["Hydration", "Keep the rhythm soft, steady, and water-supportive before chasing stronger actives.", "from-[#7C9C9B]/20 via-white to-[#faf8f4]"],
  ["Maturity", "Work with the skin you have now instead of forcing a routine built for someone else.", "from-[#f5eee8] via-white to-[#B01F85]/8"],
  ["Internal Balance", "Rest, stress, nutrition, and consistency all show up on the surface.", "from-white via-[#faf8f4] to-[#7C9C9B]/16"],
  ["Consistency", "Small steps repeated calmly beat a shelf full of products used chaotically.", "from-[#fff7fc] via-white to-[#7C9C9B]/12"],
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

export default function FinestAt50MethodPage() {
  const { content } = useSiteContent()
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [expandedIds, setExpandedIds] = useState<string[]>(["hyaluronic-acid"])

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

        <section className="mb-8 rounded-[24px] border border-black/10 bg-white p-7 text-black sm:p-9">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B01F85]">Finest at 50 Method</div>
          <h1 className="mb-4 max-w-[720px] text-4xl font-semibold leading-[0.98] tracking-tighter sm:text-6xl">
            Your skin reflects how you live, not just what you apply.
          </h1>
          <p className="max-w-[620px] text-[15px] leading-relaxed text-black/62">
            This is skincare with less panic and more rhythm: hydration, maturity, internal balance, and consistency over chaos.
          </p>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {methodThemes.map(([title, body, tone]) => (
            <div key={title} className={`rounded-[24px] border border-black/10 bg-linear-to-br ${tone} p-5`}>
              <div className="mb-2 text-lg font-semibold tracking-tight">{title}</div>
              <p className="text-xs leading-relaxed text-black/60">{body}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[#7C9C9B]">Ingredient Library</div>
          <h2 className="mb-3 text-3xl font-semibold tracking-tighter">A calm reference, not a shopping panic list.</h2>
          <p className="mb-6 text-[15px] leading-relaxed text-black/60">
            Search by ingredient or filter by need. Open each card for pairing notes, caution notes, and Aime&apos;s plain-English read.
          </p>

          <div className="mb-4 grid gap-3 rounded-[24px] border border-[#7C9C9B]/28 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/12 p-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search ingredients, goals, or keywords"
              className="h-12 rounded-full border border-black/10 bg-[#faf8f4] px-5 text-sm outline-none placeholder:text-black/35 focus:border-[#B01F85]"
            />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveCategory(filter.value)}
                  className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-all ${
                    activeCategory === filter.value
                      ? "border-[#111111] bg-white text-[#B01F85] shadow-[0_8px_16px_rgba(176,31,133,0.10)]"
                      : "border-black/10 bg-white/70 text-black/62 hover:bg-white"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-black/45">
              <span className="rounded-full bg-[#7C9C9B]/12 px-3 py-1">AM: daytime friendly</span>
              <span className="rounded-full bg-[#B01F85]/8 px-3 py-1">PM: evening preferred</span>
              <span className="rounded-full bg-[#f3efea] px-3 py-1">Either: flexible placement</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredIngredients.map((ingredient) => {
              const expanded = expandedIds.includes(ingredient.id)

              return (
                <article
                  key={ingredient.id}
                  className="rounded-[24px] border border-black/10 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/10 p-5 shadow-[0_10px_24px_rgba(17,17,17,0.03)]"
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
                        <div key={label} className="rounded-[18px] border border-white/70 bg-linear-to-br from-white via-[#faf8f4] to-[#7C9C9B]/10 p-4">
                          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7C9C9B]">{label}</div>
                          <div className="text-sm leading-relaxed text-black/64">{value}</div>
                        </div>
                      ))}
                      <div className="rounded-[18px] border border-[#B01F85]/10 bg-linear-to-br from-[#fff7fc] via-white to-[#B01F85]/8 p-4 sm:col-span-2">
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#B01F85]">Aime&apos;s note</div>
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

      <BottomNav />
    </div>
  )
}
