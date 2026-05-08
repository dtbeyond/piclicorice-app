"use client"
import React, { Suspense } from "react"
import ShopPageInner from "./ShopPageInner"
export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center text-white/50">
        Loading shop…
      </div>
    }>
      <ShopPageInner />
    </Suspense>
  )
}
