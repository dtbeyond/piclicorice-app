import { RoutineStep } from "../types/routine"
import { Product } from "../data/products"
export function getProductsForStep(step: RoutineStep, allProducts: Product[]): Product[] {
  if (!step.recommendedCategories || step.recommendedCategories.length === 0) {
    return []
  }
  const matches = allProducts
    .filter(product => 
      product.approvedByAime &&
      product.categories.some(cat => 
        step.recommendedCategories.includes(cat)
      )
    )
  // Density rule: default 2, only 3 if categories are broad AND products feel different
  const maxProducts = (step.recommendedCategories.length >= 2 && matches.length >= 3) ? 3 : 2
  return matches.slice(0, maxProducts)
}
