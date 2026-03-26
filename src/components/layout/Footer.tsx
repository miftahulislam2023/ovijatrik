"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

export default function Footer() {
  const { language } = useLanguage();

  const copy = {
    en: {
      brand: "Ovijatrik",
      description:
        "Working since 2005 to improve education, health, and livelihoods for underserved communities.",
      quickLinks: "Quick Links",
      support: "Support",
      legal: "Legal",
      community: "Community",
      links: {
        about: "About",
        projects: "Projects",
        blog: "Blog",
        gallery: "Gallery",
        donation: "Donate",
        apply: "Apply for Donation",
        contact: "Contact",
        terms: "Terms",
        privacy: "Privacy Policy",
        impact: "Our Impact",
        volunteer: "Join Us",
      },
      ctaTitle: "Build brighter futures with us",
      ctaText:
        "Every donation, volunteer hour, and shared story helps a family move forward.",
      ctaButton: "Donate Now",
      location: "Dhaka, Bangladesh",
      copyright: "All rights reserved.",
    },
    bn: {
      brand: "অভিযাত্রিক",
      description:
        "সুবিধাবঞ্চিত মানুষের জন্য শিক্ষা, স্বাস্থ্য ও জীবিকা উন্নয়নে কাজ করে যাচ্ছে ২০০৫ সাল থেকে।",
      quickLinks: "দ্রুত লিংক",
      support: "সহায়তা",
      legal: "আইনগত",
      community: "কমিউনিটি",
      links: {
        about: "আমাদের সম্পর্কে",
        projects: "প্রজেক্টসমূহ",
        blog: "ব্লগ",
        gallery: "গ্যালারি",
        donation: "ডোনেট করুন",
        apply: "অনুদানের জন্য আবেদন",
        contact: "যোগাযোগ",
        terms: "শর্তাবলী",
        privacy: "গোপনীয়তা নীতি",
        impact: "আমাদের প্রভাব",
        volunteer: "আমাদের সাথে যোগ দিন",
      },
      ctaTitle: "একসাথে গড়ি উজ্জ্বল আগামী",
      ctaText:
        "আপনার অনুদান, সময় আর সহযোগিতাই একটি পরিবারকে এগিয়ে যেতে শক্তি দেয়।",
      ctaButton: "এখনই ডোনেট করুন",
      location: "ঢাকা, বাংলাদেশ",
      copyright: "সর্বস্বত্ব সংরক্ষিত।",
    },
  } as const;

  const content = copy[language];

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:30px_30px] opacity-25" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/90">
              {content.brand}
            </p>
            <h2 className="mt-4 max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl">
              {content.ctaTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200/90 sm:text-base">
              {content.ctaText}
            </p>
          </div>

          <div className="flex items-center lg:justify-end">
            <Link
              href="/donation"
              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:translate-y-[-1px] hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 lg:w-auto"
            >
              {content.ctaButton}
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              {content.brand}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              {content.description}
            </p>
            <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-slate-200">
              {content.location}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              {content.quickLinks}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.projects}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.gallery}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              {content.support}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  href="/donation"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.donation}
                </Link>
              </li>
              <li>
                <Link
                  href="/apply-for-donation"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.apply}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              {content.community}
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link
                  href="/our-impact"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.impact}
                </Link>
              </li>
              <li>
                <Link
                  href="/join-us"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.volunteer}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-sky-200"
                >
                  {content.links.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/15 pt-6 text-center text-xs text-slate-400 sm:text-sm">
          © {new Date().getFullYear()} {content.brand}. {content.copyright}
        </div>
      </div>
    </footer>
  );
}
