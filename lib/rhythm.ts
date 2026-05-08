export const RHYTHM_STORAGE_KEY = "pl_rhythm"

export type RhythmAnswers = {
  skinFeel?: "dry-tight" | "dull-tired" | "red-irritated" | "uneven-texture" | "inconsistent"
  routineState?: "random" | "too-many" | "too-simple" | "skip-often" | "not-sure"
  sensitivity?: "rarely" | "sometimes" | "easily" | "not-sure"
  ageRange?: "25-34" | "35-44" | "45-54" | "55plus" | "prefer-not"
  goal?: "hydration" | "calmer" | "aging" | "simpler" | "consistency"
}

export type SavedRhythm = {
  answers: Required<RhythmAnswers>
  savedAt: string
}

export type RhythmResult = {
  profileLine: string
  summaryTags: string
  morning: string[]
  evening: string[]
  focusIngredients: string[]
  avoidOverdoing: string[]
  aimeNote: string
  pickCategories: string[]
}

export const rhythmLabels = {
  skinFeel: {
    "dry-tight": "Dry or tight",
    "dull-tired": "Dull or tired",
    "red-irritated": "Red or irritated",
    "uneven-texture": "Uneven texture",
    inconsistent: "I just feel inconsistent",
  },
  routineState: {
    random: "Random",
    "too-many": "Too many products",
    "too-simple": "Too simple",
    "skip-often": "I skip often",
    "not-sure": "I'm not sure what works",
  },
  sensitivity: {
    rarely: "Rarely reactive",
    sometimes: "Sometimes sensitive",
    easily: "Easily irritated",
    "not-sure": "I'm not sure",
  },
  ageRange: {
    "25-34": "25-34",
    "35-44": "35-44",
    "45-54": "45-54",
    "55plus": "55+",
    "prefer-not": "Prefer not to say",
  },
  goal: {
    hydration: "More hydration",
    calmer: "Calmer skin",
    aging: "Aging support",
    simpler: "Simpler routine",
    consistency: "Better consistency",
  },
} as const

export function isCompleteRhythm(answers: RhythmAnswers): answers is Required<RhythmAnswers> {
  return Boolean(answers.skinFeel && answers.routineState && answers.sensitivity && answers.ageRange && answers.goal)
}

export function buildRhythmResult(answers: Required<RhythmAnswers>): RhythmResult {
  const sensitive = answers.sensitivity === "easily" || answers.skinFeel === "red-irritated"
  const dry = answers.skinFeel === "dry-tight" || answers.goal === "hydration"
  const texture = answers.skinFeel === "uneven-texture" || answers.goal === "aging"
  const consistency = answers.skinFeel === "inconsistent" || answers.routineState === "random" || answers.routineState === "skip-often"
  const calmer = sensitive || answers.goal === "calmer"

  const primary = dry ? "hydration" : calmer ? "calm barrier support" : texture ? "steady texture support" : "consistency"
  const secondary = consistency ? "consistency" : answers.goal === "simpler" ? "simplicity" : "barrier support"

  const focusIngredients = dry
    ? ["Hyaluronic Acid", "Glycerin", "Ceramides"]
    : calmer
      ? ["Ceramides", "Niacinamide", "Panthenol"]
      : texture
        ? sensitive
          ? ["Peptides", "Niacinamide", "Ceramides"]
          : ["Peptides", "Niacinamide", "Retinol"]
        : ["Glycerin", "Ceramides", "Niacinamide"]

  const avoidOverdoing = [
    sensitive ? "Fragrance and strong exfoliants when your skin feels reactive" : "Too many acids in the same week",
    texture && !sensitive ? "Retinol too often before your barrier is steady" : "Adding strong actives before the basics feel consistent",
    answers.routineState === "too-many" ? "Layering products just because they are on the shelf" : "Changing everything at once",
    "Mixing strong actives on nights your skin already feels stressed",
  ]

  const eveningTreatment = sensitive
    ? "Treatment or repair step only on calm nights"
    : texture
      ? "Gentle treatment step two or three nights a week"
      : "Repair step focused on comfort and consistency"

  return {
    profileLine: `Your skin rhythm looks ${primary}-focused with ${secondary} support.`,
    summaryTags: `${primary} + ${secondary}`,
    morning: ["Gentle cleanse or rinse", "Hydration layer", "Moisturizer", "Daily SPF"],
    evening: ["Cleanse", eveningTreatment, "Moisturizer", "Optional recovery night"],
    focusIngredients,
    avoidOverdoing,
    aimeNote:
      answers.routineState === "too-many"
        ? "You probably do not need a bigger shelf right now. You need a rhythm your skin can recognize."
        : "Start by making your skin feel safe and predictable. Once that rhythm holds, the stronger steps become easier to choose.",
    pickCategories: dry
      ? ["hydration", "skin-barrier", "dry-skin"]
      : calmer
        ? ["skin-barrier", "redness", "sensitive"]
        : texture
          ? ["anti-aging", "texture", "uneven-tone"]
          : ["skin-barrier", "most-common", "hydration"],
  }
}
