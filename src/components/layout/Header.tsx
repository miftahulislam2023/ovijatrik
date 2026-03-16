"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/", label: "হোম" },
    { href: "/about", label: "আমাদের সম্পর্কে" },
    { href: "/projects", label: "প্রজেক্টসমূহ" },
    { href: "/weekly-projects", label: "সাপ্তাহিক প্রজেক্ট" },
    { href: "/tubewell-projects", label: "টিউবওয়েল প্রজেক্ট" },
    { href: "/blog", label: "ব্লগ" },
    { href: "/gallery", label: "গ্যালারি" },
    { href: "/contact", label: "যোগাযোগ" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          অভিযাত্রিক
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/donation"
          className="hidden rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 md:block"
        >
          ডোনেট করুন
        </Link>

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
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/donation"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              ডোনেট করুন
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
