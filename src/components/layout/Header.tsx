"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ChevronDown, User, LogOut, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const defaultSearchTarget = pathname.startsWith("/weekly-projects")
    ? "/weekly-projects"
    : pathname.startsWith("/tubewell-projects")
      ? "/tubewell-projects"
      : "/blog";
  const [searchTarget, setSearchTarget] = useState(defaultSearchTarget);
  const [searchQuery, setSearchQuery] = useState("");
  const { language } = useLanguage();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    setSearchTarget(defaultSearchTarget);
  }, [defaultSearchTarget]);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      router.push(searchTarget);
      return;
    }

    router.push(`${searchTarget}?q=${encodeURIComponent(trimmedQuery)}`);
    setOpen(false);
  }

  const copy = {
    en: {
      brand: "Ovijatrik",
      login: "Login",
      profile: "Profile",
      logout: "Logout",
      donate: "Donate",
      navGroups: {
        programs: "Programs",
        getInvolved: "Get Involved",
        media: "Media",
      },
      nav: {
        home: "Home",
        about: "About",
        projects: "Projects",
        weekly: "Weekly Projects",
        tubewell: "Tubewell Projects",
        sponsor: "Sponsor",
        apply: "Apply for Donation",
        join: "Join Us",
        blog: "Blog",
        gallery: "Gallery",
        contact: "Contact",
      },
      search: {
        placeholder: "Search...",
        button: "Search",
        scopeBlog: "Blog",
        scopeWeekly: "Weekly",
        scopeTubewell: "Tubewell",
      },
    },
    bn: {
      brand: "অভিযাত্রিক",
      login: "লগইন",
      profile: "প্রোফাইল",
      logout: "লগআউট",
      donate: "ডোনেট করুন",
      navGroups: {
        programs: "কর্মসূচি",
        getInvolved: "যুক্ত হোন",
        media: "মিডিয়া",
      },
      nav: {
        home: "হোম",
        about: "আমাদের সম্পর্কে",
        projects: "প্রজেক্টসমূহ",
        weekly: "সাপ্তাহিক প্রজেক্ট",
        tubewell: "টিউবওয়েল প্রজেক্ট",
        sponsor: "স্পন্সর",
        apply: "অনুদানের জন্য আবেদন",
        join: "যোগ দিন",
        blog: "ব্লগ",
        gallery: "গ্যালারি",
        contact: "যোগাযোগ",
      },
      search: {
        placeholder: "অনুসন্ধান করুন...",
        button: "খুঁজুন",
        scopeBlog: "ব্লগ",
        scopeWeekly: "সাপ্তাহিক",
        scopeTubewell: "টিউবওয়েল",
      },
    },
  } as const;

  const content = copy[language];

  const navItems = [
    { type: "link", href: "/", label: content.nav.home },
    { type: "link", href: "/about", label: content.nav.about },
    { type: "link", href: "/weekly-projects", label: content.nav.weekly },
    {
      type: "dropdown",
      label: content.navGroups.programs,
      items: [
        { href: "/projects", label: content.nav.projects },
        { href: "/tubewell-projects", label: content.nav.tubewell },
        { href: "/sponsor", label: content.nav.sponsor },
      ],
    },
    {
      type: "dropdown",
      label: content.navGroups.getInvolved,
      items: [
        { href: "/apply-for-donation", label: content.nav.apply },
        { href: "/join-us", label: content.nav.join },
      ],
    },
    {
      type: "dropdown",
      label: content.navGroups.media,
      items: [
        { href: "/blog", label: content.nav.blog },
        { href: "/gallery", label: content.nav.gallery },
      ],
    },
    { type: "link", href: "/contact", label: content.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/75 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-[#124170] logo-link"
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center rounded-full border border-border bg-muted/40 p-1 md:flex">
          {navItems.map((item, idx) => {
            if (item.type === "link") {
              const active = pathname === item.href;
              return (
                <Link
                  key={idx}
                  href={item.href!}
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
            }

            const isActiveChild = item.items?.some(
              (sub) => pathname === sub.href,
            );
            return (
              <div key={idx} className="group relative">
                <button
                  className={
                    "flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors " +
                    (isActiveChild
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground")
                  }
                >
                  {item.label}
                  <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                </button>

                <div className="absolute left-0 top-full hidden w-48 pt-2 group-hover:block">
                  <div className="flex flex-col rounded-md border border-border bg-background p-1.5 shadow-md">
                    {item.items?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={
                          "rounded-sm px-3 py-2 text-sm transition-colors hover:bg-muted " +
                          (pathname === sub.href
                            ? "font-medium text-foreground"
                            : "text-muted-foreground")
                        }
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop Actions (Right Side) */}
        <div className="hidden items-center gap-3 md:flex">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2 py-1"
            role="search"
          >
            <select
              value={searchTarget}
              onChange={(event) => setSearchTarget(event.target.value)}
              className="h-8 rounded-full border border-border bg-background px-2 text-xs text-foreground outline-none"
              aria-label="Search section"
            >
              <option value="/blog">{content.search.scopeBlog}</option>
              <option value="/weekly-projects">
                {content.search.scopeWeekly}
              </option>
              <option value="/tubewell-projects">
                {content.search.scopeTubewell}
              </option>
            </select>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={content.search.placeholder}
              className="h-8 w-36 rounded-full border border-border bg-background px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 rounded-full px-3 text-xs"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
          </form>

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />

            {isAuthenticated && (
              <>
                <div className="mx-1 h-4 w-px bg-border/50" />
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Link href="/profile" aria-label={content.profile}>
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  aria-label={content.logout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full shadow-sm"
            >
              <Link href="/join-us">{content.login}</Link>
            </Button>
          )}

          <Button asChild size="sm" className="rounded-full shadow-sm">
            <Link href="/donation">{content.donate}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
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

      {/* COMPACT Mobile Menu Content */}
      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur md:hidden">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-1 pb-4">
              {navItems.map((item, idx) => {
                // Top Level Links
                if (item.type === "link") {
                  return (
                    <Link
                      key={idx}
                      href={item.href!}
                      onClick={() => setOpen(false)}
                      className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted ${
                        pathname === item.href
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Collapsible Accordions for Grouped Items
                return (
                  <details
                    key={idx}
                    className="group [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      {item.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-1 flex flex-col space-y-1 pl-4">
                      {item.items?.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setOpen(false)}
                          className={`rounded-md border-l-2 border-transparent px-3 py-2 text-sm transition-colors hover:border-border hover:bg-muted/50 ${
                            pathname === sub.href
                              ? "border-primary bg-muted/50 text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>

            <div className="h-px w-full bg-border/50" />

            {/* Bottom Utility & Action Center */}
            <div className="flex flex-col gap-3 pt-4">
              <form
                onSubmit={handleSearchSubmit}
                className="space-y-2 rounded-lg border border-border bg-muted/30 p-3"
                role="search"
              >
                <div className="flex gap-2">
                  <select
                    value={searchTarget}
                    onChange={(event) => setSearchTarget(event.target.value)}
                    className="h-10 w-28 rounded-md border border-border bg-background px-2 text-xs text-foreground outline-none"
                    aria-label="Search section"
                  >
                    <option value="/blog">{content.search.scopeBlog}</option>
                    <option value="/weekly-projects">
                      {content.search.scopeWeekly}
                    </option>
                    <option value="/tubewell-projects">
                      {content.search.scopeTubewell}
                    </option>
                  </select>
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={content.search.placeholder}
                    className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <Button type="submit" className="w-full" size="sm">
                  <Search className="mr-1.5 h-4 w-4" />
                  {content.search.button}
                </Button>
              </form>

              {/* The "Four Buttons" Grouped Neatly */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2">
                <div className="flex gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>

                {isAuthenticated ? (
                  <div className="flex gap-2 border-l border-border/50 pl-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/profile" aria-label={content.profile}>
                        <User className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      aria-label={content.logout}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <Link href="/join-us">{content.login}</Link>
                  </Button>
                )}
              </div>

              {/* Primary Call to Action */}
              <Button asChild className="w-full" onClick={() => setOpen(false)}>
                <Link href="/donation">{content.donate}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
