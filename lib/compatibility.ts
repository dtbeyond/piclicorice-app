import { RoutineInput, CompatibilityWarning } from "../types/routine"
import { ingredients, Ingredient } from "../data/ingredients"
export function detectConflicts(input: RoutineInput, matchedIngredients: Ingredient[]): CompatibilityWarning[] {
  const warnings: CompatibilityWarning[] = []
  const productTextLower = input.productText.toLowerCase()
  const hasRetinol = matchedIngredients.some(i => i.id === "retinol") || productTextLower.includes("retinol") || productTextLower.includes("retinoid")
  const hasAcids = matchedIngredients.some(i => ["salicylic-acid", "lactic-acid"].includes(i.id)) || 
                   productTextLower.includes("salicylic") || productTextLower.includes("lactic acid") || productTextLower.includes("aha") || productTextLower.includes("bha")
  const hasVitaminC = matchedIngredients.some(i => i.id === "vitamin-c") || productTextLower.includes("vitamin c")
  const hasHyaluronic = matchedIngredients.some(i => i.id === "hyaluronic-acid") || productTextLower.includes("hyaluronic")
  const hasMoisturizer = productTextLower.includes("moisturizer") || productTextLower.includes("cream") || productTextLower.includes("lotion")
  // Retinol + Acids
  if (hasRetinol && hasAcids) {
    warnings.push({
      level: "medium",
      title: "Retinol + Exfoliating Acids",
      explanation: "Using retinol and exfoliating acids too often can irritate your skin or damage your barrier. Consider using them on separate nights."
    })
  }
  // Retinol without SPF
  if (hasRetinol && !productTextLower.includes("spf") && !productTextLower.includes("sunscreen")) {
    warnings.push({
      level: "strong",
      title: "Retinol Without SPF",
      explanation: "If you use retinol, SPF is important during the day. Retinol can make your skin more sun-sensitive. Add a broad-spectrum SPF to your AM routine."
    })
  }
  // Hyaluronic without moisturizer
  if (hasHyaluronic && !hasMoisturizer) {
    warnings.push({
      level: "mild",
      title: "Hydration Without Seal",
      explanation: "Hyaluronic acid works best when sealed with a moisturizer. Consider adding one after your hydration step."
    })
  }
  // Sensitive skin + strong actives
  if (input.skinType === "sensitive" && (hasRetinol || hasAcids)) {
    warnings.push({
      level: "medium",
      title: "Strong Actives on Sensitive Skin",
      explanation: "Retinol or acids may be too strong if your skin is sensitive or your barrier is stressed. Start slowly and patch test."
    })
  }
  // Acne-prone + Coconut Oil
  if (input.concerns.includes("acne-prone") && productTextLower.includes("coconut oil")) {
    warnings.push({
      level: "medium",
      title: "Coconut Oil on Acne-Prone Skin",
      explanation: "Coconut oil can clog pores for acne-prone skin. Consider swapping it for a lighter oil or non-comedogenic moisturizer."
    })
  }
  return warnings
}
