"use client"

import { useFoodPsychoData } from "@/lib/food-psycho"
import { OfferBanner } from "@/components/food-psycho/offer-banner"
import { BrandHero } from "@/components/food-psycho/brand-hero"
import { MenuViewer } from "@/components/food-psycho/menu-viewer"
import { Locations } from "@/components/food-psycho/locations"
import { LinksSection } from "@/components/food-psycho/links-section"
import { ContactSection } from "@/components/food-psycho/contact-section"
import { FounderSection } from "@/components/food-psycho/founder-section"
import { SiteFooter } from "@/components/food-psycho/site-footer"

export default function HomePage() {
  const [data, ready] = useFoodPsychoData()

  if (!ready) {
    return <main className="min-h-screen bg-[#F9F6F0]" aria-busy="true" />
  }

  return (
    <main className="min-h-screen bg-[#F9F6F0] text-black">
      <OfferBanner text={data.offerBanner} />
      <div className="mx-auto max-w-5xl">
        <BrandHero status={data.status} />
        <MenuViewer menu={data.menu} />
        <Locations branches={data.branches} />
        <LinksSection links={data.links} />
        <ContactSection
          contact={data.contact}
          whatsapp={data.whatsapp}
          branchName={data.branches[0]?.branch_name ?? ""}
        />
        <FounderSection founder={data.founder} />
        <SiteFooter />
      </div>
    </main>
  )
}
