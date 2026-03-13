"use client"

import Link from "next/link"
import { Heart, MapPin } from "lucide-react"
import { useLanguage } from "@/components/providers/language-provider"

const footerLinks = [
    { key: "about", href: "/about" },
    { key: "impact", href: "/our-impact" },
    { key: "weekly", href: "/weekly-project" },
    { key: "tubewell", href: "/tubewell-project" },
    { key: "apply", href: "/apply-for-donation" },
    { key: "terms", href: "/terms" },
    { key: "privacy", href: "/privacy" },
]

const copy = {
    en: {
        title: "Ovijatrik",
        tagline: "Walking beside communities with care, water, and weekly hope.",
        explore: "Explore",
        stayConnected: "Stay connected",
        stayBlurb: "Follow our weekly stories and get updates about emergency drives.",
        links: {
            about: "About",
            impact: "Impact",
            weekly: "Weekly Project",
            tubewell: "Tubewell Project",
            apply: "Apply for Donation",
            terms: "Terms",
            privacy: "Privacy",
        },
    },
    bn: {
        title: "অভিযাত্রীক",
        tagline: "সঙ্গে হাঁটি যত্ন, পানি, ও সাপ্তাহিক আশার পথে।",
        explore: "অন্বেষণ",
        stayConnected: "যুক্ত থাকুন",
        stayBlurb: "সাপ্তাহিক গল্প ও জরুরি উদ্যোগের আপডেট পেতে আমাদের সঙ্গে থাকুন।",
        links: {
            about: "সম্পর্কে",
            impact: "প্রভাব",
            weekly: "সাপ্তাহিক প্রকল্প",
            tubewell: "টিউবওয়েল প্রকল্প",
            apply: "সহায়তার আবেদন",
            terms: "শর্তাবলি",
            privacy: "গোপনীয়তা",
        },
    },
}

export function SiteFooter() {
    const { language } = useLanguage()
    const content = copy[language]

    return (
        <footer className="border-t border-black/5 bg-[#0e1c1f] text-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
                <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">{content.title}</p>
                    <p className="text-xl font-semibold">{content.tagline}</p>
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <MapPin className="h-4 w-4" />
                        Dhaka, Bangladesh
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold">{content.explore}</p>
                    <div className="mt-4 grid gap-2 text-sm text-white/70">
                        {footerLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="transition hover:text-white">
                                {content.links[link.key as keyof typeof content.links]}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <p className="text-sm font-semibold">{content.stayConnected}</p>
                    <p className="text-sm text-white/70">{content.stayBlurb}</p>
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                        <Heart className="h-4 w-4 text-[#e67954]" />
                        hello@ovijatrik.org
                    </div>
                </div>
            </div>
            <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
                © {new Date().getFullYear()} Ovijatrik. All rights reserved.
            </div>
        </footer>
    )
}
