"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { ADMIN_PASSWORD } from "@/lib/food-psycho"
import { inputClass } from "./field"

export function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState("")
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      onSuccess()
    } else {
      setError(true)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F6F0] px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-8 shadow-sm"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6B2B]/10">
          <Lock className="h-5 w-5 text-[#FF6B2B]" />
        </div>
        <h1 className="mt-4 text-center font-playfair text-2xl font-black text-black">
          Admin Access
        </h1>
        <p className="mt-1 text-center font-montserrat text-sm text-black/60">
          Enter the password to manage FOOD PSYCHO.
        </p>

        <input
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value)
            setError(false)
          }}
          placeholder="Password"
          className={`${inputClass} mt-6`}
          autoFocus
        />
        {error ? (
          <p className="mt-2 font-montserrat text-sm font-medium text-red-600">
            Incorrect password.
          </p>
        ) : null}

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-[#FF6B2B] px-4 py-2.5 font-montserrat text-sm font-bold text-white transition hover:brightness-95"
        >
          Log In
        </button>
      </form>
    </main>
  )
}
