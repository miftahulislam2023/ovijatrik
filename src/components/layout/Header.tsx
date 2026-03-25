"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  const copy = {
    en: {
      brand: "Ovijatrik",
      donate: "Donate",
      nav: {
        home: "Home",
        about: "About",
        projects: "Projects",
        weekly: "Weekly Projects",
        tubewell: "Tubewell Projects",
        blog: "Blog",
        gallery: "Gallery",
        contact: "Contact",
      },
    },
    bn: {
      brand: "অভিযাত্রিক",
      donate: "ডোনেট করুন",
      nav: {
        home: "হোম",
        about: "আমাদের সম্পর্কে",
        projects: "প্রজেক্টসমূহ",
        weekly: "সাপ্তাহিক প্রজেক্ট",
        tubewell: "টিউবওয়েল প্রজেক্ট",
        blog: "ব্লগ",
        gallery: "গ্যালারি",
        contact: "যোগাযোগ",
      },
    },
  } as const;

  const content = copy[language];

  const navItems = [
    { href: "/", label: content.nav.home },
    { href: "/about", label: content.nav.about },
    { href: "/projects", label: content.nav.projects },
    { href: "/weekly-projects", label: content.nav.weekly },
    { href: "/tubewell-projects", label: content.nav.tubewell },
    { href: "/blog", label: content.nav.blog },
    { href: "/gallery", label: content.nav.gallery },
    { href: "/contact", label: content.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          {content.brand}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            href="/donation"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            {content.donate}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="block rounded-md border border-border p-2 md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Link
              href="/donation"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              {content.donate}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
