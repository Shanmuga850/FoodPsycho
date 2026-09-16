import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}

export async function GET() {
  const supabase = getAdmin()
  const { data } = await supabase.from("foodpsycho_data").select("data").eq("id", 1).maybeSingle()
  return NextResponse.json(data?.data || {}, {
    headers: { "Cache-Control": "no-store" }
  })
}

export async function POST(req: NextRequest) {
  const supabase = getAdmin()
  const body = await req.json()
  const { error } = await supabase.from("foodpsycho_data").upsert(
    { id: 1, data: body, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}