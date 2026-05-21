"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { concernFilters, productCollections, products, type ProductCollection, type ProductConcern } from "@/data/products"
import { useSiteContent } from "@/lib/useSiteContent"

type ActiveCollection = ProductCollection | "all"
type ActiveConcern = ProductConcern | "all"

const collectionOptions: { id: ActiveCollection; label: string; description: string }[] = [
  { id: "all", label: "All", description: "Every approved option in Aime's current collection." },
  ...productCollections,
]

function productTimingLabel(timing: string) {
  if (timing === "am") return "AM"
  if (timing === "pm") return "PM"
  if (timing === "both") return "AM + PM"
  if (timing === "event") return "Occasional"
  return "Browse"
}

export default function ShopPageInner() {
  const { content } = useSiteContent()
  const [activeCollection, setActiveCollection] = useState<ActiveCollection>("all")
  const [activeConcern, setActiveConcern] = useState<ActiveConcern>("all")

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.approvedByAime) return false
      const matchesCollection = activeCollection === "all" || product.collection === activeCollection
      const matchesConcern = activeConcern === "all" || product.concerns.includes(activeConcern)

      return matchesCollection && matchesConcern
    })
  }, [activeCollection, activeConcern])

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader actionLabel="Start Ritual" actionHref="/routine" />

      <main className="mx-auto w-full max-w-[980px] px-4 pt-10 sm:px-6">
        <section className="media-card overflow-hidden">
          <div className="grid bg-white lg:grid-cols-[0.95fr_1.05fr]">
            <img
              src="/assets/piclicorice/piclicorice_shop_products_warm_square.webp"
              alt="Aime's curated skincare collection"
              className="h-72 w-full object-cover sm:h-96 lg:h-full"
              style={{ objectPosition: content.shopImagePosition }}
            />
            <div className="p-7 sm:p-9">
              <div className="pl-kicker mb-4">Skin Favorites</div>
              <h1 className="mb-4 max-w-[560px] text-5xl font-semibold leading-none tracking-tighter">
                Curated skincare collection.
              </h1>
              <p className="mb-7 max-w-[560px] text-[15px] leading-relaxed text-black/60">
                Browse Aime&apos;s approved options by simple category, then use concern filters when you want to narrow the shelf.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/routine"
                  className="shop-now-button inline-flex h-14 items-center justify-center rounded-full px-8 font-bold tracking-[0.08em]"
                >
                  START RITUAL
                </Link>
                <a
                  href={content.shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pl-soft-button inline-flex h-14 items-center justify-center rounded-full px-8 font-semibold text-black"
                >
                  TikTok Showcase
                </a>
              </div>
              <div className="mt-5 font-mono text-[10px] tracking-widest text-black/35">PRODUCT LINKS OPEN EXTERNALLY</div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <div className="pl-kicker mb-2">Categories</div>
              <h2 className="text-2xl font-semibold tracking-tight">Choose the shelf.</h2>
            </div>
            <div className="hidden text-sm text-black/45 sm:block">{visibleProducts.length} shown</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {collectionOptions.map((collection) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => setActiveCollection(collection.id)}
                className={`min-h-28 rounded-[24px] border p-4 text-left transition-all ${
                  activeCollection === collection.id
                    ? "border-[#111A33] bg-linear-to-br from-[#f9e4e6] via-white to-[#9FC8CA]/18 shadow-[0_18px_38px_rgba(15,127,145,0.10)]"
                    : "border-black/10 bg-white/72 hover:border-[#9FC8CA]/55"
                }`}
              >
                <div className="text-sm font-semibold tracking-tight">{collection.label}</div>
                <p className="mt-2 text-xs leading-relaxed text-black/52">{collection.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="pl-card pl-card-teal mt-8 p-5">
          <div className="pl-kicker mb-3">Concern filters</div>
          <div className="flex flex-wrap gap-2">
            {[{ id: "all" as const, label: "All Concerns" }, ...concernFilters].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveConcern(filter.id)}
                className={`h-10 rounded-full border px-4 text-sm font-semibold transition-all ${
                  activeConcern === filter.id
                    ? "border-[#111A33] bg-white text-[#0F7F91] shadow-[0_8px_18px_rgba(15,127,145,0.10)]"
                    : "border-black/10 bg-white/58 text-black/62 hover:bg-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <a
              key={product.id}
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-card group overflow-hidden bg-white/80 transition-all hover:-translate-y-0.5 hover:border-[#0F7F91]/32"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#fbf7f2]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#9FC8CA]/12 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#0F7F91]">
                    {productTimingLabel(product.useTiming)}
                  </span>
                  {product.isKorean && <span className="rounded-full bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-black/42">K-Beauty</span>}
                  {product.isVegan && <span className="rounded-full bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-black/42">Vegan</span>}
                  {product.isEventOnly && <span className="rounded-full bg-[#f9e4e6] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#B01F85]">Event</span>}
                </div>
                <h3 className="text-base font-semibold leading-tight">{product.name}</h3>
                <p className="mt-3 text-xs leading-relaxed text-black/55">{product.displayNote}</p>
                <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-[#0F7F91]">View Favorite</div>
              </div>
            </a>
          ))}
        </section>

        {visibleProducts.length === 0 && (
          <section className="pl-card mt-8 p-8 text-center">
            <div className="text-lg font-semibold">No products match that combination yet.</div>
            <p className="mt-2 text-sm text-black/55">Clear the filter or choose a broader category.</p>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
