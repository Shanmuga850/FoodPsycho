"use client"

import { useState } from "react"
import { Download, ZoomIn, ZoomOut } from "lucide-react"
import type { MenuFile } from "@/lib/food-psycho"
import { SectionHeading } from "./section-heading"

export function MenuViewer({ menu }: { menu: MenuFile | null }) {
  const [zoom, setZoom] = useState(1)
  const isPdf = menu?.type?.includes("pdf") || menu?.url?.startsWith("data:application/pdf")

  return (
    <section className="px-6 py-12">
      <SectionHeading>Our Menu</SectionHeading>

      <div className="mx-auto mt-8 max-w-3xl">
        {!menu?.url ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-black/20 bg-white">
            <p className="font-montserrat text-sm text-black/50">Menu coming soon.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
            <div className="flex items-center justify-end gap-2 border-b border-black/10 px-3 py-2">
              {!isPdf && (
                <>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-montserrat text-xs font-semibold text-black transition hover:bg-black/5 disabled:opacity-40"
                    disabled={zoom <= 1}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" /> Zoom Out
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-montserrat text-xs font-semibold text-black transition hover:bg-black/5 disabled:opacity-40"
                    disabled={zoom >= 3}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" /> Zoom In
                  </button>
                </>
              )}
              <a
                href={menu.url}
                download={menu.name || "food-psycho-menu"}
                className="inline-flex items-center gap-1.5 rounded-md bg-[#FF6B2B] px-3 py-1.5 font-montserrat text-xs font-semibold text-white transition hover:brightness-95"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>

            {isPdf ? (
              <iframe
                src={menu.url}
                title="FOOD PSYCHO menu"
                className="h-[70vh] w-full"
              />
            ) : (
              <div className="max-h-[75vh] overflow-auto bg-[#F9F6F0] p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={menu.url}
                  alt="FOOD PSYCHO menu"
                  className="mx-auto w-full origin-top rounded-md transition-transform"
                  style={{ transform: `scale(${zoom})` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
