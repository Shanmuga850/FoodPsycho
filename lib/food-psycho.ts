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
  type: string // mime type
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
      branch_name: "T. Nagar",
      address: "12 Ranganathan Street, T. Nagar, Chennai 600017",
      map_link: "https://maps.google.com/?q=T+Nagar+Chennai",
      phone: "+919000000001",
    },
    {
      id: "b2",
      branch_name: "Anna Nagar",
      address: "45 2nd Avenue, Anna Nagar, Chennai 600040",
      map_link: "https://maps.google.com/?q=Anna+Nagar+Chennai",
      phone: "+919000000002",
    },
  ],
  links: [
    { id: "l1", title: "Instagram", url: "https://instagram.com/foodpsycho" },
    { id: "l2", title: "YouTube", url: "https://youtube.com/@foodpsycho" },
    { id: "l3", title: "Facebook", url: "https://facebook.com/foodpsycho" },
  ],
  contact: {
    phone: "+919000000001",
    email: "hello@foodpsycho.in",
  },
  founder: {
    image: "/founder.png",
    about_text:
      "Shanmugavel M started FOOD PSYCHO from a single home kitchen with one belief: food made fresh, every single day, tastes different. What began as weekend cooking for friends grew into a small chain of neighbourhood kitchens serving the city he loves.",
    philosophy_text:
      "We don't chase trends. We chase flavour, freshness, and the feeling of a meal made just for you.",
  },
  status: {
    isOpen: true,
    timings: "11:00 AM - 11:00 PM",
  },
  offerBanner: "Grand opening offer — Flat 20% off on all orders this week! Use FRESH20",
  whatsapp: "+919000000001",
}

/** Shallow-merges stored data over defaults so new fields always have values. */
function mergeDefaults(parsed: Partial<FoodPsychoData>): FoodPsychoData {
  return {
    ...DEFAULT_DATA,
    ...parsed,
    contact: { ...DEFAULT_DATA.contact, ...parsed.contact },
    founder: { ...DEFAULT_DATA.founder, ...parsed.founder },
    status: { ...DEFAULT_DATA.status, ...parsed.status },
  }
}

/** Reads FOOD PSYCHO data from the database via the API route. */
export async function fetchData(): Promise<FoodPsychoData> {
  const res = await fetch("/api/data", { cache: "no-store" })
  const json = await res.json()
  return mergeDefaults(json && typeof json === "object" ? json : {})
}

/** Persists the whole data object to the database via the API route. */
export async function saveData(data: FoodPsychoData): Promise<void> {
  const res = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to save")
}

/** Uploads a file to Supabase Storage and returns its public URL. */
export async function uploadFile(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error ?? "Upload failed")
  return json.url as string
}

/** Fetches FOOD PSYCHO data from the database on mount. */
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

/** Detects a social platform from a URL for icon selection. */
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

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
