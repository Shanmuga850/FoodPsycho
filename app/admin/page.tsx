"use client"

import { useEffect, useState } from "react"
import { ADMIN_AUTH_KEY } from "@/lib/food-psycho"
import { LoginGate } from "@/components/food-psycho/admin/login-gate"
import { AdminDashboard } from "@/components/food-psycho/admin/admin-dashboard"

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(ADMIN_AUTH_KEY) === "1")
    setReady(true)
  }, [])

  function login() {
    window.sessionStorage.setItem(ADMIN_AUTH_KEY, "1")
    setAuthed(true)
  }

  function logout() {
    window.sessionStorage.removeItem(ADMIN_AUTH_KEY)
    setAuthed(false)
  }

  if (!ready) return <main className="min-h-screen bg-[#F9F6F0]" aria-busy="true" />
  if (!authed) return <LoginGate onSuccess={login} />
  return <AdminDashboard onLogout={logout} />
}
