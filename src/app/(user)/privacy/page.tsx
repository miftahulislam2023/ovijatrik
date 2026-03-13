import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Privacy",
        title: "Privacy Policy",
        updated: "Last updated: March 13, 2026",
        cards: [
            {
                title: "Information we collect",
                body: "We collect contact details when you apply for support, volunteer, or donate. This may include your name, phone number, email address, and address information.",
            },
            {
                title: "How we use your data",
                body: "We use your data to respond to requests, verify applications, share project updates, and improve our weekly service planning. We do not sell personal information.",
            },
            {
                title: "Data sharing",
                body: "Data is shared only with verified partners who assist in distribution or verification. We require confidentiality from all volunteers.",
            },
            {
                title: "Security",
                body: "We use secure hosting and restrict access to application data. If you want your information removed, contact us and we will respond within seven working days.",
            },
        ],
    },
    bn: {
        tag: "গোপনীয়তা",
        title: "গোপনীয়তা নীতি",
        updated: "সর্বশেষ হালনাগাদ: ১৩ মার্চ, ২০২৬",
        cards: [
            {
                title: "আমরা কী তথ্য সংগ্রহ করি",
                body: "সহায়তার আবেদন, স্বেচ্ছাসেবা বা দানের সময় আমরা যোগাযোগের তথ্য সংগ্রহ করি। এতে নাম, ফোন নম্বর, ইমেইল ও ঠিকানা থাকতে পারে।",
            },
            {
                title: "তথ্য কীভাবে ব্যবহার করি",
                body: "আমরা অনুরোধে সাড়া দিতে, আবেদন যাচাই করতে, প্রকল্প আপডেট শেয়ার করতে এবং সাপ্তাহিক পরিকল্পনা উন্নত করতে তথ্য ব্যবহার করি। ব্যক্তিগত তথ্য আমরা বিক্রি করি না।",
            },
            {
                title: "তথ্য শেয়ারিং",
                body: "বণ্টন বা যাচাইয়ে সহায়তাকারী যাচাইকৃত অংশীদারদের সঙ্গে সীমিত তথ্য শেয়ার করা হয়। সব স্বেচ্ছাসেবকের কাছ থেকে গোপনীয়তা প্রত্যাশিত।",
            },
            {
                title: "নিরাপত্তা",
                body: "আমরা নিরাপদ হোস্টিং ব্যবহার করি এবং আবেদন তথ্যের প্রবেশাধিকার সীমিত রাখি। আপনার তথ্য অপসারণ করতে চাইলে যোগাযোগ করুন—সাত কর্মদিবসের মধ্যে সাড়া দেওয়া হবে।",
            },
        ],
    },
}

export default async function PrivacyPolicyPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-3 text-sm text-muted-foreground">{content.updated}</p>
            </section>

            <div className="grid gap-6">
                {content.cards.map((card) => (
                    <Card key={card.title} className="border-none bg-white">
                        <CardHeader>
                            <CardTitle>{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{card.body}</CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
