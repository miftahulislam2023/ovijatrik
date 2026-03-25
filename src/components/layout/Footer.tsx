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
      },
      copyright: "All rights reserved.",
    },
    bn: {
      brand: "অভিযাত্রিক",
      description:
        "সুবিধাবঞ্চিত মানুষের জন্য শিক্ষা, স্বাস্থ্য ও জীবিকা উন্নয়নে কাজ করে যাচ্ছে ২০০৫ সাল থেকে।",
      quickLinks: "দ্রুত লিংক",
      support: "সহায়তা",
      legal: "আইনগত",
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
      },
      copyright: "সর্বস্বত্ব সংরক্ষিত।",
    },
  } as const;

  const content = copy[language];

  return (
    <footer className="border-t border-border bg-gradient-to-b from-muted/20 to-background">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-primary">{content.brand}</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {content.quickLinks}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.projects}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.gallery}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {content.support}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/donation"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.donation}
                </Link>
              </li>
              <li>
                <Link
                  href="/apply-for-donation"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.apply}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {content.legal}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-primary"
                >
                  {content.links.privacy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {content.brand} — {content.copyright}
        </div>
      </div>
    </footer>
  );
}
