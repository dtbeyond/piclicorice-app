"use client"

import React from "react"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { ingredients } from "@/data/ingredients"
import { useSiteContent } from "@/lib/useSiteContent"

const methodThemes = [
  ["Hydration", "Keep the routine soft, steady, and water-supportive before chasing stronger actives."],
  ["Maturity", "Work with the skin you have now instead of forcing a routine built for someone else."],
  ["Internal Balance", "Rest, stress, nutrition, and consistency all show up on the surface."],
  ["Consistency", "Small steps repeated calmly beat a shelf full of products used chaotically."],
]

const ingredientGroups = [
  "Next Gen Hydrators",
  "Smart Anti-Aging Actives",
  "Barrier & Soothing Support",
  "Antioxidants & Environmental Defense",
  "Microbiome & Skin Health Innovators",
]

export default function FinestAt50MethodPage() {
  const { content } = useSiteContent()

  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[860px] px-4 pt-8 sm:px-6">
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

        <section className="mb-10 grid grid-cols-2 gap-3">
          {methodThemes.map(([title, body]) => (
            <div key={title} className="rounded-[24px] border border-black/10 bg-white p-5">
              <div className="mb-2 text-lg font-semibold tracking-tight">{title}</div>
              <p className="text-xs leading-relaxed text-black/60">{body}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <div className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-[#7C9C9B]">Skin Care Ingredients</div>
          <h2 className="mb-3 text-3xl font-semibold tracking-tighter">A calm reference, not a shopping panic list.</h2>
          <p className="mb-6 text-[15px] leading-relaxed text-black/60">
            Use this section to understand what an ingredient is doing and where it fits. You do not need everything at once.
          </p>

          <div className="mb-8 space-y-3">
            {ingredientGroups.map((group) => (
              <div key={group} className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm">
                {group}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {ingredients.slice(0, 10).map((ingredient) => (
              <article key={ingredient.id} className="rounded-[24px] border border-black/10 bg-white p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold tracking-tight">{ingredient.name}</h3>
                  <div className="rounded-full bg-[#f3efea] px-3 py-1 font-mono text-[10px] text-black/55">
                    {ingredient.routinePlacement || "Either"}
                  </div>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-black/65">{ingredient.whatItDoes}</p>
                <p className="text-xs leading-relaxed text-black/45">{ingredient.whoItsFor}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
