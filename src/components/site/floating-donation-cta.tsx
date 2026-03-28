"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type FloatingDonationCtaProps = {
  href: string;
  language: "en" | "bn";
};

export default function FloatingDonationCta({
  href,
  language,
}: FloatingDonationCtaProps) {
  const pathname = usePathname();
  const buttonLabel =
    language === "en" ? "Support Right Now" : "এখনই সহায়তা করুন";

  const segments = pathname.split("/").filter(Boolean);
  const isWeekly = segments[0] === "weekly-projects";
  const isTubewell = segments[0] === "tubewell-projects";
  const slug = segments.length > 1 ? segments[1] : "";

  const donationHref = isWeekly
    ? `/donation?campaign=WEEKLY${slug ? `&project=${encodeURIComponent(slug)}` : ""}`
    : isTubewell
      ? `/donation?campaign=TUBEWELL${slug ? `&project=${encodeURIComponent(slug)}` : ""}`
      : href;

  return (
    <div className="pointer-events-none fixed inset-x-4 z-50 sm:inset-x-auto sm:right-6 md:right-8 bottom-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto rounded-2xl border border-cyan-300/80 bg-linear-to-r from-cyan-500 via-sky-500 to-emerald-500 p-1 shadow-[0_20px_48px_-20px_rgba(14,116,144,0.95)] ring-1 ring-cyan-200/80 backdrop-blur dark:border-cyan-300/40 dark:ring-cyan-200/20">
        <Link
          href={donationHref}
          className="inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-extrabold tracking-[0.02em] text-sky-700 transition hover:scale-[1.02] hover:text-cyan-700 dark:bg-slate-950 dark:text-cyan-300 dark:hover:text-emerald-300"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}
