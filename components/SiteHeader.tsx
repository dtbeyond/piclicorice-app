"use client"

import Link from "next/link"

type SiteHeaderProps = {
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  actionVariant?: "shop" | "plain"
}

export default function SiteHeader({
  actionLabel = "Home",
  actionHref = "/",
  onAction,
  actionVariant = "plain",
}: SiteHeaderProps) {
  const actionClass =
    actionVariant === "shop"
      ? "shop-now-button"
      : "border border-black/15 bg-white/70 text-black hover:bg-white"

  const actionContent = (
    <span
      className={`inline-flex h-10 min-w-[116px] items-center justify-center rounded-full px-5 text-center text-xs font-semibold tracking-wide transition-colors ${actionClass}`}
    >
      {actionLabel}
    </span>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#faf8f4]/92 px-4 py-3.5 backdrop-blur sm:px-6">
      <div className="mx-auto flex w-full max-w-[980px] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-bold text-white">
            PL
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold tracking-tight">PicLicorice</div>
            <div className="-mt-1 text-[10px] text-black/45">Skincare | Wellness</div>
          </div>
        </Link>

        {onAction ? (
          <button onClick={onAction} className="shrink-0 whitespace-nowrap" type="button">
            {actionContent}
          </button>
        ) : (
          <Link href={actionHref} className="shrink-0 whitespace-nowrap">
            {actionContent}
          </Link>
        )}
      </div>
    </header>
  )
}
