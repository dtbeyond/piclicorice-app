export type Ingredient = {
  id: string
  name: string
  keywords: string[]
  categories: string[]
  whatItDoes: string
  whyItMatters: string
  whoItsFor: string
  avoidIf?: string
  routinePlacement?: "AM" | "PM" | "Either"
  compatibilityNotes?: string[]
  ageNotes?: {
    under25?: string
    age25to34?: string
    age35to44?: string
    age45to54?: string
    age55plus?: string
  }
}

export const ingredients: Ingredient[] = [
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    keywords: ["hyaluronic acid", "sodium hyaluronate"],
    categories: ["hydration", "most-common", "dry-skin"],
    whatItDoes: "Helps the skin hold water.",
    whyItMatters: "Hydrated skin can look smoother and feel less tight.",
    whoItsFor: "Most skin types, especially dry or mature skin.",
    avoidIf: "Usually well tolerated, but it should be sealed with moisturizer.",
    routinePlacement: "Either"
  },
  {
    id: "glycerin",
    name: "Glycerin",
    keywords: ["glycerin", "glycerine"],
    categories: ["hydration", "skin-barrier", "most-common"],
    whatItDoes: "Draws moisture into the skin.",
    whyItMatters: "Supports softness and barrier comfort.",
    whoItsFor: "Dry, sensitive, and mature skin.",
    avoidIf: "Rarely an issue.",
    routinePlacement: "Either"
  },
  {
    id: "niacinamide",
    name: "Niacinamide",
    keywords: ["niacinamide", "vitamin b3"],
    categories: ["skin-barrier", "redness", "inflammation", "glow", "oily-skin"],
    whatItDoes: "Supports the skin barrier and can help calm visible redness.",
    whyItMatters: "Helpful for uneven tone, oiliness, sensitivity, and dullness.",
    whoItsFor: "Most skin types.",
    avoidIf: "Some users may tingle or flush with high percentages.",
    routinePlacement: "Either"
  },
  {
    id: "retinol",
    name: "Retinol",
    keywords: ["retinol", "retinal", "retinoid", "retinyl palmitate"],
    categories: ["anti-aging", "texture", "wrinkles"],
    whatItDoes: "Supports skin renewal.",
    whyItMatters: "Commonly used for texture, fine lines, wrinkles, and uneven tone.",
    whoItsFor: "Users focused on visible aging signs or texture.",
    avoidIf: "Sensitive skin, pregnancy, or if not using sunscreen.",
    routinePlacement: "PM"
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    keywords: ["vitamin c", "ascorbic acid", "sodium ascorbyl phosphate"],
    categories: ["glow", "sun-spots", "uneven-tone", "anti-aging"],
    whatItDoes: "Helps brighten the look of skin and supports antioxidant care.",
    whyItMatters: "Useful for dullness, uneven tone, and sun spot appearance.",
    whoItsFor: "Users wanting brightness and glow.",
    avoidIf: "Very sensitive skin may react to stronger formulas.",
    routinePlacement: "AM"
  },
  {
    id: "ceramides",
    name: "Ceramides",
    keywords: ["ceramide", "ceramides"],
    categories: ["skin-barrier", "dry-skin", "mature-skin"],
    whatItDoes: "Supports the skin barrier.",
    whyItMatters: "A healthy barrier helps reduce dryness, tightness, and irritation.",
    whoItsFor: "Dry, sensitive, mature, or barrier-damaged skin.",
    avoidIf: "Rarely an issue.",
    routinePlacement: "Either"
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    keywords: ["salicylic acid", "bha"],
    categories: ["oily-skin", "acne-prone", "texture"],
    whatItDoes: "Helps exfoliate inside pores.",
    whyItMatters: "Useful for oiliness, clogged pores, and rough texture.",
    whoItsFor: "Oily or acne-prone skin.",
    avoidIf: "Very dry, sensitive, or irritated skin may not tolerate frequent use.",
    routinePlacement: "Either"
  },
  {
    id: "lactic-acid",
    name: "Lactic Acid",
    keywords: ["lactic acid", "aha"],
    categories: ["texture", "glow", "uneven-tone"],
    whatItDoes: "Gently exfoliates the surface of the skin.",
    whyItMatters: "Can help dullness and uneven texture.",
    whoItsFor: "Users wanting smoother, brighter-looking skin.",
    avoidIf: "Overuse may irritate sensitive or barrier-damaged skin.",
    routinePlacement: "PM"
  },
  {
    id: "coconut-oil",
    name: "Coconut Oil",
    keywords: ["coconut oil", "cocos nucifera oil"],
    categories: ["avoid-acne", "dry-skin"],
    whatItDoes: "Heavy emollient oil.",
    whyItMatters: "Can feel moisturizing but may clog pores for some users.",
    whoItsFor: "Very dry, non-acne-prone skin.",
    avoidIf: "Acne-prone or congestion-prone skin.",
    routinePlacement: "Either"
  },
  {
    id: "peptides",
    name: "Peptides",
    keywords: ["peptides", "peptide", "signal peptides", "copper peptides"],
    categories: ["anti-aging", "most-common", "skin-barrier"],
    whatItDoes: "Support skin's natural repair and collagen production.",
    whyItMatters: "Helps skin look firmer and smoother over time with less irritation than retinol.",
    whoItsFor: "Anyone focused on prevention or early signs of aging, especially sensitive skin.",
    avoidIf: "Rarely an issue.",
    routinePlacement: "Either"
  },
  {
    id: "panthenol",
    name: "Panthenol",
    keywords: ["panthenol", "vitamin b5", "provitamin b5", "d-panthenol"],
    categories: ["hydration", "skin-barrier", "most-common"],
    whatItDoes: "Soothes and hydrates while supporting barrier repair.",
    whyItMatters: "Reduces irritation and helps skin recover faster from treatments or exfoliation.",
    whoItsFor: "Dry, sensitive, or barrier-damaged skin. Excellent after strong actives.",
    avoidIf: "None.",
    routinePlacement: "Either"
  },
  {
    id: "azelaic-acid",
    name: "Azelaic Acid",
    keywords: ["azelaic acid", "azelaic", "finacea"],
    categories: ["redness", "inflammation", "acne-prone", "texture", "uneven-tone"],
    whatItDoes: "Calms redness, gently exfoliates, and targets acne-causing bacteria.",
    whyItMatters: "One of the best ingredients for rosacea, post-acne marks, and uneven tone without harsh side effects.",
    whoItsFor: "Sensitive, redness-prone, acne-prone, or pregnancy-safe routines.",
    avoidIf: "May cause mild stinging when first introduced.",
    routinePlacement: "Either"
  },
  {
    id: "zinc",
    name: "Zinc",
    keywords: ["zinc", "zinc pca", "zinc oxide", "zinc pyrithione"],
    categories: ["oily-skin", "acne-prone", "inflammation", "most-common"],
    whatItDoes: "Regulates sebum production and calms inflammation.",
    whyItMatters: "Helps control oil and prevent breakouts while soothing irritated skin.",
    whoItsFor: "Oily, combination, or acne-prone skin. Great for daytime use.",
    avoidIf: "None major.",
    routinePlacement: "Either"
  },
  {
    id: "squalane",
    name: "Squalane",
    keywords: ["squalane", "squalene", "olive squalane"],
    categories: ["hydration", "dry-skin", "most-common", "skin-barrier"],
    whatItDoes: "Lightweight, non-comedogenic emollient that mimics skin's natural oils.",
    whyItMatters: "Provides deep hydration without clogging pores — ideal for all skin types, including oily.",
    whoItsFor: "Dry, dehydrated, mature, or sensitive skin. Perfect under makeup or sunscreen.",
    avoidIf: "None.",
    routinePlacement: "Either"
  }
]
