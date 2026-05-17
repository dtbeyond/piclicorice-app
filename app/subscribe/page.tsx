import Link from "next/link"
import BottomNav from "@/components/BottomNav"
import SiteHeader from "@/components/SiteHeader"

export default function SubscribePage() {
  return (
    <div className="editorial-shell min-h-screen pb-24">
      <SiteHeader />

      <main className="mx-auto w-full max-w-[900px] px-4 pt-8 sm:px-6">
        <section className="media-card">
          <div className="grid gap-6 bg-linear-to-br from-white via-[#fbf7f2] to-[#9FC8CA]/16 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="pl-kicker mb-4">Weekly Newsletter</div>
              <h1 className="max-w-[620px] text-[44px] font-semibold leading-[0.96] tracking-tighter sm:text-6xl">
                Join your finest era.
              </h1>
              <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-black/62 sm:text-base">
                A simple weekly skincare edit from Aime: one calm idea, one practical download, and product thinking that keeps your routine from getting loud.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="email"
                  placeholder="Email address"
                  className="h-14 rounded-full border border-black/10 bg-white/80 px-5 text-sm outline-none placeholder:text-black/35 focus:border-[#0F7F91]"
                />
                <button className="shop-now-button h-14 rounded-full px-8 text-sm font-bold tracking-[0.08em]">
                  Join the glow
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-black/45">
                Signup wiring comes next. For now, this page frames the offer and gives Aime a place for the weekly drop.
              </p>
            </div>

            <div className="pl-card pl-card-pink p-5">
              <div className="pl-kicker pl-kicker-pink mb-3">This Week&apos;s Drop</div>
              <h2 className="text-2xl font-semibold tracking-tight">Simple downloadable PDF</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/58">
                The owner&apos;s reference PDF is included here as the first downloadable weekly piece.
              </p>
              <a
                href="/assets/piclicorice/newsletter-weekly-drop.pdf"
                download
                className="pl-soft-button mt-5 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-black"
              >
                Download PDF
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Weekly note", "Short, useful, and written like a calm check-in."],
            ["Simple PDF", "One printable or saveable reference. No clutter."],
            ["That's it", "No complicated funnel before the value is clear."],
          ].map(([title, body]) => (
            <div key={title} className="pl-card pl-card-teal p-5">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/58">{body}</p>
            </div>
          ))}
        </section>

        <section className="pl-card mt-8 p-6">
          <div className="pl-kicker mb-3">Next step</div>
          <h2 className="text-2xl font-semibold tracking-tight">Begin with your skin, then choose what belongs.</h2>
          <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-black/58">
            The newsletter should feed the Rituals tool and Aime&apos;s shop, not become another noisy content wall.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link href="/routine" className="shop-now-button flex h-12 items-center justify-center rounded-full px-6 text-sm font-bold tracking-[0.08em]">
              Rituals
            </Link>
            <Link href="/shop" className="pl-soft-button flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold">
              Shop
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
