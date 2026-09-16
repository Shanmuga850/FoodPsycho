import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("foodpsycho_data")
      .select("data")
      .eq("id", 1)
      .maybeSingle()

    if (error) {
      console.error("GET ERROR:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data?.data ?? {})
  } catch (e: any) {
    console.error("GET CRASH:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    console.log("Saving, size:", JSON.stringify(body).length)

    const { error } = await supabaseAdmin
      .from("foodpsycho_data")
      .upsert(
        { id: 1, data: body, updated_at: new Date().toISOString() },
        { onConflict: "id" }  // <-- THIS FIXES 500!
      )

    if (error) {
      console.error("SAVE ERROR:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error("POST CRASH:", e.message, e.stack)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}