export type AgeRange =
  | "under25"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55plus"
export type SkinType =
  | "dry"
  | "oily"
  | "combination"
  | "sensitive"
  | "not-sure"
export type Concern =
  | "skin-barrier"
  | "wrinkles"
  | "sun-spots"
  | "texture"
  | "uneven-tone"
  | "redness"
  | "dryness"
  | "oiliness"
  | "acne-prone"
  | "product-not-working"
export type RoutineInput = {
  ageRange: AgeRange
  skinType: SkinType
  concerns: Concern[]
  productText: string
}
export type RoutineStep = {
  time: "AM" | "PM"
  order: number
  name: string
  purpose: string
  ingredientLogic: string
  productSuggestion?: string
  recommendedCategories: string[]   // for product matching
  productSuggestionIds?: string[]   // optional explicit IDs
}
export type CompatibilityWarning = {
  level: "mild" | "medium" | "strong"
  title: string
  explanation: string
}
export type RoutineResult = {
  working: string[]
  missing: string[]
  issues: string[]
  warnings: CompatibilityWarning[]
  amRoutine: RoutineStep[]
  pmRoutine: RoutineStep[]
  summary: string
}
