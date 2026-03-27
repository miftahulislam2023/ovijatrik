export default function FoundationLoading() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#dbe5ec] text-[#4f7f8d]">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 w-[min(94vw,700px)] px-6 text-center">
        <p className="text-4xl font-semibold italic tracking-tight text-[#6b9dab] sm:text-6xl">The Editorial Advocate</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-[#8eb0ba]">Ovijatrik Impact Portal</p>

        <div className="mx-auto mt-12 h-px w-full max-w-sm bg-linear-to-r from-[#b24f38] via-[#b24f38] to-transparent" />
        <p className="mt-6 text-2xl italic text-[#3f5f6b] sm:text-4xl">&quot;Preparing the next chapter of impact...&quot;</p>

        <p className="mt-10 text-[11px] uppercase tracking-[0.25em] text-[#84a8b2]">Institutional Reliability</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#95bbc4]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#95bbc4] [animation-delay:180ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#95bbc4] [animation-delay:360ms]" />
        </div>

        <p className="mt-28 text-[10px] uppercase tracking-[0.2em] text-[#b6c9d0]">© 2024 The Editorial Advocate. Institutional reliability for global impact.</p>
      </div>
    </div>
  );
}
