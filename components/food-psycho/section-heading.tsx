export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="font-playfair text-2xl font-black uppercase tracking-wide text-black sm:text-3xl">
        {children}
      </h2>
      <div className="mt-3 h-1 w-[60px] rounded-full bg-[#FF6B2B]" aria-hidden />
    </div>
  )
}
