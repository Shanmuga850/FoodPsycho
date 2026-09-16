export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: React.ReactNode
  hint?: string
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-montserrat text-sm font-semibold text-black">{label}</span>
      {children}
      {hint ? <span className="font-montserrat text-xs text-black/50">{hint}</span> : null}
    </label>
  )
}

export const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 font-montserrat text-sm text-black outline-none transition focus:border-[#FF6B2B] focus:ring-2 focus:ring-[#FF6B2B]/20"

export function AdminCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-playfair text-xl font-bold text-black">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  )
}
