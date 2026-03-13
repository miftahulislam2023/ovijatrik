import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Join Us",
        title: "Become part of the Ovijatrik volunteer circle.",
        body: "Volunteers coordinate weekly visits, gather community feedback, and help document our impact. We'd love to meet you.",
        howTitle: "How it works",
        steps: [
            "Apply to volunteer with a short introduction.",
            "Meet the local coordinator for a quick orientation.",
            "Join a weekly drive or impact project team.",
            "Share feedback to keep improving our work.",
        ],
        rolesTitle: "Volunteer roles",
        roles: [
            "Weekly drive coordinator",
            "Community health support",
            "Photographer & storyteller",
            "Fundraising and outreach",
        ],
        readyTitle: "Ready to join?",
        readyBody: "Send a message and tell us how you want to contribute.",
        readyButton: "Contact the team",
    },
    bn: {
        tag: "যোগ দিন",
        title: "অভিযাত্রীকের স্বেচ্ছাসেবক দলে যুক্ত হোন।",
        body: "স্বেচ্ছাসেবীরা সাপ্তাহিক ভিজিট সমন্বয় করেন, কমিউনিটির মতামত সংগ্রহ করেন, এবং আমাদের প্রভাব নথিভুক্ত করেন। আপনাকে পেতে আমরা আগ্রহী।",
        howTitle: "কিভাবে কাজ করে",
        steps: [
            "সংক্ষিপ্ত পরিচয়সহ স্বেচ্ছাসেবক আবেদন করুন।",
            "স্থানীয় সমন্বয়কের সাথে সংক্ষিপ্ত ওরিয়েন্টেশনে অংশ নিন।",
            "সাপ্তাহিক উদ্যোগ বা প্রভাব প্রকল্প টিমে যুক্ত হোন।",
            "উন্নতির জন্য মতামত শেয়ার করুন।",
        ],
        rolesTitle: "স্বেচ্ছাসেবক ভূমিকা",
        roles: [
            "সাপ্তাহিক উদ্যোগ সমন্বয়কারী",
            "কমিউনিটি স্বাস্থ্য সহায়তা",
            "ফটোগ্রাফার ও গল্পকার",
            "তহবিল সংগ্রহ ও আউটরিচ",
        ],
        readyTitle: "যোগ দিতে প্রস্তুত?",
        readyBody: "আপনি কীভাবে অবদান রাখতে চান আমাদের জানিয়ে বার্তা দিন।",
        readyButton: "টিমের সাথে যোগাযোগ করুন",
    },
}

export default async function JoinUsPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-[#e67954] px-8 py-10 text-white shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-white/90">{content.body}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <Card className="border-none bg-white">
                    <CardHeader>
                        <CardTitle>{content.howTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        {content.steps.map((step) => (
                            <div key={step} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary-dark" />
                                <span>{step}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="border-none bg-[#0f2f33] text-white">
                    <CardHeader>
                        <CardTitle>{content.rolesTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-white/80">
                        {content.roles.map((role) => (
                            <p key={role}>{role}</p>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <h2 className="text-2xl font-semibold">{content.readyTitle}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{content.readyBody}</p>
                <Button asChild className="mt-6 bg-primary-dark text-white hover:bg-primary-brand">
                    <Link href="/contact">{content.readyButton}</Link>
                </Button>
            </section>
        </div>
    )
}
