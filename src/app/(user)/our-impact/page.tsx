import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Our Impact",
        title: "Weekly consistency creates lasting change.",
        body:
            "Ovijatrik measures impact weekly, not yearly. We track how many families we reach, how quickly we respond to emergencies, and how well communities maintain long-term projects.",
        stats: [
            { label: "Families supported weekly", value: "120+" },
            { label: "Tubewell projects completed", value: "48" },
            { label: "Active volunteers", value: "60" },
            { label: "Districts reached", value: "12" },
        ],
        accountabilityTitle: "Weekly accountability",
        accountabilityBody:
            "Every drive ends with a short report: number of households, materials distributed, and budget summary.",
        feedbackTitle: "Community feedback",
        feedbackBody:
            "We collect feedback from local leaders and the families we support to improve the next week's plan.",
    },
    bn: {
        tag: "আমাদের প্রভাব",
        title: "সাপ্তাহিক ধারাবাহিকতা দীর্ঘমেয়াদি পরিবর্তন আনে।",
        body:
            "অভিযাত্রীক বছরে নয়, প্রতি সপ্তাহে প্রভাব পরিমাপ করে। আমরা কত পরিবারে পৌঁছাই, জরুরিতে কত দ্রুত সাড়া দিই, এবং কমিউনিটি কীভাবে দীর্ঘমেয়াদি প্রকল্প ধরে রাখে তা পর্যবেক্ষণ করি।",
        stats: [
            { label: "সপ্তাহে সহায়তা পাওয়া পরিবার", value: "120+" },
            { label: "সম্পন্ন টিউবওয়েল প্রকল্প", value: "48" },
            { label: "সক্রিয় স্বেচ্ছাসেবক", value: "60" },
            { label: "যে জেলায় পৌঁছেছি", value: "12" },
        ],
        accountabilityTitle: "সাপ্তাহিক স্বচ্ছতা",
        accountabilityBody:
            "প্রতিটি উদ্যোগ শেষে আমরা সংক্ষিপ্ত প্রতিবেদন দিই: পরিবার সংখ্যা, বিতরণকৃত উপকরণ, এবং ব্যয়ের সারাংশ।",
        feedbackTitle: "কমিউনিটি মতামত",
        feedbackBody:
            "স্থানীয় নেতা ও সহায়তা পাওয়া পরিবারগুলোর মতামত নিয়ে আমরা পরবর্তী সপ্তাহের পরিকল্পনা উন্নত করি।",
    },
}

export default async function OurImpactPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-[#0f2f33] px-8 py-10 text-white shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-white/80">{content.body}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-4">
                {content.stats.map((stat) => (
                    <Card key={stat.label} className="border-none bg-white text-center shadow-soft">
                        <CardHeader>
                            <CardTitle className="text-3xl text-primary-dark">{stat.value}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <Card className="border-none bg-white">
                    <CardHeader>
                        <CardTitle>{content.accountabilityTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {content.accountabilityBody}
                    </CardContent>
                </Card>
                <Card className="border-none bg-white">
                    <CardHeader>
                        <CardTitle>{content.feedbackTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {content.feedbackBody}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
