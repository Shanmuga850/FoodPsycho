import { MapPin, Navigation, Phone } from "lucide-react"
import type { Branch } from "@/lib/food-psycho"
import { SectionHeading } from "./section-heading"

export function Locations({ branches }: { branches: Branch[] }) {
  if (!branches?.length) return null

  return (
    <section className="px-6 py-12">
      <SectionHeading>Our Branches</SectionHeading>

      <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
        {branches.slice(0, 5).map((b) => (
          <article
            key={b.id}
            className="flex flex-col rounded-xl border border-black/10 bg-white p-5 shadow-sm"
          >
            <h3 className="font-playfair text-xl font-bold text-black">{b.branch_name}</h3>
            <p className="mt-2 flex items-start gap-2 font-montserrat text-sm leading-relaxed text-black/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B2B]" aria-hidden />
              {b.address}
            </p>

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              {b.phone ? (
                <a
                  href={`tel:${b.phone.replace(/\s/g, "")}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-black/15 px-3 py-2 font-montserrat text-sm font-semibold text-black transition hover:bg-black/5"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              ) : null}
              {b.map_link ? (
                <a
                  href={b.map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-[#FF6B2B] px-3 py-2 font-montserrat text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <Navigation className="h-4 w-4" /> Directions
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
