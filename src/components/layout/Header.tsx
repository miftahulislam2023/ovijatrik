"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();

  const copy = {
    en: {
      brand: "Ovijatrik",
      login: "Login",
      profile: "Profile",
      logout: "Logout",
      donate: "Donate",
      nav: {
        home: "Home",
        about: "About",
        projects: "Projects",
        weekly: "Weekly Projects",
        tubewell: "Tubewell Projects",
        apply: "Apply for Donation",
        join: "Join Us",
        blog: "Blog",
        gallery: "Gallery",
        contact: "Contact",
      },
    },
    bn: {
      brand: "অভিযাত্রিক",
      login: "লগইন",
      profile: "প্রোফাইল",
      logout: "লগআউট",
      donate: "ডোনেট করুন",
      nav: {
        home: "হোম",
        about: "আমাদের সম্পর্কে",
        projects: "প্রজেক্টসমূহ",
        weekly: "সাপ্তাহিক প্রজেক্ট",
        tubewell: "টিউবওয়েল প্রজেক্ট",
        apply: "অনুদানের জন্য আবেদন",
        join: "যোগ দিন",
        blog: "ব্লগ",
        gallery: "গ্যালারি",
        contact: "যোগাযোগ",
      },
    },
  } as const;

  const content = copy[language];
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const navItems = [
    { href: "/", label: content.nav.home },
    { href: "/about", label: content.nav.about },
    { href: "/projects", label: content.nav.projects },
    { href: "/weekly-projects", label: content.nav.weekly },
    { href: "/tubewell-projects", label: content.nav.tubewell },
    { href: "/apply-for-donation", label: content.nav.apply },
    { href: "/join-us", label: content.nav.join },
    { href: "/blog", label: content.nav.blog },
    { href: "/gallery", label: content.nav.gallery },
    { href: "/contact", label: content.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/75 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#124170] font-bold logo-link"
          >
            <div className="relative h-12 w-30 m-2">
              <Image
                src="/logo.png"
                alt="Ovijatrik Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>
        </div>

        <nav className="hidden items-center rounded-full border border-border bg-muted/40 p-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors " +
                  (active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/60 hover:text-foreground")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          {!isAuthenticated && (
            <>
              <Button asChild variant="outline" size="sm" className="shadow-sm">
                <Link href="/join-us">{content.login}</Link>
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button asChild variant="outline" size="sm" className="shadow-sm">
                <Link href="/profile">{content.profile}</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shadow-sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                {content.logout}
              </Button>
            </>
          )}
          <Button asChild size="sm" className="shadow-sm">
            <Link href="/donation">{content.donate}</Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <nav className="flex flex-col px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium hover:bg-muted ${
                  pathname === item.href
                    ? "bg-muted text-foreground"
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
            {!isAuthenticated && (
              <>
                <Button asChild variant="outline" className="mt-3" onClick={() => setOpen(false)}>
                  <Link href="/join-us">{content.login}</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <Button asChild variant="outline" className="mt-3" onClick={() => setOpen(false)}>
                  <Link href="/profile">{content.profile}</Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  {content.logout}
                </Button>
              </>
            )}
            <Button asChild className="mt-3" onClick={() => setOpen(false)}>
              <Link href="/donation">{content.donate}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
