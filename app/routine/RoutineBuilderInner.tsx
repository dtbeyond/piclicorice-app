"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"
import { generateRoutine } from "@/lib/routineEngine"
import { useSiteContent } from "@/lib/useSiteContent"
import { AgeRange, Concern, RoutineInput, RoutineResult, SkinType } from "@/types/routine"
import { products } from "@/data/products"

const ageOptions: { value: AgeRange; label: string }[] = [
  { value: "under25", label: "Under 25" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55plus", label: "55+" },
]

const skinTypeOptions: { value: SkinType; label: string }[] = [
  { value: "dry", label: "Dry" },
  { value: "oily", label: "Oily" },
  { value: "combination", label: "Combination" },
  { value: "sensitive", label: "Sensitive" },
  { value: "not-sure", label: "Not Sure" },
]

const concernOptions: { value: Concern; label: string }[] = [
  { value: "skin-barrier", label: "Skin Barrier" },
  { value: "wrinkles", label: "Wrinkles / Fine Lines" },
  { value: "sun-spots", label: "Sun Spots / Pigmentation" },
  { value: "texture", label: "Rough Texture" },
  { value: "uneven-tone", label: "Uneven Tone" },
  { value: "redness", label: "Redness / Inflammation" },
  { value: "dryness", label: "Dryness / Tightness" },
  { value: "oiliness", label: "Oiliness / Shine" },
  { value: "acne-prone", label: "Acne-Prone / Breakouts" },
  { value: "product-not-working", label: "Products Not Working" },
]

function StepButton({
  selected,
  children,
  onClick,
}: {
  selected: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-16 w-full items-center justify-between rounded-[24px] border px-5 py-4 text-left transition-all ${
        selected
          ? "border-[#111111] bg-white text-black shadow-[0_12px_24px_rgba(176,31,133,0.10)]"
          : "border-black/10 bg-white/70 text-black hover:border-[#7C9C9B]/60 hover:bg-white"
      }`}
    >
      <span className="text-base font-semibold">{children}</span>
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
          selected ? "border-[#B01F85] bg-[#B01F85] text-white" : "border-black/15 text-black/35"
        }`}
      >
        {selected ? "OK" : ""}
      </span>
    </button>
  )
}

function SectionCard({
  eyebrow,
  children,
}: {
  eyebrow: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[24px] border border-black/10 bg-white p-5 sm:p-6">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B01F85]">{eyebrow}</div>
      {children}
    </section>
  )
}

