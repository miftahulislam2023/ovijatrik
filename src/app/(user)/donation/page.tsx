import Link from "next/link"
import { HeartHandshake, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Donation",
        title: "Fuel weekly relief and lasting impact.",
        body:
            "Donations go directly to weekly projects, emergency response, and community partnerships. Tubewell projects are documented separately and do not collect donations here.",
        apply: "Apply for donation support",
        waysTitle: "Ways to give",
        transparencyTitle: "Transparency promise",
        transparencyBody:
            "Weekly reports are shared with donors, including photos, beneficiary counts, and receipts for large purchases.",
    },
    bn: {
        tag: "দান",
        title: "সাপ্তাহিক সহায়তা ও দীর্ঘমেয়াদি প্রভাবকে শক্তি দিন।",
        body:
            "দান সরাসরি সাপ্তাহিক প্রকল্প, জরুরি সহায়তা ও কমিউনিটি অংশীদারিত্বে যায়। টিউবওয়েল প্রকল্প আলাদা ভাবে নথিভুক্ত হয় এবং এখানে দান সংগ্রহ করা হয় না।",
        apply: "সহায়তার জন্য আবেদন করুন",
        waysTitle: "দান করার উপায়",
        transparencyTitle: "স্বচ্ছতার প্রতিশ্রুতি",
        transparencyBody:
            "সাপ্তাহিক প্রতিবেদন দাতাদের সঙ্গে শেয়ার করা হয়, যেখানে ছবি, উপকারভোগীর সংখ্যা ও বড় ব্যয়ের রসিদ থাকে।",
    },
}

export default async function DonationPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{content.body}</p>
                <Button asChild className="mt-6 bg-primary-dark text-white hover:bg-primary-brand">
                    <Link href="/apply-for-donation">{content.apply}</Link>
                </Button>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <Card className="border-none bg-[#0f2f33] text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-5 w-5" />
                            {content.waysTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-white/80">
                        <p>bKash: 01XXXXXXXXX</p>
                        <p>Nagad: 01XXXXXXXXX</p>
                        <p>Bank transfer: Ovijatrik Foundation, Account #XXXXXXXX</p>
                    </CardContent>
                </Card>
                <Card className="border-none bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HeartHandshake className="h-5 w-5 text-primary-dark" />
                            {content.transparencyTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {content.transparencyBody}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
