"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Check,
  ExternalLink,
  LogOut,
  Plus,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react"
import {
  DEFAULT_DATA,
  fetchData,
  saveData,
  uid,
  uploadFile,
  type Branch,
  type FoodPsychoData,
  type SocialLink,
} from "@/lib/food-psycho"
import { AdminCard, Field, inputClass } from "./field"

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [draft, setDraft] = useState<FoodPsychoData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let active = true
    fetchData()
     .then((d) => {
        if (!active) return
        setDraft(d)
        setLoading(false)
      })
     .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
      if (savedTimer.current) clearTimeout(savedTimer.current)
    }
  }, [])

  // ✅ FIX 1: Functional update to avoid stale state
  function update<K extends keyof FoodPsychoData>(key: K, value: FoodPsychoData[K]) {
    setDraft((prev) => ({...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      console.log("Saving data:", draft) // debug
      await saveData(draft)
      setSaved(true)
      if (savedTimer.current) clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      alert("Save failed: " + (e as any).message)
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function handleMenuUpload(file: File) {
    setUploading(true)
    try {
      const url = await uploadFile(file)
      // ✅ FIX 2: Functional update
      setDraft((prev) => ({...prev, menu: { url, type: file.type, name: file.name } }))
    } catch (e) {
      alert("Upload failed: " + (e as any).message)
    } finally {
      setUploading(false)
    }
  }

  async function handleFounderImage(file: File) {
    setUploading(true)
    try {
      const url = await uploadFile(file)
      // ✅ FIX 3: Functional update - no stale draft.founder
      setDraft((prev) => ({...prev, founder: {...prev.founder, image: url } }))
    } catch (e) {
      alert("Upload failed: " + (e as any).message)
    } finally {
      setUploading(false)
    }
  }

  // branches - ALL FIXED WITH FUNCTIONAL UPDATES
  function addBranch() {
    setDraft((prev) => {
      if (prev.branches.length >= 5) return prev
      return {
       ...prev,
        branches: [
         ...prev.branches,
          { id: uid(), branch_name: "", address: "", map_link: "", phone: "" },
        ],
      }
    })
  }

  function updateBranch(id: string, patch: Partial<Branch>) {
    setDraft((prev) => ({
     ...prev,
      branches: prev.branches.map((b) => (b.id === id? {...b,...patch } : b)),
    }))
  }

  function removeBranch(id: string) {
    setDraft((prev) => ({
     ...prev,
      branches: prev.branches.filter((b) => b.id!== id),
    }))
  }

  // links - ALL FIXED
  function addLink() {
    setDraft((prev) => {
      if (prev.links.length >= 5) return prev
      return {...prev, links: [...prev.links, { id: uid(), title: "", url: "" }] }
    })
  }

  function updateLink(id: string, patch: Partial<SocialLink>) {
    setDraft((prev) => ({
     ...prev,
      links: prev.links.map((l) => (l.id === id? {...l,...patch } : l)),
    }))
  }

  function removeLink(id: string) {
    setDraft((prev) => ({
     ...prev,
      links: prev.links.filter((l) => l.id!== id),
    }))
  }

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#F9F6F0]"
        aria-busy="true"
      >
        <p className="font-montserrat text-sm font-semibold text-black/50">Loading…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9F6F0] pb-32">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#F9F6F0]/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-playfair text-xl font-black text-black">FOOD PSYCHO Admin</h1>
            <p className="font-montserrat text-xs text-black/50">Manage your public page {uploading && "(Uploading...)"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-black/15 px-3 py-2 font-montserrat text-xs font-semibold text-black transition hover:bg-black/5"
            >
              <ExternalLink className="h-4 w-4" /> View Page
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-md border border-black/15 px-3 py-2 font-montserrat text-xs font-semibold text-black transition hover:bg-black/5"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 pt-6">
        <AdminCard title="Offer Banner">
          <Field label="Scrolling banner text" hint="Leave empty to hide the banner.">
            <input
              className={inputClass}
              value={draft.offerBanner}
              onChange={(e) => update("offerBanner", e.target.value)}
              placeholder="Flat 20% off this week!"
            />
          </Field>
        </AdminCard>

        <AdminCard title="Store Status">
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={draft.status.isOpen}
              onClick={() =>
                setDraft((prev) => ({...prev, status: {...prev.status, isOpen:!prev.status.isOpen } }))
              }
              className={`relative h-7 w-12 rounded-full transition ${
                draft.status.isOpen? "bg-green-500" : "bg-black/25"
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                  draft.status.isOpen? "left-6" : "left-1"
                }`}
              />
            </button>
            <span className="font-montserrat text-sm font-semibold text-black">
              {draft.status.isOpen? "Open Now" : "Closed"}
            </span>
          </div>
          <Field label="Timings">
            <input
              className={inputClass}
              value={draft.status.timings}
              onChange={(e) => setDraft((prev) => ({...prev, status: {...prev.status, timings: e.target.value } }))}
              placeholder="11:00 AM - 11:00 PM"
            />
          </Field>
        </AdminCard>

        <AdminCard title="Menu">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-black/25 bg-[#F9F6F0] px-4 py-8 text-center transition hover:border-[#FF6B2B]">
            <UploadCloud className="h-6 w-6 text-[#FF6B2B]" />
            <span className="font-montserrat text-sm font-semibold text-black">
              {uploading? "Uploading..." : "Upload menu (image or PDF)"}
            </span>
            <span className="font-montserrat text-xs text-black/50">
              {draft.menu?.name?? "No file uploaded yet"}
            </span>
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void handleMenuUpload(f)
              }}
            />
          </label>
          {draft.menu?.url? (
            <button
              type="button"
              onClick={() => update("menu", null)}
              className="inline-flex w-fit items-center gap-1.5 font-montserrat text-xs font-semibold text-red-600 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove menu
            </button>
          ) : null}
        </AdminCard>

        <AdminCard title="Branches">
          {draft.branches.map((b, i) => (
            <div key={b.id} className="rounded-lg border border-black/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-montserrat text-xs font-bold uppercase tracking-wide text-black/50">
                  Branch {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeBranch(b.id)}
                  className="text-red-600 transition hover:text-red-700"
                  aria-label="Remove branch"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <Field label="Branch name">
                  <input
                    className={inputClass}
                    value={b.branch_name}
                    onChange={(e) => updateBranch(b.id, { branch_name: e.target.value })}
                  />
                </Field>
                <Field label="Address">
                  <textarea
                    className={`${inputClass} min-h-[64px] resize-y`}
                    value={b.address}
                    onChange={(e) => updateBranch(b.id, { address: e.target.value })}
                  />
                </Field>
                <Field label="Google Maps link">
                  <input
                    className={inputClass}
                    value={b.map_link}
                    onChange={(e) => updateBranch(b.id, { map_link: e.target.value })}
                    placeholder="https://maps.google.com/?q=..."
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputClass}
                    value={b.phone}
                    onChange={(e) => updateBranch(b.id, { phone: e.target.value })}
                    placeholder="+91..."
                  />
                </Field>
              </div>
            </div>
          ))}
          {draft.branches.length < 5? (
            <button
              type="button"
              onClick={addBranch}
              className="inline-flex w-fit items-center gap-1.5 rounded-md border border-black/15 px-3 py-2 font-montserrat text-sm font-semibold text-black transition hover:bg-black/5"
            >
              <Plus className="h-4 w-4" /> Add branch
            </button>
          ) : (
            <p className="font-montserrat text-xs text-black/50">Maximum of 5 branches.</p>
          )}
        </AdminCard>

        <AdminCard title="Social & Link Buttons">
          {draft.links.map((l) => (
            <div key={l.id} className="flex items-end gap-2">
              <div className="flex-1">
                <Field label="Title">
                  <input
                    className={inputClass}
                    value={l.title}
                    onChange={(e) => updateLink(l.id, { title: e.target.value })}
                    placeholder="Instagram"
                  />
                </Field>
              </div>
              <div className="flex-[1.5]">
                <Field label="URL">
                  <input
                    className={inputClass}
                    value={l.url}
                    onChange={(e) => updateLink(l.id, { url: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => removeLink(l.id)}
                className="mb-2 text-red-600 transition hover:text-red-700"
                aria-label="Remove link"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {draft.links.length < 5? (
            <button
              type="button"
              onClick={addLink}
              className="inline-flex w-fit items-center gap-1.5 rounded-md border border-black/15 px-3 py-2 font-montserrat text-sm font-semibold text-black transition hover:bg-black/5"
            >
              <Plus className="h-4 w-4" /> Add link
            </button>
          ) : (
            <p className="font-montserrat text-xs text-black/50">Maximum of 5 links.</p>
          )}
        </AdminCard>

        <AdminCard title="Contact & WhatsApp">
          <Field label="Phone">
            <input
              className={inputClass}
              value={draft.contact.phone}
              onChange={(e) => setDraft((prev) => ({...prev, contact: {...prev.contact, phone: e.target.value } }))}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              value={draft.contact.email}
              onChange={(e) => setDraft((prev) => ({...prev, contact: {...prev.contact, email: e.target.value } }))}
            />
          </Field>
          <Field label="WhatsApp number" hint="Used for the Order on WhatsApp button.">
            <input
              className={inputClass}
              value={draft.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              placeholder="+91..."
            />
          </Field>
        </AdminCard>

        <AdminCard title="Founder">
          <div className="flex items-center gap-4">
            {draft.founder.image? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={draft.founder.image}
                alt="Founder preview"
                className="h-16 w-16 rounded-full object-cover ring-2 ring-[#D4AF37]"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-black/10" />
            )}
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-black/15 px-3 py-2 font-montserrat text-sm font-semibold text-black transition hover:bg-black/5">
              <UploadCloud className="h-4 w-4" /> {uploading? "Uploading..." : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void handleFounderImage(f)
                }}
              />
            </label>
          </div>
          <Field label="About">
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={draft.founder.about_text}
              onChange={(e) =>
                setDraft((prev) => ({...prev, founder: {...prev.founder, about_text: e.target.value } }))
              }
            />
          </Field>
          <Field label="Philosophy quote">
            <textarea
              className={`${inputClass} min-h-[70px] resize-y`}
              value={draft.founder.philosophy_text}
              onChange={(e) =>
                setDraft((prev) => ({...prev, founder: {...prev.founder, philosophy_text: e.target.value } }))
              }
            />
          </Field>
        </AdminCard>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <span
            className={`inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold text-green-600 transition-opacity ${
              saved? "opacity-100" : "opacity-0"
            }`}
          >
            <Check className="h-4 w-4" /> Changes saved
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-md bg-[#FF6B2B] px-6 py-2.5 font-montserrat text-sm font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving? "Saving…" : uploading? "Uploading..." : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  )
}