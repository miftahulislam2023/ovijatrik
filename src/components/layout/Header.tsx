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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
      setSearchOpen(false);
      return;
    }

    router.push(`${searchTarget}?q=${encodeURIComponent(trimmedQuery)}`);
    setSearchOpen(false);
  }

  function handleSearchOpen() {
    setOpen(false);
    setSearchOpen(true);
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
        title: "Search Content",
        description: "Search blog posts, weekly updates, and tubewell stories.",
        triggerLabel: "Open search",
        scopeLabel: "Search in",
        queryLabel: "Keyword",
        placeholder: "Search...",
        button: "Search",
        cancel: "Cancel",
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
        title: "কনটেন্ট খুঁজুন",
        description:
          "ব্লগ, সাপ্তাহিক আপডেট এবং টিউবওয়েল প্রকল্পের গল্প খুঁজে দেখুন।",
        triggerLabel: "সার্চ খুলুন",
        scopeLabel: "কোথায় খুঁজবেন",
        queryLabel: "কিওয়ার্ড",
        placeholder: "অনুসন্ধান করুন...",
        button: "খুঁজুন",
        cancel: "বাতিল",
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
        { href: "/contact", label: content.nav.contact },
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSearchOpen}
            className="rounded-full border border-black/10 bg-white/80 text-slate-600 shadow-sm transition-all hover:bg-black/5 hover:text-slate-900 dark:border-white/10 dark:bg-[#0e1416]/70 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={content.search.triggerLabel}
          >
            <Search className="h-4 w-4" />
          </Button>

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
              {/* The "Four Buttons" Grouped Neatly */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-md"
                    onClick={handleSearchOpen}
                    aria-label={content.search.triggerLabel}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
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

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-xl overflow-hidden border-black/10 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0e1416]/95"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,116,144,0.12),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.2),transparent_60%)]" />
          <div className="relative">
            <DialogHeader className="border-b border-black/10 px-6 pt-6 pb-4 text-left dark:border-white/10">
              <DialogTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {content.search.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 dark:text-white/60">
                {content.search.description}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSearchSubmit}
              className="space-y-4 px-6 pt-5 pb-6"
              role="search"
            >
              <div className="space-y-2">
                <label
                  htmlFor="header-search-scope"
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-500 dark:text-white/50"
                >
                  {content.search.scopeLabel}
                </label>
                <select
                  id="header-search-scope"
                  value={searchTarget}
                  onChange={(event) => setSearchTarget(event.target.value)}
                  className="h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 dark:border-white/10 dark:bg-[#0b1012]/70 dark:text-white/85 dark:focus:border-white/30"
                  aria-label={content.search.scopeLabel}
                >
                  <option value="/blog">{content.search.scopeBlog}</option>
                  <option value="/weekly-projects">
                    {content.search.scopeWeekly}
                  </option>
                  <option value="/tubewell-projects">
                    {content.search.scopeTubewell}
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="header-search-query"
                  className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-500 dark:text-white/50"
                >
                  {content.search.queryLabel}
                </label>
                <input
                  id="header-search-query"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={content.search.placeholder}
                  className="h-12 w-full rounded-xl border border-black/10 bg-white/80 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 dark:border-white/10 dark:bg-[#0b1012]/70 dark:text-white/85 dark:placeholder:text-white/35 dark:focus:border-white/30"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setSearchOpen(false)}
                >
                  {content.search.cancel}
                </Button>
                <Button type="submit" className="rounded-xl">
                  <Search className="mr-2 h-4 w-4" />
                  {content.search.button}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
