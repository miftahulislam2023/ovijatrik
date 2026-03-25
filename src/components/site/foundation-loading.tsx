export default function FoundationLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[radial-gradient(1200px_500px_at_20%_10%,rgba(16,185,129,0.20),transparent),radial-gradient(900px_450px_at_80%_90%,rgba(34,197,94,0.16),transparent)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(16,185,129,0.06)_35%,transparent_70%)]" />

      <div className="relative flex w-[min(92vw,28rem)] flex-col items-center gap-7 rounded-3xl border border-emerald-600/20 bg-background/80 p-8 shadow-[0_20px_80px_-30px_rgba(5,150,105,0.75)] backdrop-blur-md">
        <div className="relative flex h-36 w-36 items-end justify-center">
          <div className="animate-coin-drop absolute top-2 h-5 w-5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />

          <div className="relative h-20 w-28 rounded-xl border border-emerald-700/40 bg-emerald-950/70">
            <div className="absolute left-1/2 top-3 h-1.5 w-14 -translate-x-1/2 rounded-full bg-emerald-300/80" />
            <div className="absolute inset-x-2 bottom-2 h-4 rounded-md bg-emerald-500/20" />
          </div>

          <div className="animate-ring-pulse absolute bottom-5 h-24 w-24 rounded-full border border-emerald-400/50" />
          <div className="animate-ring-pulse absolute bottom-5 h-24 w-24 rounded-full border border-emerald-400/40 [animation-delay:350ms]" />
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Preparing Your Giving Experience
          </h2>
          <p className="text-sm text-muted-foreground">
            Setting up secure donation flows for the foundation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:0ms]" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:180ms]" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse [animation-delay:360ms]" />
        </div>
      </div>
    </div>
  );
}
