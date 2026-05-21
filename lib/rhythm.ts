export const RHYTHM_STORAGE_KEY = "pl_ritual"

export type SkinFeel = "dry-tight" | "dull-tired" | "red-irritated" | "uneven-texture" | "inconsistent"
export type RoutineState = "random" | "too-many" | "too-simple" | "skip-often" | "not-sure"
export type Sensitivity = "rarely" | "sometimes" | "easily" | "not-sure"
export type AgeRange = "25-34" | "35-44" | "45-54" | "55plus" | "prefer-not"
export type Goal = "hydration" | "calmer" | "aging" | "simpler" | "consistency"

export type RhythmAnswers = {
  skinFeel?: SkinFeel[]
  routineState?: RoutineState[]
  sensitivity?: Sensitivity
  ageRange?: AgeRange
  goal?: Goal
}

export type CompleteRhythmAnswers = {
  skinFeel: SkinFeel[]
  routineState: RoutineState[]
  sensitivity: Sensitivity
  ageRange: AgeRange
  goal: Goal
}

export type SavedRhythm = {
  answers: CompleteRhythmAnswers
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
    simpler: "Simpler ritual",
    consistency: "Better consistency",
  },
} as const

const skinFeelValues: SkinFeel[] = ["dry-tight", "dull-tired", "red-irritated", "uneven-texture", "inconsistent"]
const routineStateValues: RoutineState[] = ["random", "too-many", "too-simple", "skip-often", "not-sure"]
const sensitivityValues: Sensitivity[] = ["rarely", "sometimes", "easily", "not-sure"]
const ageRangeValues: AgeRange[] = ["25-34", "35-44", "45-54", "55plus", "prefer-not"]
const goalValues: Goal[] = ["hydration", "calmer", "aging", "simpler", "consistency"]

function normalizeArray<T extends string>(value: unknown, allowed: readonly T[]): T[] {
  const raw = Array.isArray(value) ? value : value ? [value] : []
  return raw.filter((item): item is T => typeof item === "string" && allowed.includes(item as T))
}

export function normalizeRhythmAnswers(value: unknown): RhythmAnswers {
  if (!value || typeof value !== "object") return {}
  const answers = value as Partial<Record<keyof RhythmAnswers, unknown>>
  const sensitivity = typeof answers.sensitivity === "string" && sensitivityValues.includes(answers.sensitivity as Sensitivity)
    ? (answers.sensitivity as Sensitivity)
    : undefined
  const ageRange = typeof answers.ageRange === "string" && ageRangeValues.includes(answers.ageRange as AgeRange)
    ? (answers.ageRange as AgeRange)
    : undefined
  const goal = typeof answers.goal === "string" && goalValues.includes(answers.goal as Goal)
    ? (answers.goal as Goal)
    : undefined

  return {
    skinFeel: normalizeArray(answers.skinFeel, skinFeelValues),
    routineState: normalizeArray(answers.routineState, routineStateValues),
    sensitivity,
    ageRange,
    goal,
  }
}

export function isCompleteRhythm(answers: RhythmAnswers): answers is CompleteRhythmAnswers {
  return Boolean(
    answers.skinFeel?.length &&
      answers.routineState?.length &&
      answers.sensitivity &&
      answers.ageRange &&
      answers.goal
  )
}

export function formatRhythmLabelGroup<T extends keyof Pick<typeof rhythmLabels, "skinFeel" | "routineState">>(
  group: T,
  values: RhythmAnswers[T]
) {
  const selected = Array.isArray(values) ? values : values ? [values] : []
  return selected.map((value) => rhythmLabels[group][value as keyof (typeof rhythmLabels)[T]]).join(", ")
}

export function buildRhythmResult(answers: CompleteRhythmAnswers): RhythmResult {
  const hasSkinFeel = (value: SkinFeel) => answers.skinFeel.includes(value)
  const hasRoutineState = (value: RoutineState) => answers.routineState.includes(value)

  const sensitive = answers.sensitivity === "easily" || hasSkinFeel("red-irritated")
  const dry = hasSkinFeel("dry-tight") || answers.goal === "hydration"
  const texture = hasSkinFeel("uneven-texture") || answers.goal === "aging"
  const consistency = hasSkinFeel("inconsistent") || hasRoutineState("random") || hasRoutineState("skip-often")
  const calmer = sensitive || answers.goal === "calmer"
  const tooMany = hasRoutineState("too-many")

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
    sensitive
      ? "Scrubs, fragrance-heavy products, alcohol-heavy toners, harsh acne products, and overpowered acids"
      : "Too many acids in the same week",
    texture && !sensitive ? "Retinol too often before your barrier is steady" : "Adding strong actives before the basics feel consistent",
    tooMany ? "Layering products just because they are on the shelf" : "Changing everything at once",
    "Using treatment steps more often than your skin concern actually needs",
    "Patch test first and start slowly with any treatment product",
  ]

  const treatmentStep = sensitive
    ? "Peptide or barrier-support serum"
    : texture
      ? "Peptide/support serum (treatment only as needed)"
      : "Hydrating or peptide serum"

  return {
    profileLine: `Your skin ritual looks ${primary}-focused with ${secondary} support.`,
    summaryTags: `${primary} + ${secondary}`,
    morning: ["Cleanser", "Serum", "Moisturizer", "SPF"],
    evening: ["Cleanser", treatmentStep, "Moisturizer"],
    focusIngredients,
    avoidOverdoing,
    aimeNote:
      tooMany
        ? "You probably do not need a bigger shelf right now. You need a ritual your skin can recognize."
        : "Start by making your skin feel safe and predictable. Once that ritual holds, the stronger steps become easier to choose.",
    pickCategories: dry
      ? ["hydration", "skin-barrier", "dry-skin"]
      : calmer
        ? ["skin-barrier", "redness", "sensitive"]
        : texture
          ? ["anti-aging", "texture", "uneven-tone"]
          : ["skin-barrier", "most-common", "hydration"],
  }
}
