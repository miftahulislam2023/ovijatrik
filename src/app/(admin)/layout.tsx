import Link from "next/link";
import Image from "next/image";
import {
  Droplets,
  FileImage,
  HandCoins,
  LayoutDashboard,
  ListChecks,
  Mail,
  Newspaper,
  ScrollText,
} from "lucide-react";
import { LanguageToggle } from "@/components/site/language-toggle";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { getRequestLanguage } from "@/lib/language";

export const dynamic = "force-dynamic";

const navItems = [
  { key: "dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { key: "weekly", href: "/admin/weekly-projects", icon: ListChecks },
  { key: "tubewell", href: "/admin/tubewell-projects", icon: Droplets },
  { key: "blog", href: "/admin/blog", icon: Newspaper },
  { key: "gallery", href: "/admin/gallery", icon: FileImage },
  { key: "donations", href: "/admin/donations", icon: HandCoins },
  { key: "applications", href: "/admin/applications", icon: ScrollText },
  { key: "messages", href: "/admin/messages", icon: Mail },
];

const copy = {
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
      applications: "Applications",
      messages: "Messages",
    },
  },
  bn: {
    admin: "অ্যাডমিন",
    panel: "অ্যাডমিন প্যানেল",
    subtitle: "সাপ্তাহিক ও টিউবওয়েল প্রকল্প পরিচালনা করুন।",
    nav: {
      dashboard: "ড্যাশবোর্ড",
      weekly: "সাপ্তাহিক প্রকল্প",
      tubewell: "টিউবওয়েল প্রকল্প",
      blog: "ব্লগ",
      gallery: "গ্যালারি",
      donations: "সাধারণ অনুদান",
      applications: "আবেদনসমূহ",
      messages: "বার্তাসমূহ",
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await getRequestLanguage();
  const content = copy[language];

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 dark:bg-[#0e1416] dark:text-white">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-black/10 bg-white px-6 py-8 dark:border-white/10 dark:bg-[#0b1012]">
          <div className="space-y-8">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-black/10 hover:bg-black/5 dark:hover:border-white/10 dark:hover:bg-white/5"
            >
              <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
                <Image
                  src="/logo.png"
                  alt="Ovijatrik Foundation logo"
                  fill
                  sizes="44px"
                  className="object-cover"
                  priority
                />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">
                  {content.admin}
                </p>
                <h1 className="text-xl font-semibold leading-tight">
                  Ovijatrik
                </h1>
              </div>
            </Link>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-slate-600 transition hover:border-black/10 hover:bg-black/5 hover:text-slate-900 dark:text-white/70 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {content.nav[item.key as keyof typeof content.nav]}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <div className="flex-1">
          <header className="border-b border-black/10 px-8 py-6 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{content.panel}</h2>
                <p className="text-sm text-slate-500 dark:text-white/50">
                  {content.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="px-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
