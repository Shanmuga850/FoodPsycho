import { Mail, Phone } from "lucide-react"
import type { FoodPsychoData } from "@/lib/food-psycho"
import { SocialIcon } from "./social-icon"
import { SectionHeading } from "./section-heading"

export function ContactSection({
  contact,
  whatsapp,
  branchName,
}: {
  contact: FoodPsychoData["contact"]
  whatsapp: string
  branchName: string
}) {
  const waNumber = whatsapp.replace(/\D/g, "")
  const message = `Hi FOOD PSYCHO, I want to order from ${branchName || "FOOD PSYCHO"}`
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    : null

  return (
    <section className="px-6 py-12">
      <SectionHeading>Contact</SectionHeading>

      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-4">
        {contact.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold text-black transition hover:text-[#FF6B2B]"
          >
            <Phone className="h-4 w-4 text-[#FF6B2B]" /> {contact.phone}
          </a>
        ) : null}
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold text-black transition hover:text-[#FF6B2B]"
          >
            <Mail className="h-4 w-4 text-[#FF6B2B]" /> {contact.email}
          </a>
        ) : null}

        {waLink ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#FF6B2B] px-6 py-4 font-montserrat text-base font-bold text-white shadow-sm transition hover:brightness-95"
          >
            <SocialIcon platform="whatsapp" className="h-5 w-5" />
            Order on WhatsApp
          </a>
        ) : null}
      </div>
    </section>
  )
}
