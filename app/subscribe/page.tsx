import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"

const dropIncludes = [
  ["Founder reflections", "Short notes that feel personal, honest, and human."],
  ["Simple skincare education", "Clear guidance without turning your bathroom into homework."],
  ["Guided product thinking", "What may help, what to skip, and how to avoid buying from panic."],
  ["Self-care consistency", "Small reminders for consistency, rest, and investing in yourself."],
]

export default function SubscribePage() {
  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader actionLabel="Start Skin Edit" actionHref="/routine" />

      <main className="mx-auto w-full max-w-[960px] px-4 pt-8 sm:px-6">
        <section className="media-card">
          <div className="bg-linear-to-br from-white via-[#fbf7f2] to-[#9FC8CA]/16 p-7 text-center sm:p-12">
            <div className="pl-kicker mb-4">The Weekly Drop</div>
            <h1 className="pl-display mx-auto max-w-[760px] text-[46px] leading-[0.98] sm:text-7xl">
              A weekly pause for skin, self-care, and better choices.
            </h1>
            <p className="mx-auto mt-6 max-w-[640px] text-[15px] leading-relaxed text-black/62 sm:text-base">
              A calm editorial note from PicLicorice: founder reflections, realistic routines, simple education, and product guidance that helps you slow down before you add more.
            </p>
            <div className="mx-auto mt-8 grid max-w-[640px] gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="email"
                placeholder="Email address"
                className="h-14 rounded-full border border-black/10 bg-white/80 px-5 text-sm outline-none placeholder:text-black/35 focus:border-[#0F7F91]"
              />
              <button className="shop-now-button h-14 rounded-full px-8 text-sm font-bold tracking-[0.08em]">
                Join the Weekly Drop
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-black/45">
              Weekly, useful, and never built to make you feel behind.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {dropIncludes.map(([title, body]) => (
            <div key={title} className="pl-card pl-card-teal p-6">
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/58">{body}</p>
            </div>
          ))}
        </section>

        <section className="pl-card pl-card-pink mt-8 p-7 sm:p-9">
          <div className="pl-kicker mb-3">Start here if you are overwhelmed</div>
          <h2 className="max-w-[720px] text-3xl font-semibold tracking-tight">
            You do not have to buy more to begin taking better care of yourself.
          </h2>
          <p className="mt-4 max-w-[680px] text-sm leading-relaxed text-black/58">
            The Weekly Drop should support your Skin Edit and Aime&apos;s curated collection, not become another noisy content wall. Begin with what your skin needs, then choose what belongs.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/routine" className="shop-now-button flex h-12 items-center justify-center rounded-full px-6 text-sm font-bold">
              Start Your Skin Edit
            </Link>
            <Link href="/shop" className="pl-soft-button flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold">
              Curated Skin Collection
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
