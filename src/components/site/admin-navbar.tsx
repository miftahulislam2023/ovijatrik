"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Droplets,
  FileImage,
  HandCoins,
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  Mail,
  Newspaper,
  ScrollText,
  Users,
  Menu,
  X,
} from "lucide-react";

type AdminLanguage = "en" | "bn";

const navItems = [
  { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "weekly", href: "/admin/weekly-projects", icon: ListChecks },
  { key: "tubewell", href: "/admin/tubewell-projects", icon: Droplets },
  { key: "blog", href: "/admin/blog", icon: Newspaper },
  { key: "gallery", href: "/admin/gallery", icon: FileImage },
  { key: "donations", href: "/admin/donations", icon: HandCoins },
  { key: "donors", href: "/admin/donors", icon: HeartHandshake },
  { key: "donorSegments", href: "/admin/donor-segments", icon: HeartHandshake },
  { key: "applications", href: "/admin/applications", icon: ScrollText },
  { key: "volunteers", href: "/admin/volunteers", icon: Users },
  { key: "messages", href: "/admin/messages", icon: Mail },
] as const;

const textCopy = {
  en: {
    admin: "Admin",
    panel: "Admin Panel",
    subtitle: "Manage weekly and tubewell projects.",
    nav: {
      dashboard: "Dashboard",
      weekly: "Weekly Projects",
      tubewell: "Tubewell Projects",
      blog: "Blog",
      gallery: "Gallery",
      donations: "Global Donations",
      donors: "Donors",
      donorSegments: "Donor Segments",
      applications: "Applications",
      volunteers: "Volunteers",
      messages: "Messages",
    },
  },
  bn: {
    admin: "অ্যাডমিন",
    panel: "অ্যাডমিন প্যানেল",
    subtitle: "সাপ্তাহিক ও টিউবওয়েল প্রকল্প পরিচালনা করুন।",
    nav: {
      dashboard: "ড্যাশবোর্ড",
      weekly: "সাপ্তাহিক প্রকল্প",
      tubewell: "টিউবওয়েল প্রকল্প",
      blog: "ব্লগ",
      gallery: "গ্যালারি",
      donations: "সাধারণ অনুদান",
      donors: "ডোনার",
      donorSegments: "ডোনার সেগমেন্টস",
      applications: "আবেদনসমূহ",
      volunteers: "স্বেচ্ছাসেবক",
      messages: "বার্তাসমূহ",
    },
  },
} as const;

export function AdminSidebar({ language }: { language: AdminLanguage }) {
  const pathname = usePathname();
  const content = textCopy[language];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-black/10 bg-white/50 px-5 py-6 lg:flex dark:border-white/10 dark:bg-[#0b1012]/50">
      <Link
        href="/admin/dashboard"
        className="mb-8 flex items-center gap-3 rounded-2xl border border-transparent p-2 transition-all hover:bg-black/5 dark:hover:bg-white/10"
      >
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
          <Image
            src="/logo.png"
            alt="Ovijatrik Foundation logo"
            fill
            sizes="40px"
            className="object-cover"
            priority
          />
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
            {content.admin}
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Ovijatrik
          </span>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-black/5 font-semibold text-slate-900 shadow-sm dark:bg-white/10 dark:text-white"
                  : "font-medium text-slate-500 hover:bg-black/5 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}
              />
              {content.nav[item.key]}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AdminHeader({
  language,
  children,
}: {
  language: AdminLanguage;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const content = textCopy[language];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/80 backdrop-blur-xl lg:static lg:border-none lg:bg-transparent lg:backdrop-blur-none dark:border-white/10 dark:bg-[#0e1416]/80 lg:dark:bg-transparent">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 lg:py-6">
          {/* Left Side: Mobile Logo OR Desktop Titles */}
          <div className="flex items-center gap-3">
            {/* Mobile Logo View */}
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 lg:hidden"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span className="font-bold tracking-tight text-slate-900 dark:text-white">
                Ovijatrik
              </span>
            </Link>

            {/* Desktop Title View */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {content.panel}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
                {content.subtitle}
              </p>
            </div>
          </div>

          {/* Right Side: Toggles & Hamburger */}
          <div className="flex items-center gap-2">
            {/* Toggles passed from layout.tsx render perfectly here without duplicating */}
            {children}

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 transition hover:bg-black/5 lg:hidden dark:text-white/70 dark:hover:bg-white/10"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-15 z-30 w-full border-b border-black/10 bg-white px-4 py-4 shadow-2xl lg:hidden dark:border-white/10 dark:bg-[#0b1012]">
          <nav className="flex flex-col gap-1 sm:grid sm:grid-cols-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // Properly handles closing the menu without an effect
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-black/5 font-semibold text-slate-900 dark:bg-white/10 dark:text-white"
                      : "font-medium text-slate-600 hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`}
                  />
                  {content.nav[item.key]}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
