import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from("foodpsycho_data")
      .select("data")
      .eq("id", 1)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json(data?.data || {}, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" }
    })
  } catch (err: any) {
    return NextResponse.json({}, { status: 200 }) // Always return 200 so site doesn't crash
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await req.json()

    const { error } = await supabaseAdmin
      .from("foodpsycho_data")
      .upsert(
        { id: 1, data: body, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      )

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("SAVE ERROR:", err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}