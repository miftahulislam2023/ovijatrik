export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm">
      <div className="w-[min(92vw,44rem)] rounded-2xl border border-border/70 bg-card/95 p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-muted" />
            <div className="h-6 w-64 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-600" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="h-20 animate-pulse rounded-xl border border-border/70 bg-muted/45" />
          <div className="h-20 animate-pulse rounded-xl border border-border/70 bg-muted/45 [animation-delay:120ms]" />
          <div className="h-20 animate-pulse rounded-xl border border-border/70 bg-muted/45 [animation-delay:240ms]" />
        </div>

        <div className="mt-4 h-44 animate-pulse rounded-xl border border-border/70 bg-muted/35" />

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Loading admin workspace
          </p>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-600/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
