export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-emerald-50/50 via-background to-green-50/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Hands/Sadaqah Icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-green-600 shadow-2xl shadow-emerald-500/50">
            <svg
              className="h-12 w-12 animate-bounce text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hands Giving Icon */}
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Preparing
          </h2>
          <p className="text-sm text-muted-foreground">
            Your journey of giving starts here
          </p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex gap-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 [animation-delay:0ms]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 [animation-delay:150ms]"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-500 [animation-delay:300ms]"></div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 w-64 overflow-hidden rounded-full bg-muted">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-shimmer rounded-full bg-linear-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 animation-duration-[2s]"></div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 top-1/4 h-64 w-64 animate-float rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute -right-4 bottom-1/4 h-64 w-64 animate-float rounded-full bg-green-500/5 blur-3xl [animation-delay:1s]"></div>
      </div>
    </div>
  );
}
