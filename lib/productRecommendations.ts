import { products, type BuilderRole, type Product, type ProductConcern } from "@/data/products"
import type { CompleteRhythmAnswers, RhythmResult, RoutineState, SkinFeel } from "@/lib/rhythm"

export type RitualProductRecommendation = {
  slot: BuilderRole
  label: string
  timing: "AM" | "PM"
  product: Product
}

export type RitualProductSet = {
  core: RitualProductRecommendation[]
  asNeeded: Product[]
}

const coreSlots: { slot: BuilderRole; label: string; timing: "AM" | "PM" }[] = [
  { slot: "cleanser", label: "Cleanser", timing: "AM" },
  { slot: "serum", label: "Serum", timing: "AM" },
  { slot: "moisturizer", label: "Moisturizer", timing: "AM" },
  { slot: "spf", label: "SPF", timing: "AM" },
  { slot: "cleanser", label: "Cleanser", timing: "PM" },
  { slot: "serum", label: "Support serum", timing: "PM" },
  { slot: "moisturizer", label: "Moisturizer", timing: "PM" },
]

function hasSkinFeel(answers: CompleteRhythmAnswers, value: SkinFeel) {
  return answers.skinFeel.includes(value)
}

function hasRoutineState(answers: CompleteRhythmAnswers, value: RoutineState) {
  return answers.routineState.includes(value)
}

export function getRitualConcernTags(answers: CompleteRhythmAnswers): ProductConcern[] {
  const tags = new Set<ProductConcern>()

  if (hasSkinFeel(answers, "dry-tight") || answers.goal === "hydration") {
    tags.add("hydration")
    tags.add("dry-skin")
    tags.add("barrier-repair")
  }

  if (hasSkinFeel(answers, "red-irritated") || answers.sensitivity === "easily" || answers.goal === "calmer") {
    tags.add("sensitive-skin")
    tags.add("redness")
    tags.add("barrier-repair")
  }

  if (hasSkinFeel(answers, "uneven-texture") || answers.goal === "aging") {
    tags.add("aging")
    tags.add("texture")
    tags.add("dark-spots")
  }

  if (hasRoutineState(answers, "too-many") || answers.goal === "simpler" || answers.goal === "consistency") {
    tags.add("barrier-repair")
    tags.add("sensitive-skin")
  }

  if (tags.size === 0) {
    tags.add("hydration")
    tags.add("barrier-repair")
  }

  return [...tags]
}

function productTimingFits(product: Product, timing: "AM" | "PM") {
  if (product.useTiming === "both") return true
  if (timing === "AM") return product.useTiming === "am"
  return product.useTiming === "pm"
}

function scoreProduct({
  product,
  slot,
  timing,
  concernTags,
  sensitive,
  allowTreatments,
}: {
  product: Product
  slot: BuilderRole
  timing?: "AM" | "PM"
  concernTags: ProductConcern[]
  sensitive: boolean
  allowTreatments: boolean
}) {
  if (!product.approvedByAime || !product.builderEligible) return -Infinity
  if (!product.builderRoles.includes(slot)) return -Infinity
  if (sensitive && product.avoidIfSensitive) return -Infinity
  if (!allowTreatments && (product.isTreatment || product.isEventOnly)) return -Infinity
  if (timing && !productTimingFits(product, timing)) return -Infinity

  let score = 100
  score += product.concerns.filter((tag) => concernTags.includes(tag)).length * 18
  if (sensitive && product.concerns.includes("sensitive-skin")) score += 16
  if (product.concerns.includes("barrier-repair")) score += 8
  if (product.isKorean) score += 6
  if (product.isVegan) score += 3
  if (product.isEventOnly) score -= 18
  if (product.isTreatment) score -= 8

  return score
}

function bestProductForSlot(slot: BuilderRole, timing: "AM" | "PM", concernTags: ProductConcern[], sensitive: boolean) {
  return products
    .map((product) => ({
      product,
      score: scoreProduct({ product, slot, timing, concernTags, sensitive, allowTreatments: false }),
    }))
    .filter((item) => item.score > -Infinity)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))[0]?.product
}

export function recommendProductsForRitual(answers: CompleteRhythmAnswers, result: RhythmResult): RitualProductSet {
  const sensitive = answers.sensitivity === "easily" || answers.skinFeel.includes("red-irritated")
  const concernTags = getRitualConcernTags(answers)
  const usedIds = new Set<string>()

  const core = coreSlots
    .map((slot) => {
      const product = bestProductForSlot(slot.slot, slot.timing, concernTags, sensitive)
      if (product) usedIds.add(product.id)
      return product ? { ...slot, product } : null
    })
    .filter((item): item is RitualProductRecommendation => Boolean(item))

  const asNeeded = products
    .filter((product) => !usedIds.has(product.id))
    .map((product) => ({
      product,
      score: Math.max(
        scoreProduct({ product, slot: "treatment", concernTags, sensitive, allowTreatments: true }),
        scoreProduct({ product, slot: "event", concernTags, sensitive, allowTreatments: true })
      ),
    }))
    .filter((item) => item.score >= 108)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .slice(0, result.pickCategories.includes("texture") || result.pickCategories.includes("anti-aging") ? 3 : 2)
    .map((item) => item.product)

  return { core, asNeeded }
}