export default function RoutineBuilderInner() {
  const { content } = useSiteContent()
  const searchParams = useSearchParams()
  const prefilledConcern = searchParams.get("concern") as Concern | null

  const [step, setStep] = useState(1)
  const [input, setInput] = useState<RoutineInput>({
    ageRange: "35-44",
    skinType: "combination",
    concerns: ["skin-barrier", "dryness"],
    productText: "",
  })
  const [result, setResult] = useState<RoutineResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAiMe, setShowAiMe] = useState(false)

  useEffect(() => {
    const savedWizard = localStorage.getItem("pl_routine_wizard")
    if (!savedWizard) return

    try {
      const parsed = JSON.parse(savedWizard)
      if (parsed.input) setInput(parsed.input)
      if (parsed.result) setResult(parsed.result)
      if (parsed.step) setStep(parsed.step)
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem("pl_routine_wizard", JSON.stringify({ step, input, result }))
  }, [step, input, result])

  useEffect(() => {
    if (prefilledConcern && concernOptions.some((concern) => concern.value === prefilledConcern)) {
      setInput((previous) => ({ ...previous, concerns: [prefilledConcern] }))
      setStep(3)
    }
  }, [prefilledConcern])

  const updateInput = (updates: Partial<RoutineInput>) => {
    setInput((previous) => ({ ...previous, ...updates }))
  }

  const toggleConcern = (concern: Concern) => {
    const current = input.concerns
    updateInput({
      concerns: current.includes(concern)
        ? current.filter((item) => item !== concern)
        : [...current, concern],
    })
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const routineResult = generateRoutine(input)
      setResult(routineResult)
      setStep(6)
      setIsLoading(false)
    }, 400)
  }

  const resetFlow = () => {
    setStep(1)
    setResult(null)
    setInput({
      ageRange: "35-44",
      skinType: "combination",
      concerns: ["skin-barrier", "dryness"],
      productText: "",
    })
    localStorage.removeItem("pl_routine_wizard")
  }

  const saveRoutine = () => {
    if (!result) return
    localStorage.setItem("pl_routine", JSON.stringify({ input, result, savedAt: new Date().toISOString() }))
    alert("Routine saved. You can return from the homepage.")
  }

  const getAiMeResponse = (question: string) => {
    if (question.includes("not working")) {
      return "A lot of routines run into this. It is usually not one product by itself, but how hydration, barrier support, actives, and order are working together."
    }

    if (question.includes("order")) {
      return "A simple order is cleanser, hydration or treatment, moisturizer, then SPF in the morning. Strong actives usually need more spacing and patience."
    }

    if (question.includes("mix")) {
      return "Most gentle products can layer, but retinoids, strong acids, and exfoliants are often better on separate nights. Patch testing still matters."
    }

    return "Start with the highest-impact gap first. Usually that means hydration, barrier support, or daily SPF before adding more actives."
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "What is your age range?"
      case 2:
        return "What is your skin type?"
      case 3:
        return "What are your main concerns?"
      case 4:
        return "What are you using now?"
      case 5:
        return "Ready for your routine?"
      case 6:
        return "Your Personalized Routine"
      default:
        return ""
    }
  }

  const stepCopy = {
    1: "Age helps Aime prioritize the right rhythm for your skin right now.",
    2: "Skin type changes how hydration, actives, and barrier support should feel.",
    3: "Select every concern that feels true. The routine will be shaped around these.",
    4: "Type product names, ingredients, or a rough list. Messy input is fine.",
    5: "Aime will turn your answers into a clear AM and PM routine.",
    6: "Simple, informed, and built around what your skin is actually telling us.",
  } as Record<number, string>

  return (
    <div className="editorial-shell min-h-screen pb-28 text-black">
      <SiteHeader actionLabel="Start Over" onAction={resetFlow} />

      <main className="mx-auto w-full max-w-[920px] px-4 pt-6 sm:px-6 sm:pt-10">
        <section className="mb-6 grid gap-5 lg:grid-cols-[0.86fr_1.14fr] lg:items-end">
          <div className="media-card">
            <img
              src="/assets/piclicorice/piclicorice_home_hero_mobile_backup_v2_4x5.png"
              alt="Warm skincare coaching"
              className="h-56 w-full object-cover object-center sm:h-72 lg:h-[420px]"
              style={{ objectPosition: content.routineImagePosition }}
            />
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`h-1.5 flex-1 rounded-full ${item <= Math.min(step, 5) ? "bg-[#B01F85]" : "bg-black/10"}`}
                />
              ))}
              <span className="ml-2 w-10 text-right font-mono text-[11px] text-black/45">{Math.min(step, 5)}/5</span>
            </div>
            <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[#7C9C9B]">Fix My Routine</div>
            <h1 className="text-[38px] font-semibold leading-[0.98] tracking-tighter sm:text-6xl">{getStepTitle()}</h1>
            <p className="mt-4 max-w-[600px] text-base leading-relaxed text-black/60">{stepCopy[step]}</p>
          </div>
        </section>

        {step < 6 && (
          <section className="rounded-[28px] border border-black/10 bg-[#faf8f4]/72 p-3 sm:p-5">
            <div className="grid gap-3">
              {step === 1 &&
                ageOptions.map((option) => (
                  <StepButton
                    key={option.value}
                    selected={input.ageRange === option.value}
                    onClick={() => updateInput({ ageRange: option.value })}
                  >
                    {option.label}
                  </StepButton>
                ))}

              {step === 2 &&
                skinTypeOptions.map((option) => (
                  <StepButton
                    key={option.value}
                    selected={input.skinType === option.value}
                    onClick={() => updateInput({ skinType: option.value })}
                  >
                    {option.label}
                  </StepButton>
                ))}

              {step === 3 &&
                concernOptions.map((option) => (
                  <StepButton
                    key={option.value}
                    selected={input.concerns.includes(option.value)}
                    onClick={() => toggleConcern(option.value)}
                  >
                    {option.label}
                  </StepButton>
                ))}

              {step === 4 && (
                <div>
                  <textarea
                    value={input.productText}
                    onChange={(event) => updateInput({ productText: event.target.value })}
                    placeholder="Example: cleanser, vitamin C serum, moisturizer with niacinamide, SPF"
                    className="min-h-64 w-full resize-y rounded-[24px] border border-black/10 bg-white p-5 text-base leading-relaxed text-black outline-none placeholder:text-black/35 focus:border-[#B01F85]"
                  />
                  <div className="mt-3 px-1 text-sm text-black/45">No need to be perfect. Product names, ingredient lists, or rough notes all work.</div>
                </div>
              )}

              {step === 5 && (
                <div className="rounded-[24px] border border-black/10 bg-white p-6">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#B01F85]">Review</div>
                  <div className="space-y-3 text-sm text-black/64">
                    <div>
                      <span className="font-semibold text-black">Age:</span> {ageOptions.find((option) => option.value === input.ageRange)?.label}
                    </div>
                    <div>
                      <span className="font-semibold text-black">Skin type:</span> {skinTypeOptions.find((option) => option.value === input.skinType)?.label}
                    </div>
                    <div>
                      <span className="font-semibold text-black">Concerns:</span> {input.concerns.length} selected
                    </div>
                    <div>
                      <span className="font-semibold text-black">Products:</span> {input.productText ? "Provided" : "None listed"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex gap-3">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="h-14 flex-1 rounded-full border border-black/15 bg-white/70 text-sm font-semibold hover:bg-white"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={step === 3 && input.concerns.length === 0}
                className="shop-now-button flex h-14 flex-1 items-center justify-center rounded-full text-sm font-bold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isLoading ? "BUILDING" : step === 5 ? "BUILD MY ROUTINE" : "CONTINUE"}
              </button>
            </div>
          </section>
        )}

        {step === 6 && result && (
          <div className="space-y-5">
            <SectionCard eyebrow="What Aime is seeing">
              <p className="text-xl font-semibold leading-snug tracking-tight text-black">{result.summary}</p>
            </SectionCard>

            <SectionCard eyebrow="What is working">
              <ul className="space-y-3 text-sm leading-relaxed text-black/68">
                {result.working.map((item, index) => (
                  <li key={index} className="border-b border-black/10 pb-3 last:border-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            {(result.warnings.length > 0 || (result.issues.length > 0 && result.issues[0] !== "No major red flags detected in your current routine.")) && (
              <SectionCard eyebrow="What may be causing issues">
                <div className="space-y-3">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="rounded-[20px] border border-[#B01F85]/20 bg-[#fff7fc] p-4">
                      <div className="mb-1 font-semibold">{warning.title}</div>
                      <p className="text-sm leading-relaxed text-black/62">{warning.explanation}</p>
                    </div>
                  ))}
                  {result.issues[0] !== "No major red flags detected in your current routine." &&
                    result.issues.map((item, index) => (
                      <div key={index} className="text-sm leading-relaxed text-black/68">
                        {item}
                      </div>
                    ))}
                </div>
              </SectionCard>
            )}

            <SectionCard eyebrow="What is missing">
              <ul className="space-y-3 text-sm leading-relaxed text-black/68">
                {result.missing.map((item, index) => (
                  <li key={index} className="border-b border-black/10 pb-3 last:border-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <section>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tighter">Your Updated Routine</h2>
                  <p className="text-sm text-black/55">Simple. Effective. Built for your skin.</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 font-mono text-[10px] tracking-widest text-black/45">AM + PM</div>
              </div>

              {[
                ["Morning", result.amRoutine],
                ["Evening", result.pmRoutine],
              ].map(([label, steps]) => (
                <div key={label as string} className="mb-6">
                  <div className="mb-3 font-semibold">{label as string}</div>
                  <div className="space-y-3">
                    {(steps as RoutineResult["amRoutine"]).map((routineStep) => (
                      <article key={`${label}-${routineStep.order}`} className="rounded-[24px] border border-black/10 bg-white p-5">
                        <div className="flex gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3efea] font-mono text-sm text-black/60">
                            {routineStep.order}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold tracking-tight">{routineStep.name}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-black/62">{routineStep.purpose}</p>
                            <div className="mt-4 border-t border-black/10 pt-4 text-sm leading-relaxed text-black/68">{routineStep.ingredientLogic}</div>

                            {routineStep.productSuggestionIds && routineStep.productSuggestionIds.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#B01F85]">Suggested products</div>
                                {routineStep.productSuggestionIds.map((id) => {
                                  const product = products.find((item) => item.id === id)
                                  if (!product) return null

                                  return (
                                    <a
                                      key={id}
                                      href={product.externalUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 rounded-[18px] border border-black/10 bg-[#faf8f4] p-3 hover:border-[#B01F85]/35"
                                    >
                                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-white">
                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="line-clamp-2 text-sm font-semibold">{product.name}</div>
                                        <div className="text-xs text-black/45">{product.price}</div>
                                      </div>
                                      <div className="font-mono text-[10px] tracking-widest text-[#B01F85]">VIEW</div>
                                    </a>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="media-card">
              <div className="bg-white p-6 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Want products that fit this routine?</h2>
                <p className="mx-auto mt-2 max-w-[420px] text-sm leading-relaxed text-black/58">
                  Start simple. Aime can point you toward vetted options that match the steps you just built.
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/shop?context=routine" className="shop-now-button inline-flex h-14 items-center justify-center rounded-full px-8 text-sm font-bold tracking-[0.08em]">
                    SHOW ME PRODUCTS
                  </Link>
                  <button onClick={saveRoutine} className="inline-flex h-14 items-center justify-center rounded-full border border-black/15 bg-white px-8 text-sm font-semibold">
                    Save Routine
                  </button>
                  <button onClick={() => window.print()} className="inline-flex h-14 items-center justify-center rounded-full border border-black/15 bg-white px-8 text-sm font-semibold">
                    Download PDF
                  </button>
                </div>
              </div>
            </section>

            <div className="pb-8 text-center">
              <button onClick={resetFlow} className="text-sm font-semibold text-[#B01F85] underline-offset-4 hover:underline">
                Analyze a different routine
              </button>
              <div className="mx-auto mt-5 max-w-[520px] text-xs leading-relaxed text-black/42">
                This is educational guidance only. Always patch test new products and consult a professional for medical concerns.
              </div>
            </div>
          </div>
        )}
      </main>

      {step === 6 && (
        <button
          onClick={() => setShowAiMe(true)}
          className="fixed bottom-24 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#B01F85] text-sm font-bold text-white shadow-[0_12px_28px_rgba(176,31,133,0.32)] active:scale-95"
        >
          AI
        </button>
      )}

      {showAiMe && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/55 p-4 sm:items-center" onClick={() => setShowAiMe(false)}>
          <div className="w-full max-w-[420px] rounded-[28px] bg-white p-6 text-black" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#B01F85]">AI.Me</div>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">What do you want to check?</h2>
              </div>
              <button onClick={() => setShowAiMe(false)} className="rounded-full border border-black/10 px-3 py-1 text-sm">
                Close
              </button>
            </div>

            <div className="space-y-2">
              {["Why is this not working?", "What order do I use this?", "Can I mix these?", "What should I add next?"].map((question) => (
                <button
                  key={question}
                  onClick={() => {
                    alert(getAiMeResponse(question))
                    setShowAiMe(false)
                  }}
                  className="w-full rounded-[18px] border border-black/10 bg-[#faf8f4] px-4 py-4 text-left text-sm font-semibold hover:border-[#B01F85]/35"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
