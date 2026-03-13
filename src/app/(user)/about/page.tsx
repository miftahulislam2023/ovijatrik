import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Our story",
        title: "Ovijatrik exists to meet urgent needs every week.",
        body:
            "Ovijatrik is a charitable organization based in Bangladesh. We coordinate weekly relief and long-term impact work to ensure families feel supported beyond a single campaign. Our volunteers walk alongside communities to deliver food, education support, medical help, and clean water solutions.",
        pillars: [
            {
                title: "Weekly drives",
                body: "Rotating weekly drives help us respond quickly to food insecurity, health needs, and emergency relief.",
            },
            {
                title: "Clean water",
                body: "Tubewell projects focus on access to safe water for communities and long-term maintenance.",
            },
            {
                title: "Community care",
                body: "We partner with local leaders, teachers, and medical volunteers to maintain trust and transparency.",
            },
        ],
        missionTitle: "Our mission",
        missionBody:
            "Build consistent relief for families in need while investing in lasting impact projects such as clean water, educational support, and health partnerships.",
        promiseTitle: "Our promise",
        promiseBody:
            "We publish weekly project updates, document every major initiative, and keep community feedback at the heart of every decision.",
    },
    bn: {
        tag: "আমাদের গল্প",
        title: "অভিযাত্রীক প্রতি সপ্তাহে জরুরি প্রয়োজনের পাশে দাঁড়ায়।",
        body:
            "অভিযাত্রীক বাংলাদেশভিত্তিক একটি চ্যারিটি সংগঠন। আমরা সাপ্তাহিক সহায়তা ও দীর্ঘমেয়াদি প্রকল্প একসঙ্গে চালাই যাতে পরিবারগুলো একবারের উদ্যোগে থেমে না যায়। আমাদের স্বেচ্ছাসেবীরা খাদ্য, শিক্ষা, চিকিৎসা সহায়তা ও বিশুদ্ধ পানির সমাধান নিয়ে পাশে থাকেন।",
        pillars: [
            {
                title: "সাপ্তাহিক উদ্যোগ",
                body: "খাদ্য সংকট, স্বাস্থ্য প্রয়োজন ও জরুরি সহায়তায় দ্রুত সাড়া দিতে আমাদের সাপ্তাহিক উদ্যোগগুলো ঘুরে ঘুরে কাজ করে।",
            },
            {
                title: "বিশুদ্ধ পানি",
                body: "টিউবওয়েল প্রকল্পের মাধ্যমে নিরাপদ পানির প্রবেশাধিকার ও রক্ষণাবেক্ষণ নিশ্চিত করা হয়।",
            },
            {
                title: "কমিউনিটি যত্ন",
                body: "স্থানীয় নেতা, শিক্ষক ও চিকিৎসাসেবীদের সঙ্গে অংশীদার হয়ে আমরা আস্থা ও স্বচ্ছতা ধরে রাখি।",
            },
        ],
        missionTitle: "আমাদের লক্ষ্য",
        missionBody:
            "প্রয়োজনীয় পরিবারগুলোর জন্য ধারাবাহিক সহায়তা নিশ্চিত করা এবং বিশুদ্ধ পানি, শিক্ষাসহায়তা ও স্বাস্থ্য অংশীদারিত্বের মতো দীর্ঘমেয়াদি প্রকল্পে বিনিয়োগ করা।",
        promiseTitle: "আমাদের প্রতিশ্রুতি",
        promiseBody:
            "আমরা সাপ্তাহিক আপডেট প্রকাশ করি, প্রতিটি বড় উদ্যোগ নথিভুক্ত করি, এবং কমিউনিটির মতামতকে সিদ্ধান্তের কেন্দ্রবিন্দুতে রাখি।",
    },
}

export default async function AboutPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-12">
            <section className="rounded-3xl bg-white px-8 py-12 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{content.body}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                {content.pillars.map((item) => (
                    <Card key={item.title} className="border-none bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{item.body}</CardContent>
                    </Card>
                ))}
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                <Card className="border-none bg-[#0f2f33] text-white">
                    <CardHeader>
                        <CardTitle>{content.missionTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-white/80">
                        {content.missionBody}
                    </CardContent>
                </Card>
                <Card className="border-none bg-[#e67954] text-white">
                    <CardHeader>
                        <CardTitle>{content.promiseTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-white/90">
                        {content.promiseBody}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
