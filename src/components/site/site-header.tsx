"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";

const navItems = [
  { key: "about", href: "/about" },
  { key: "weekly", href: "/weekly-project" },
  { key: "tubewell", href: "/tubewell-project" },
  { key: "impact", href: "/our-impact" },
  { key: "apply", href: "/apply-for-donation" },
  { key: "join", href: "/join-us" },
  { key: "blog", href: "/blog" },
  { key: "gallery", href: "/gallery" },
  { key: "contact", href: "/contact" },
];

const copy = {
  en: {
    name: "Ovijatrik",
    tagline: "Charitable organization",
    nav: {
      about: "About",
      weekly: "Weekly Project",
      tubewell: "Tubewell Project",
      impact: "Our Impact",
      apply: "Apply for Donation",
      join: "Join Us",
      blog: "Blog",
      gallery: "Gallery",
      contact: "Contact",
    },
    join: "Join Us",
    donate: "Donate",
  },
  bn: {
    name: "অভিযাত্রীক",
    tagline: "চ্যারিটি সংগঠন",
    nav: {
      about: "সম্পর্কে",
      weekly: "সাপ্তাহিক প্রকল্প",
      tubewell: "টিউবওয়েল প্রকল্প",
      impact: "আমাদের প্রভাব",
      apply: "অনুদানের জন্য আবেদন",
      join: "যোগ দিন",
      blog: "ব্লগ",
      gallery: "গ্যালারি",
      contact: "যোগাযোগ",
    },
    join: "যোগ দিন",
    donate: "দান করুন",
  },
};

export function SiteHeader() {
  const { language } = useLanguage();
  const content = copy[language];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0f1416]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-dark text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-primary-dark">
              {content.name}
            </p>
            <p className="text-xs text-muted-foreground dark:text-white/60">
              {content.tagline}
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 dark:text-slate-200 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-primary-dark"
            >
              {content.nav[item.key as keyof typeof content.nav]}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            asChild
            variant="outline"
            className="hidden border-primary-dark text-primary-dark lg:inline-flex"
          >
            <Link href="/join-us">{content.join}</Link>
          </Button>
          <Button
            asChild
            className="bg-primary-dark text-white hover:bg-primary-brand"
          >
            <Link href="/donation">{content.donate}</Link>
          </Button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-slate-700 dark:border-white/10 dark:text-slate-200 lg:hidden">
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
