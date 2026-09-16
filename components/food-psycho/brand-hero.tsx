import Image from "next/image"
import type { FoodPsychoData } from "@/lib/food-psycho"

export function BrandHero({ status }: { status: FoodPsychoData["status"] }) {
  return (
    <section className="flex flex-col items-center px-6 pt-10 text-center sm:pt-14">
      <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-[#D4AF37] sm:h-32 sm:w-32">
        <Image
          src="/food-psycho-logo.png"
          alt="FOOD PSYCHO logo — Shanmugavel M"
          fill
          sizes="128px"
          className="object-cover"
          priority
        />
      </div>

      <h1
        className="mt-6 font-playfair font-black tracking-tight text-black"
        style={{ fontSize: "clamp(2.25rem, 8vw, 3rem)", lineHeight: 1.05 }}
      >
        FOOD PSYCHO
      </h1>

      <p className="mt-3 font-montserrat text-xs font-semibold uppercase tracking-[0.25em] text-black/80 sm:text-sm">
        Fresh Made Daily — Made With Love
      </p>

      <div className="mt-6 h-1 w-[60px] rounded-full bg-[#FF6B2B]" aria-hidden />

      <StatusBadge status={status} />
    </section>
  )
}

function StatusBadge({ status }: { status: FoodPsychoData["status"] }) {
  const { isOpen, timings } = status
  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-1.5">
        <span
          className={`h-2.5 w-2.5 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`}
          aria-hidden
        />
        <span className="font-montserrat text-sm font-bold tracking-wide text-black">
          {isOpen ? "OPEN NOW" : "CLOSED"}
        </span>
      </span>
      {timings?.trim() ? (
        <span className="font-montserrat text-xs font-medium tracking-wide text-black/60">
          {timings}
        </span>
      ) : null}
    </div>
  )
}
