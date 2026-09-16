import type { SocialLink } from "@/lib/food-psycho"
import { detectPlatform } from "@/lib/food-psycho"
import { SocialIcon } from "./social-icon"

export function LinksSection({ links }: { links: SocialLink[] }) {
  if (!links?.length) return null

  return (
    <section className="px-6 py-6">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4">
        {links.slice(0, 5).map((l) => (
          <a
            key={l.id}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.title}
            title={l.title}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-white text-black transition hover:bg-[#FF6B2B] hover:text-white hover:border-[#FF6B2B]"
          >
            <SocialIcon platform={detectPlatform(l.url)} />
          </a>
        ))}
      </div>
    </section>
  )
}
