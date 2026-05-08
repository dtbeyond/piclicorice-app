import { RoutineInput, RoutineResult, RoutineStep, CompatibilityWarning } from "../types/routine"
import { ingredients, Ingredient } from "../data/ingredients"
import { detectConflicts } from "./compatibility"
import { products } from "../data/products"
import { getProductsForStep } from "./productMatcher"

function matchIngredients(productText: string): Ingredient[] {
  const text = productText.toLowerCase()
  return ingredients.filter((ingredient) =>
    ingredient.keywords.some((keyword) =>
      text.includes(keyword.toLowerCase())
    )
  )
}

function getAgeNotes(ingredient: Ingredient, ageRange: string): string {
  if (!ingredient.ageNotes) return ""
  switch (ageRange) {
    case "under25": return ingredient.ageNotes.under25 || ""
    case "25-34": return ingredient.ageNotes.age25to34 || ""
    case "35-44": return ingredient.ageNotes.age35to44 || ""
    case "45-54": return ingredient.ageNotes.age45to54 || ""
    case "55plus": return ingredient.ageNotes.age55plus || ""
    default: return ""
  }
}

export function generateRoutine(input: RoutineInput): RoutineResult {
  const matchedIngredients = matchIngredients(input.productText)
  const matchedNames = matchedIngredients.map(i => i.name)
  const matchedIds = new Set(matchedIngredients.map(i => i.id))

  const warnings: CompatibilityWarning[] = detectConflicts(input, matchedIngredients)

  // Analyze concerns and skin type to determine priorities
  const hasBarrierConcern = input.concerns.includes("skin-barrier") || input.skinType === "sensitive" || input.skinType === "dry"
  const hasAntiAging = input.concerns.includes("wrinkles") || input.ageRange === "45-54" || input.ageRange === "55plus"
  const hasGlow = input.concerns.includes("sun-spots") || input.concerns.includes("uneven-tone") || input.concerns.includes("texture")
  const hasOiliness = input.concerns.includes("oiliness") || input.skinType === "oily"
  const hasDryness = input.concerns.includes("dryness") || input.skinType === "dry"

  // What's working (based on matched + concerns)
  const working: string[] = []
  if (matchedIds.has("niacinamide")) working.push("Niacinamide is supporting your barrier and calming redness.")
  if (matchedIds.has("hyaluronic-acid") || matchedIds.has("glycerin")) working.push("Your hydration ingredients are helping skin hold moisture.")
  if (matchedIds.has("ceramides")) working.push("Ceramides are strengthening your skin barrier.")
  if (matchedIds.has("vitamin-c") && hasGlow) working.push("Vitamin C is helping with brightness and uneven tone.")
  if (matchedIds.has("retinol") && hasAntiAging) working.push("Retinol is addressing texture and signs of aging.")
  if (matchedIds.has("salicylic-acid") && hasOiliness) working.push("Salicylic acid is helping control oil and unclog pores.")
  if (working.length === 0) working.push("You're already using some supportive ingredients — great starting point!")

  // What's missing (core categories based on input)
  const missing: string[] = []
  if (!matchedIds.has("hyaluronic-acid") && !matchedIds.has("glycerin") && hasDryness) {
    missing.push("A dedicated hydration serum (hyaluronic acid or glycerin) to help skin hold water.")
  }
  if (!matchedIds.has("ceramides") && !matchedIds.has("niacinamide") && hasBarrierConcern) {
    missing.push("Barrier-supporting ingredients like ceramides or niacinamide.")
  }
  if (!matchedIds.has("retinol") && hasAntiAging && input.ageRange !== "under25") {
    missing.push("A gentle retinoid (retinol) for texture and fine lines — start low and slow.")
  }
  if (!matchedIds.has("vitamin-c") && hasGlow && input.ageRange !== "under25") {
    missing.push("Vitamin C in the morning for antioxidant protection and brightness.")
  }
  if (!input.productText.toLowerCase().includes("spf") && !input.productText.toLowerCase().includes("sunscreen")) {
    missing.push("Daily broad-spectrum SPF (essential for everyone, especially with actives).")
  }
  if (hasOiliness && !matchedIds.has("salicylic-acid")) {
    missing.push("A BHA like salicylic acid 1-2x/week for oil control and texture.")
  }
  if (missing.length === 0) missing.push("Your routine looks fairly complete for your concerns!")

  // Possible issues
  const issues: string[] = []
  if (warnings.length > 0) {
    issues.push("Some ingredient combinations may need adjustment (see warnings below).")
  }
  if (input.skinType === "sensitive" && (matchedIds.has("retinol") || matchedIds.has("salicylic-acid"))) {
    issues.push("Strong actives on sensitive skin — reduce frequency and monitor for irritation.")
  }
  if (input.productText.toLowerCase().includes("coconut oil") && input.concerns.includes("acne-prone")) {
    issues.push("Coconut oil may be contributing to congestion or breakouts.")
  }
  if (issues.length === 0) issues.push("No major red flags detected in your current routine.")

  // Generate human, Aime-style summary
  let summary = ""
  const hasAnyActives = matchedIds.has("retinol") || matchedIds.has("salicylic-acid") || matchedIds.has("lactic-acid") || matchedIds.has("vitamin-c")
  const hasHydration = matchedIds.has("hyaluronic-acid") || matchedIds.has("glycerin")
  const hasBarrier = matchedIds.has("ceramides") || matchedIds.has("niacinamide")
  const isMinimal = matchedIngredients.length === 0 || matchedIngredients.length < 2

  if (isMinimal) {
    summary = "Your routine is very minimal right now. That’s actually a great place to start — we can build something clean, effective, and easy to stick with."
  } else if (warnings.length > 1) {
    summary = "Your routine has some powerful ingredients, but the combinations and missing protection may be doing more harm than good right now. Let’s simplify and rebuild with intention."
  } else if (!hasHydration && !hasBarrier && hasAnyActives) {
    summary = "You’re using some strong actives, but without consistent hydration and barrier support, your skin may be struggling to keep up. Adding those two things will make everything else work better."
  } else if (hasAnyActives && hasHydration) {
    summary = "You have some good foundations here. A few small tweaks to order and protection will make this routine much more effective."
  } else {
    summary = "Your routine has some good basics, but it’s missing consistent hydration and barrier support. Adding these will make everything else work better."
  }

  // Build AM Routine
  const amRoutine: RoutineStep[] = []
  let order = 1

  amRoutine.push({
    time: "AM",
    order: order++,
    name: "Gentle Cleanser",
    purpose: "Removes overnight buildup without stripping the skin.",
    ingredientLogic: "Look for a mild, non-foaming cleanser with glycerin or ceramides.",
    recommendedCategories: ["skin-barrier"]
  })

  if (hasDryness || hasBarrierConcern) {
    amRoutine.push({
      time: "AM",
      order: order++,
      name: "Hydration Serum",
      purpose: "Helps your skin hold water before moisturizer.",
      ingredientLogic: "Hyaluronic acid, glycerin, or panthenol. Apply on damp skin.",
      recommendedCategories: ["hydration", "skin-barrier"]
    })
  }

  if (hasGlow || matchedIds.has("vitamin-c")) {
    amRoutine.push({
      time: "AM",
      order: order++,
      name: "Vitamin C Serum",
      purpose: "Brightens skin and provides antioxidant protection against daily stressors.",
      ingredientLogic: "Look for stable forms like sodium ascorbyl phosphate or ascorbic acid (10-20%).",
      recommendedCategories: ["glow", "sun-spots", "uneven-tone"]
    })
  } else if (matchedIds.has("niacinamide")) {
    amRoutine.push({
      time: "AM",
      order: order++,
      name: "Niacinamide Serum",
      purpose: "Strengthens barrier and calms redness.",
      ingredientLogic: "5-10% niacinamide works well in the morning.",
      recommendedCategories: ["skin-barrier", "redness", "inflammation"]
    })
  }

  amRoutine.push({
    time: "AM",
    order: order++,
    name: "Moisturizer",
    purpose: "Seals in hydration and supports the skin barrier.",
    ingredientLogic: "Ceramides, cholesterol, or fatty acids for barrier repair.",
    recommendedCategories: ["skin-barrier", "dry-skin"]
  })

  amRoutine.push({
    time: "AM",
    order: order++,
    name: "Broad-Spectrum SPF 30+",
    purpose: "Protects against UV damage, which is the #1 cause of premature aging and pigmentation.",
    ingredientLogic: "Mineral (zinc/titanium) or chemical filters. Reapply every 2 hours if outdoors.",
    recommendedCategories: ["sun-spots", "glow"]
  })

  // Build PM Routine
  const pmRoutine: RoutineStep[] = []
  order = 1

  pmRoutine.push({
    time: "PM",
    order: order++,
    name: "Gentle Cleanser",
    purpose: "Removes sunscreen, makeup, and daily grime.",
    ingredientLogic: "Double cleanse if wearing makeup or heavy sunscreen.",
    recommendedCategories: ["skin-barrier"]
  })

  if (hasAntiAging || matchedIds.has("retinol")) {
    pmRoutine.push({
      time: "PM",
      order: order++,
      name: "Retinol / Retinoid",
      purpose: "Promotes skin renewal, improves texture, and reduces fine lines over time.",
      ingredientLogic: "Start with 0.3% retinol 2-3x/week. Buffer with moisturizer if sensitive. Always use SPF the next day.",
      recommendedCategories: ["anti-aging", "texture", "wrinkles"]
    })
  } else if (hasOiliness || matchedIds.has("salicylic-acid")) {
    pmRoutine.push({
      time: "PM",
      order: order++,
      name: "BHA (Salicylic Acid)",
      purpose: "Exfoliates inside pores to reduce oiliness and prevent clogs.",
      ingredientLogic: "1-2% salicylic acid, 2-3x per week max. Avoid combining with retinol on the same night.",
      recommendedCategories: ["acne-prone", "texture", "oily-skin"]
    })
  } else if (matchedIds.has("niacinamide") || hasBarrierConcern) {
    pmRoutine.push({
      time: "PM",
      order: order++,
      name: "Niacinamide or Barrier Serum",
      purpose: "Repairs and strengthens the skin barrier while you sleep.",
      ingredientLogic: "Niacinamide + ceramides is an excellent evening combination.",
      recommendedCategories: ["skin-barrier", "redness", "inflammation"]
    })
  }

  pmRoutine.push({
    time: "PM",
    order: order++,
    name: "Moisturizer",
    purpose: "Locks in actives and supports overnight repair.",
    ingredientLogic: "Rich but non-comedonic formula with ceramides or peptides.",
    recommendedCategories: ["skin-barrier", "dry-skin"]
  })

  // Attach real vetted products to each step
  const finalAm = amRoutine.map(step => ({
    ...step,
    productSuggestionIds: getProductsForStep(step, products).map(p => p.id)
  }))

  const finalPm = pmRoutine.map(step => ({
    ...step,
    productSuggestionIds: getProductsForStep(step, products).map(p => p.id)
  }))

  return {
    working,
    missing,
    issues,
    warnings,
    amRoutine: finalAm,
    pmRoutine: finalPm,
    summary
  }
}
