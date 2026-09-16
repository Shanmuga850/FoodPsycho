import type { FoodPsychoData } from "@/lib/food-psycho"
import { SectionHeading } from "./section-heading"

export function FounderSection({ founder }: { founder: FoodPsychoData["founder"] }) {
  const hasContent =
    founder.image || founder.about_text?.trim() || founder.philosophy_text?.trim()
  if (!hasContent) return null

  return (
    <section className="px-6 py-12">
      <SectionHeading>Our Founder</SectionHeading>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center text-center">
        {founder.image ? (
          <div className="h-32 w-32 overflow-hidden rounded-full ring-2 ring-[#D4AF37]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={founder.image}
              alt="Founder of FOOD PSYCHO"
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        {founder.about_text?.trim() ? (
          <p className="mt-6 font-montserrat text-sm leading-relaxed text-black/75">
            {founder.about_text}
          </p>
        ) : null}

        {founder.philosophy_text?.trim() ? (
          <blockquote className="mt-6 font-playfair text-lg italic text-black">
            &ldquo;{founder.philosophy_text}&rdquo;
          </blockquote>
        ) : null}
      </div>
    </section>
  )
}
