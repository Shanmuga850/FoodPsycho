import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin"
  const filename = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabaseAdmin.storage
    .from("foodpsycho")
    .upload(filename, file, { contentType: file.type, upsert: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabaseAdmin.storage.from("foodpsycho").getPublicUrl(filename)
  return NextResponse.json({ url: data.publicUrl })
}
