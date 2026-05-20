"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { products } from "@/data/products"
import {
  buildRhythmResult,
  isCompleteRhythm,
  RHYTHM_STORAGE_KEY,
  rhythmLabels,
  type RhythmAnswers,
  type RhythmResult,
  type SavedRhythm,
} from "@/lib/rhythm"
import { useSiteContent } from "@/lib/useSiteContent"

type StepKey = keyof RhythmAnswers

type RhythmStep = {
  key: StepKey
  eyebrow: string
  question: string
  helper: string
  options: { value: string; label: string; description?: string }[]
}

const rhythmSteps: RhythmStep[] = [
  {
    key: "skinFeel",
    eyebrow: "Rituals",
    question: "What feels most frustrating about your skin right now?",
    helper: "Start with what your skin is telling you today. Aime can narrow the rhythm from there.",
    options: [
      { value: "dry-tight", label: "Dry or tight", description: "Skin feels thirsty, tight, or uncomfortable." },
      { value: "dull-tired", label: "Dull or tired", description: "You want more life, softness, and glow." },
      { value: "red-irritated", label: "Red or irritated", description: "Your skin needs a calmer, less provoking path." },
      { value: "uneven-texture", label: "Uneven texture", description: "Bumps, roughness, spots, or visible texture stand out." },
      { value: "inconsistent", label: "I just feel inconsistent", description: "The routine never quite settles into a rhythm." },
    ],
  },
  {
    key: "routineState",
    eyebrow: "Current Rhythm",
    question: "How does your routine feel lately?",
    helper: "No perfect answer needed. This helps decide whether to simplify, repair, or build.",
    options: [
      { value: "random", label: "Random", description: "You use what is nearby or what sounds good that day." },
      { value: "too-many", label: "Too many products", description: "There may be too much happening at once." },
      { value: "too-simple", label: "Too simple", description: "The basics are there, but something still feels missing." },
      { value: "skip-often", label: "I skip often", description: "The rhythm has to become easier to repeat." },
      { value: "not-sure", label: "I'm not sure what works", description: "You need a clearer way to judge what is helping." },
    ],
  },
  {
    key: "sensitivity",
    eyebrow: "Skin Reactivity",
    question: "How reactive is your skin?",
    helper: "This changes how fast Aime would introduce stronger ingredients.",
    options: [
      { value: "rarely", label: "Rarely reactive", description: "Your skin usually handles new products well." },
      { value: "sometimes", label: "Sometimes sensitive", description: "Your skin reacts when the routine gets too busy." },
      { value: "easily", label: "Easily irritated", description: "Go slower, calmer, and more barrier-first." },
      { value: "not-sure", label: "I'm not sure", description: "We will keep the rhythm conservative." },
    ],
  },
  {
    key: "ageRange",
    eyebrow: "Aime Should Keep In Mind",
    question: "Which age range should Aime keep in mind?",
    helper: "This helps tailor timing, barrier support, and ingredient strength - not judge your skin.",
    options: [
      { value: "25-34", label: "25-34" },
      { value: "35-44", label: "35-44" },
      { value: "45-54", label: "45-54" },
      { value: "55plus", label: "55+" },
      { value: "prefer-not", label: "Prefer not to say" },
    ],
  },
  {
    key: "goal",
    eyebrow: "First Goal",
    question: "What do you want your rhythm to help with first?",
    helper: "Choose the first priority. The result can still support more than one thing.",
    options: [
      { value: "hydration", label: "More hydration", description: "Softness, comfort, and less tightness." },
      { value: "calmer", label: "Calmer skin", description: "Less reactivity and more barrier support." },
      { value: "aging", label: "Aging support", description: "Steady support for mature skin without chaos." },
      { value: "simpler", label: "Simpler routine", description: "Less decision fatigue, more repeatability." },
      { value: "consistency", label: "Better consistency", description: "A rhythm you can actually keep." },
    ],
  },
]

function getPrefilledAnswers(concern: string | null, feel: string | null, goal: string | null): RhythmAnswers {
  const answers: RhythmAnswers = {}

  if (feel && rhythmSteps[0].options.some((option) => option.value === feel)) {
    answers.skinFeel = feel as RhythmAnswers["skinFeel"]
  }

  if (goal && rhythmSteps[4].options.some((option) => option.value === goal)) {
    answers.goal = goal as RhythmAnswers["goal"]
  }

  if (concern === "dryness") answers.skinFeel = "dry-tight"
  if (concern === "redness") answers.skinFeel = "red-irritated"
  if (concern === "wrinkles" || concern === "texture") answers.skinFeel = "uneven-texture"
  if (concern === "product-not-working") answers.routineState = "random"

  return answers
}

