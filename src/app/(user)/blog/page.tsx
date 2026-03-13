import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Blog",
        title: "Stories from the field.",
        body: "Weekly recaps, partner updates, and insight into our impact projects.",
        posts: [
            {
                title: "Weekly drive recap: February food baskets",
                excerpt: "A short look at how volunteers delivered essentials across three neighborhoods.",
            },
            {
                title: "Why tubewells matter for rural families",
                excerpt: "Understanding the long-term impact of safe water access.",
            },
            {
                title: "Meet the volunteers behind Ovijatrik",
                excerpt: "Stories from the people who organize weekly support on the ground.",
            },
        ],
        ctaTitle: "Have a story to share?",
        ctaBody: "We welcome guest contributions from volunteers and partners.",
        ctaButton: "Contact the team",
    },
    bn: {
        tag: "ব্লগ",
        title: "মাঠের গল্পগুলো।",
        body: "সাপ্তাহিক প্রতিবেদন, অংশীদার আপডেট এবং আমাদের প্রভাব প্রকল্পের গল্প।",
        posts: [
            {
                title: "সাপ্তাহিক উদ্যোগ: ফেব্রুয়ারির খাদ্য ঝুড়ি",
                excerpt: "তিনটি এলাকায় স্বেচ্ছাসেবীরা কীভাবে জরুরি সহায়তা পৌঁছে দিয়েছেন তার সংক্ষিপ্ত গল্প।",
            },
            {
                title: "গ্রামীণ পরিবারে টিউবওয়েলের গুরুত্ব",
                excerpt: "নিরাপদ পানির দীর্ঘমেয়াদি প্রভাব বোঝা।",
            },
            {
                title: "অভিযাত্রীকের স্বেচ্ছাসেবীদের গল্প",
                excerpt: "যারা মাঠে সাপ্তাহিক সহায়তা সংগঠিত করেন তাদের কথা।",
            },
        ],
        ctaTitle: "আপনার গল্প শেয়ার করবেন?",
        ctaBody: "স্বেচ্ছাসেবী ও অংশীদারদের অতিথি লেখা আমরা স্বাগত জানাই।",
        ctaButton: "টিমের সাথে যোগাযোগ করুন",
    },
}

export default async function BlogPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{content.body}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
                {content.posts.map((post) => (
                    <Card key={post.title} className="border-none bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{post.excerpt}</CardContent>
                    </Card>
                ))}
            </section>

            <section className="rounded-3xl bg-[#0f2f33] px-8 py-10 text-white shadow-soft">
                <h2 className="text-2xl font-semibold">{content.ctaTitle}</h2>
                <p className="mt-3 text-sm text-white/80">{content.ctaBody}</p>
                <Button asChild className="mt-6 bg-white text-[#0f2f33] hover:bg-white/90">
                    <Link href="/contact">{content.ctaButton}</Link>
                </Button>
            </section>
        </div>
    )
}
