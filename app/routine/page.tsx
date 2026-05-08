"use client"
import React, { Suspense } from "react"
import RoutineBuilderInner from "./RoutineBuilderInner"
export default function RoutineBuilder() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center text-white/50">
        Loading your routine builder…
      </div>
    }>
      <RoutineBuilderInner />
    </Suspense>
  )
}
