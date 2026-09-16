export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-black/10 px-6 py-10 text-center">
      <p className="font-playfair text-lg font-bold tracking-wide text-black">
        MADE FRESH. MADE WITH LOVE.
      </p>
      <p className="mt-2 font-montserrat text-xs text-black/50">
        © {new Date().getFullYear()} FOOD PSYCHO. All rights reserved.
      </p>
    </footer>
  )
}
