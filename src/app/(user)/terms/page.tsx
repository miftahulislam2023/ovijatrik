import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Terms",
        title: "Terms of Service",
        updated: "Last updated: March 13, 2026",
        cards: [
            {
                title: "Using Ovijatrik services",
                body: "Ovijatrik provides charitable services and weekly community support. By using this website, you agree to use the information responsibly and avoid any misuse of forms or content.",
            },
            {
                title: "Donations and support",
                body: "Donations are voluntary and help fund weekly relief projects. We share updates and impact reports, but outcomes can vary based on community needs and partner availability.",
            },
            {
                title: "Volunteer participation",
                body: "Volunteers are expected to respect community guidelines and maintain confidentiality when assisting families.",
            },
            {
                title: "Content and updates",
                body: "Photos, stories, and reports remain the property of Ovijatrik and may not be reused without permission.",
            },
        ],
    },
    bn: {
        tag: "শর্তাবলি",
        title: "সেবার শর্তাবলি",
        updated: "সর্বশেষ হালনাগাদ: ১৩ মার্চ, ২০২৬",
        cards: [
            {
                title: "অভিযাত্রীক সেবা ব্যবহার",
                body: "অভিযাত্রীক দাতব্য সেবা ও সাপ্তাহিক কমিউনিটি সহায়তা প্রদান করে। এই ওয়েবসাইট ব্যবহার করলে আপনি তথ্য দায়িত্বশীলভাবে ব্যবহারের ও ফর্ম/কনটেন্ট অপব্যবহার না করার সম্মতি দেন।",
            },
            {
                title: "দান ও সহায়তা",
                body: "দান স্বেচ্ছামূলক এবং সাপ্তাহিক সহায়তা প্রকল্পে ব্যয় হয়। আমরা আপডেট ও প্রভাব প্রতিবেদন শেয়ার করি, তবে ফলাফল কমিউনিটি চাহিদা ও অংশীদারতার ওপর নির্ভর করতে পারে।",
            },
            {
                title: "স্বেচ্ছাসেবক অংশগ্রহণ",
                body: "স্বেচ্ছাসেবকদের কমিউনিটি নির্দেশিকা মানা এবং পরিবারগুলোর তথ্য গোপনীয় রাখা প্রত্যাশিত।",
            },
            {
                title: "কনটেন্ট ও আপডেট",
                body: "ছবি, গল্প ও প্রতিবেদন অভিযাত্রীকের সম্পত্তি এবং অনুমতি ছাড়া পুনঃব্যবহার করা যাবে না।",
            },
        ],
    },
}


export default async function TermsOfServicePage() {
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