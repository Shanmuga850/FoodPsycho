"use client"

import { useEffect, useState } from "react"

export const ADMIN_PASSWORD = "foodpsycho123"
export const ADMIN_AUTH_KEY = "foodpsycho_auth"

export type Branch = {
  id: string
  branch_name: string
  address: string
  map_link: string
  phone: string
}

export type SocialLink = {
  id: string
  title: string
  url: string
}

export type MenuFile = {
  url: string
  type: string
  name: string
}

export type FoodPsychoData = {
  menu: MenuFile | null
  branches: Branch[]
  links: SocialLink[]
  contact: {
    phone: string
    email: string
  }
  founder: {
    image: string | null
    about_text: string
    philosophy_text: string
  }
  status: {
    isOpen: boolean
    timings: string
  }
  offerBanner: string
  whatsapp: string
}

export const DEFAULT_DATA: FoodPsychoData = {
  menu: null,
  branches: [
    {
      id: "b1",
      branch_name: "Satyanagar",
      address: "Anuppanadi, Madurai 625009",
      map_link: "https://www.google.com/maps/place/Food+Psycho",
      phone: "+918838213898",
    },
  ],
  links: [
    { id: "l1", title: "Instagram", url: "https://instagram.com/foodpsycho" },
    { id: "l2", title: "YouTube", url: "https://youtube.com/@foodpsycho" },
    { id: "l3", title: "Facebook", url: "https://facebook.com/foodpsycho" },
  ],
  contact: {
    phone: "+918838213898",
    email: "hello@foodpsycho.in",
  },
  founder: {
    image: null,
    about_text:
      "Shanmugavel M started FOOD PSYCHO from a single home kitchen with one belief: food made fresh, every single day, tastes different.",
    philosophy_text:
      "We don't chase trends. We chase flavour, freshness, and the feeling of a meal made just for you.",
  },
  status: {
    isOpen: true,
    timings: "11:00 AM - 11:00 PM",
  },
  offerBanner: "Grand opening offer — Flat 20% off on all orders this week! Use FRESH20",
  whatsapp: "+918838213898",
}

/** FIXED: Deep merge so DB data always wins over defaults */
function mergeDefaults(parsed: Partial<FoodPsychoData>): FoodPsychoData {
  const safe = parsed && typeof parsed === "object" ? parsed : {}
  return {
    ...DEFAULT_DATA,
    ...safe,
    // DB branches/links should WIN, not defaults
    branches: safe.branches && safe.branches.length > 0 ? safe.branches : DEFAULT_DATA.branches,
    links: safe.links && safe.links.length > 0 ? safe.links : DEFAULT_DATA.links,
    menu: safe.menu !== undefined ? safe.menu : DEFAULT_DATA.menu,
    contact: { ...DEFAULT_DATA.contact, ...safe.contact },
    founder: { ...DEFAULT_DATA.founder, ...safe.founder },
    status: { ...DEFAULT_DATA.status, ...safe.status },
    offerBanner: safe.offerBanner ?? DEFAULT_DATA.offerBanner,
    whatsapp: safe.whatsapp ?? DEFAULT_DATA.whatsapp,
  }
}

/** FIXED: Handles both {data: ...} and direct object from API */
export async function fetchData(): Promise<FoodPsychoData> {
  const res = await fetch(`/api/data?t=${Date.now()}`, { 
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" }
  })
  if (!res.ok) {
    console.error("fetchData failed", await res.text())
    return DEFAULT_DATA
  }
  const json = await res.json()
  // API returns {data: {...}} or direct {...}
  const raw = json?.data ?? json
  return mergeDefaults(raw && typeof raw === "object" ? raw : {})
}

/** FIXED: Save with better error */
export async function saveData(data: FoodPsychoData): Promise<void> {
  const res = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
    body: JSON.stringify(data),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json?.error ?? "Failed to save")
}

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? "Upload failed")
  return json.url as string
}

export function useFoodPsychoData(): [FoodPsychoData, boolean] {
  const [data, setData] = useState<FoodPsychoData>(DEFAULT_DATA)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    fetchData()
      .then((d) => {
        if (!active) return
        setData(d)
        setReady(true)
      })
      .catch(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  return [data, ready]
}

export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "facebook"
  | "twitter"
  | "whatsapp"
  | "linkedin"
  | "tiktok"
  | "website"

export function detectPlatform(url: string): SocialPlatform {
  const u = url.toLowerCase()
  if (u.includes("instagram")) return "instagram"
  if (u.includes("youtube") || u.includes("youtu.be")) return "youtube"
  if (u.includes("facebook") || u.includes("fb.com")) return "facebook"
  if (u.includes("twitter") || u.includes("x.com")) return "twitter"
  if (u.includes("wa.me") || u.includes("whatsapp")) return "whatsapp"
  if (u.includes("linkedin")) return "linkedin"
  if (u.includes("tiktok")) return "tiktok"
  return "website"
}

export function uid() {
  return Math.random().toString(36).slice(2, 10)
}