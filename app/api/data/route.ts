import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("foodpsycho_data")
    .select("data")
    .eq("id", 1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.data ?? {})
}

export async function POST(req: Request) {
  const body = await req.json()
  const { error } = await supabaseAdmin
    .from("foodpsycho_data")
    .upsert({ id: 1, data: body, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