function ChoiceRow({
  selected,
  label,
  description,
  onClick,
}: {
  selected: boolean
  label: string
  description?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[82px] w-full items-center gap-4 rounded-[24px] border px-5 py-4 text-left transition-all active:scale-[0.99] ${
        selected
          ? "border-[#111A33] bg-white shadow-[0_16px_28px_rgba(15,127,145,0.12)]"
          : "border-black/10 bg-white/68 hover:border-[#9FC8CA]/55 hover:bg-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all ${
          selected ? "scale-105 border-[#0F7F91] bg-[#0F7F91] text-white" : "border-black/15 bg-white text-transparent"
        }`}
      >
        {selected ? "OK" : ""}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold tracking-tight">{label}</span>
        {description && <span className="mt-1 block text-sm leading-relaxed text-black/54">{description}</span>}
      </span>
    </button>
  )
}

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[24px] border border-black/10 bg-white p-5 sm:p-6">
      {eyebrow && <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0F7F91]">{eyebrow}</div>}
      {title && <h2 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h2>}
      {children}
    </section>
  )
}

function StepList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item} className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-[#fbf7f2]/70 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-mono text-xs text-black/55">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-black/78">{item}</span>
        </div>
      ))}
    </div>
  )
}

function RhythmResultScreen({
  answers,
  result,
  onStartFresh,
}: {
  answers: Required<RhythmAnswers>
  result: RhythmResult
  onStartFresh: () => void
}) {
  const picks = products
    .filter((product) => product.approvedByAime && product.categories.some((category) => result.pickCategories.includes(category)))
    .slice(0, 4)

  return (
    <div className="space-y-5">
      <section className="rounded-[28px] border border-[#9FC8CA]/34 bg-linear-to-br from-white via-[#fbf7f2] to-[#9FC8CA]/14 p-6 sm:p-8">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.22em] text-[#9FC8CA]">Your Current Rhythm</div>
        <h1 className="max-w-[680px] text-[38px] font-semibold leading-[0.98] tracking-tighter sm:text-6xl">
          Here&apos;s what your skin may be asking for
        </h1>
        <p className="mt-5 max-w-[620px] text-base leading-relaxed text-black/60">
          Based on your answers, Aime would start by calming the routine before adding more products.
        </p>
      </section>

      <SectionCard eyebrow="Profile Summary" title={result.profileLine}>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Main skin feel", rhythmLabels.skinFeel[answers.skinFeel]],
            ["Routine state", rhythmLabels.routineState[answers.routineState]],
            ["Sensitivity level", rhythmLabels.sensitivity[answers.sensitivity]],
            ["Current goal", rhythmLabels.goal[answers.goal]],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[18px] border border-black/10 bg-[#fbf7f2]/70 p-4">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#9FC8CA]">{label}</div>
              <div className="text-sm font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard eyebrow="AM" title="Morning Rhythm">
          <StepList items={result.morning} />
        </SectionCard>
        <SectionCard eyebrow="PM" title="Evening Rhythm">
          <StepList items={result.evening} />
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard eyebrow="Focus On" title="Ingredients to Focus On">
          <div className="flex flex-wrap gap-2">
            {result.focusIngredients.map((ingredient) => (
              <span key={ingredient} className="rounded-full border border-[#9FC8CA]/32 bg-[#9FC8CA]/10 px-4 py-2 text-sm font-semibold">
                {ingredient}
              </span>
            ))}
          </div>
        </SectionCard>
        <SectionCard eyebrow="Go Slow" title="Avoid Overdoing">
          <ul className="space-y-3 text-sm leading-relaxed text-black/62">
            {result.avoidOverdoing.map((item) => (
              <li key={item} className="border-b border-black/10 pb-3 last:border-0 last:pb-0">
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard eyebrow="Aime's Note">
        <p className="text-xl font-semibold leading-snug tracking-tight">{result.aimeNote}</p>
      </SectionCard>

      <SectionCard eyebrow="Optional Shop" title="Shop the edit for this rhythm">
        <p className="mb-4 text-sm leading-relaxed text-black/55">
          These are optional starting points. The rhythm comes first; shopping should support it.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {picks.map((product) => (
            <a
              key={product.id}
              href={product.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[22px] border border-black/10 bg-[#fbf7f2]/72 p-4 transition-all hover:border-[#0F7F91]/36 hover:bg-white"
            >
              <div className="mb-3 aspect-[5/3] overflow-hidden rounded-[18px] bg-white">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="text-sm font-semibold leading-tight">{product.name}</div>
              <div className="mt-1 text-xs text-black/45">{product.price}</div>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[#0F7F91]">View Pick - Opens in TikTok Shop</div>
            </a>
          ))}
        </div>
      </SectionCard>

      <section className="media-card">
        <div className="grid gap-4 bg-white/72 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#9FC8CA]">Saved Locally</div>
            <h2 className="text-2xl font-semibold tracking-tight">Your rhythm will be here when you come back.</h2>
            <p className="mt-2 text-sm leading-relaxed text-black/55">
              This proof version remembers on this device. Accounts can make it portable later.
            </p>
          </div>
          <button onClick={onStartFresh} className="h-12 rounded-full border border-black/15 bg-white px-6 text-sm font-semibold">
            Start Again
          </button>
        </div>
      </section>
    </div>
  )
}

export default function RoutineBuilderInner() {
  const { content } = useSiteContent()
  const searchParams = useSearchParams()
  const concernParam = searchParams.get("concern")
  const feelParam = searchParams.get("feel")
  const goalParam = searchParams.get("goal")
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<RhythmAnswers>({})
  const [savedRhythm, setSavedRhythm] = useState<SavedRhythm | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(RHYTHM_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedRhythm
        if (parsed.answers && isCompleteRhythm(parsed.answers)) {
          setAnswers(parsed.answers)
          setSavedRhythm(parsed)
          return
        }
      } catch {}
    }

    setAnswers(getPrefilledAnswers(concernParam, feelParam, goalParam))
  }, [concernParam, feelParam, goalParam])

  const currentStep = rhythmSteps[stepIndex]
  const currentValue = answers[currentStep.key]
  const completedAnswers = isCompleteRhythm(answers) ? answers : null
  const result = useMemo(() => (completedAnswers ? buildRhythmResult(completedAnswers) : null), [completedAnswers])

  const updateAnswer = (key: StepKey, value: string) => {
    setAnswers((previous) => ({ ...previous, [key]: value }))
  }

  const continueFlow = () => {
    if (!currentValue) return

    if (stepIndex < rhythmSteps.length - 1) {
      setStepIndex(stepIndex + 1)
      return
    }

    const completed = { ...answers }
    if (!isCompleteRhythm(completed)) return

    const nextSaved: SavedRhythm = {
      answers: completed,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(RHYTHM_STORAGE_KEY, JSON.stringify(nextSaved))
    window.dispatchEvent(new Event("piclicorice-rhythm-updated"))
    setSavedRhythm(nextSaved)
  }

  const startFresh = () => {
    localStorage.removeItem(RHYTHM_STORAGE_KEY)
    localStorage.removeItem("pl_routine")
    localStorage.removeItem("pl_routine_wizard")
    window.dispatchEvent(new Event("piclicorice-rhythm-updated"))
    setSavedRhythm(null)
    setAnswers({})
    setStepIndex(0)
  }

  return (
    <div className="editorial-shell min-h-screen pb-28 text-black">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[940px] px-4 pt-6 sm:px-6 sm:pt-10">
        {savedRhythm && result && completedAnswers ? (
          <RhythmResultScreen answers={completedAnswers} result={result} onStartFresh={startFresh} />
        ) : (
          <>
            <section className="mb-6 grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
              <div className="media-card">
                <img
                  src="/assets/piclicorice/piclicorice_rituals_journal_16x9.png"
                  alt="Warm skincare ritual journal"
                  className="h-56 w-full object-cover object-center sm:h-72 lg:h-[420px]"
                  style={{ objectPosition: content.routineImagePosition }}
                />
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  {rhythmSteps.map((step, index) => (
                    <div
                      key={step.key}
                      className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-[#0F7F91]" : "bg-black/10"}`}
                    />
                  ))}
                  <span className="ml-2 w-10 text-right font-mono text-[11px] text-black/45">
                    {stepIndex + 1}/{rhythmSteps.length}
                  </span>
                </div>
                <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#9FC8CA]">{currentStep.eyebrow}</div>
                <h1 className="text-[36px] font-semibold leading-[0.98] tracking-tighter sm:text-6xl">{currentStep.question}</h1>
                <p className="mt-4 max-w-[600px] text-base leading-relaxed text-black/60">{currentStep.helper}</p>
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-[#fbf7f2]/72 p-3 sm:p-5">
              <div className="grid gap-3">
                {currentStep.options.map((option) => (
                  <ChoiceRow
                    key={option.value}
                    selected={currentValue === option.value}
                    label={option.label}
                    description={option.description}
                    onClick={() => updateAnswer(currentStep.key, option.value)}
                  />
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setStepIndex(stepIndex - 1)}
                    className="h-14 flex-1 rounded-full border border-black/15 bg-white/70 text-sm font-semibold hover:bg-white"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={continueFlow}
                  disabled={!currentValue}
                  className="shop-now-button flex h-14 flex-[1.5] items-center justify-center rounded-full text-sm font-bold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {stepIndex === rhythmSteps.length - 1 ? "SHOW MY RITUAL" : "CONTINUE"}
                </button>
              </div>
            </section>

            <div className="mt-6 text-center text-xs leading-relaxed text-black/42">
              Educational guidance only. Patch test new products and consult a professional for medical concerns.
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
