export function OfferBanner({ text }: { text: string }) {
  if (!text?.trim()) return null

  const items = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="mx-8 font-montserrat text-sm font-semibold tracking-wide text-white">
      {text}
      <span className="mx-8 opacity-70">•</span>
    </span>
  ))

  return (
    <div className="overflow-hidden bg-[#FF6B2B] py-2" role="region" aria-label="Current offer">
      <div className="fp-marquee">
        {items}
        {items}
      </div>
    </div>
  )
}
