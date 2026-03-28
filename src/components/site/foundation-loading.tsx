"use client";

import { Globe2, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/language-provider";

const LOADING_COPY = {
  en: {
    strapline: "Ovijatrik Foundation",
    title: "Quest for a Smiling Face ",
    subtitle:
      "Education, clean water, and compassionate support for every journey.",
    missionTag: "Mission in motion",
    loadingText: "Preparing your impact experience",
    languageLabel: "Language",
    themeLabel: "Theme",
    light: "Light",
    dark: "Dark",
  },
  bn: {
    strapline: "অভিযাত্রিক ফাউন্ডেশন",
    title: "হাসি মুখের খুঁজে অভিযাত্রা",
    subtitle: "শিক্ষা, বিশুদ্ধ পানি ও মানবিক সহায়তায় নিরাপদ আগামী গড়া।",
    missionTag: "মিশন চলমান",
    loadingText: "আপনার ইমপ্যাক্ট অভিজ্ঞতা প্রস্তুত হচ্ছে",
    languageLabel: "ভাষা",
    themeLabel: "থিম",
    light: "লাইট",
    dark: "ডার্ক",
  },
} as const;

export default function FoundationLoading() {
  const { language } = useLanguage();
  const { theme, resolvedTheme } = useTheme();

  const currentTheme = (theme === "system" ? resolvedTheme : theme) ?? "light";
  const copy = LOADING_COPY[language];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.18),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.22),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-16 top-1/3 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-screen w-full max-w-5xl place-items-center px-6 py-16">
        <div className="w-full max-w-2xl rounded-3xl border border-border/70 bg-card/80 p-6 shadow-2xl backdrop-blur-sm sm:p-10">
          <div className="flex items-center justify-between gap-4 text-xs tracking-[0.16em] uppercase text-muted-foreground">
            <span>{copy.strapline}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/70 px-3 py-1">
              <Globe2 className="h-3.5 w-3.5" />
              {copy.missionTag}
            </span>
          </div>

          <h2 className="mt-8 text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                {copy.languageLabel}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    language === "en"
                      ? "border-primary/70 bg-primary/15 text-primary"
                      : "border-border bg-transparent text-muted-foreground"
                  }`}
                >
                  EN
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    language === "bn"
                      ? "border-primary/70 bg-primary/15 text-primary"
                      : "border-border bg-transparent text-muted-foreground"
                  }`}
                >
                  BN
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                {copy.themeLabel}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-7 w-16 rounded-full border border-border bg-muted/70 p-1">
                  <span
                    className={`absolute top-1 h-5 w-7 rounded-full bg-primary/80 transition-all duration-500 ${
                      currentTheme === "dark" ? "left-8" : "left-1"
                    }`}
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  {currentTheme === "dark" ? (
                    <MoonStar className="h-3.5 w-3.5" />
                  ) : (
                    <SunMedium className="h-3.5 w-3.5" />
                  )}
                  {currentTheme === "dark" ? copy.dark : copy.light}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 h-2 overflow-hidden rounded-full bg-muted/70">
            <div className="h-full w-2/3 rounded-full bg-linear-to-r from-primary via-accent to-primary animate-[ovijatrik-load_1.8s_ease-in-out_infinite]" />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>{copy.loadingText}</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[pulse_0.9s_ease-in-out_infinite]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[pulse_0.9s_ease-in-out_140ms_infinite]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[pulse_0.9s_ease-in-out_280ms_infinite]" />
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ovijatrik-load {
          0% {
            transform: translateX(-28%);
          }
          50% {
            transform: translateX(22%);
          }
          100% {
            transform: translateX(-28%);
          }
        }
      `}</style>
    </div>
  );
}
