import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

export default async function FAQPage() {
    const language = await getRequestLanguage()
    const copy = {
        en: {
            title: "Frequently Asked Questions",
            subtitle: "Find answers to common questions about Ovijatrik",
            sections: [
                {
                    category: "Donations",
                    questions: [
                        {
                            q: "How are weekly donations used?",
                            a: "Donations directly support weekly relief drives, emergency support, and community partnerships. We share updates and receipts for transparency.",
                        },
                        {
                            q: "Can I donate for a specific weekly project?",
                            a: "Yes. When a weekly project is live, you can choose to donate specifically for that drive.",
                        },
                    ],
                },
                {
                    category: "Volunteering",
                    questions: [
                        {
                            q: "How do I join as a volunteer?",
                            a: "Use the Join Us page or contact us directly. We arrange a short orientation with the local coordinator.",
                        },
                        {
                            q: "What kind of volunteer roles are available?",
                            a: "We need weekly drive coordinators, community health support, photographers, and outreach volunteers.",
                        },
                    ],
                },
                {
                    category: "Projects",
                    questions: [
                        {
                            q: "What is the difference between weekly and tubewell projects?",
                            a: "Weekly projects address immediate needs, while tubewell projects document completed clean water initiatives funded by partners.",
                        },
                        {
                            q: "Can I apply for donation support?",
                            a: "Yes. Submit the Apply for Donation form and our team will review and verify the request.",
                        },
                    ],
                },
            ],
            moreTitle: "Still have questions?",
            moreBody: "Can't find the answer you're looking for? Our team is here to help.",
            contact: "Contact Support →",
        },
        bn: {
            title: "সাধারণ জিজ্ঞাসা",
            subtitle: "অভিযাত্রীক সম্পর্কে সাধারণ প্রশ্নের উত্তর এখানে পাবেন",
            sections: [
                {
                    category: "দান",
                    questions: [
                        {
                            q: "সাপ্তাহিক দান কীভাবে ব্যবহৃত হয়?",
                            a: "দান সরাসরি সাপ্তাহিক সহায়তা, জরুরি সহায়তা এবং কমিউনিটি অংশীদারিত্বে ব্যয় হয়। স্বচ্ছতার জন্য আমরা আপডেট ও রসিদ শেয়ার করি।",
                        },
                        {
                            q: "নির্দিষ্ট সাপ্তাহিক প্রকল্পে দান করা যাবে কি?",
                            a: "হ্যাঁ। কোনো সাপ্তাহিক উদ্যোগ চালু থাকলে আপনি নির্দিষ্ট সেই উদ্যোগে দান করতে পারেন।",
                        },
                    ],
                },
                {
                    category: "স্বেচ্ছাসেবা",
                    questions: [
                        {
                            q: "আমি কীভাবে স্বেচ্ছাসেবক হতে পারি?",
                            a: "Join Us পেজে আবেদন করুন অথবা সরাসরি যোগাযোগ করুন। আমরা স্থানীয় সমন্বয়কের সাথে সংক্ষিপ্ত ওরিয়েন্টেশন আয়োজন করি।",
                        },
                        {
                            q: "কোন ধরনের স্বেচ্ছাসেবক ভূমিকা আছে?",
                            a: "সাপ্তাহিক উদ্যোগ সমন্বয়কারী, কমিউনিটি স্বাস্থ্য সহায়তা, ফটোগ্রাফার এবং আউটরিচ ভূমিকা রয়েছে।",
                        },
                    ],
                },
                {
                    category: "প্রকল্প",
                    questions: [
                        {
                            q: "সাপ্তাহিক ও টিউবওয়েল প্রকল্পের পার্থক্য কী?",
                            a: "সাপ্তাহিক প্রকল্প জরুরি প্রয়োজন পূরণ করে, আর টিউবওয়েল প্রকল্পে অংশীদারদের অর্থায়নে সম্পন্ন বিশুদ্ধ পানির কাজ নথিভুক্ত হয়।",
                        },
                        {
                            q: "আমি কি সহায়তার জন্য আবেদন করতে পারি?",
                            a: "হ্যাঁ। Apply for Donation ফর্ম জমা দিন, আমাদের টিম যাচাই করে যোগাযোগ করবে।",
                        },
                    ],
                },
            ],
            moreTitle: "আরও প্রশ্ন আছে?",
            moreBody: "আপনার প্রশ্নের উত্তর না পেলে আমাদের টিম সাহায্য করতে প্রস্তুত।",
            contact: "সহায়তার জন্য যোগাযোগ →",
        },
    }
    const content = copy[language]

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{content.title}</h1>
                    <p className="text-muted-foreground text-lg">{content.subtitle}</p>
                </div>

                <div className="space-y-8">
                    {content.sections.map((category, idx) => (
                        <Card key={idx}>
                            <CardHeader>
                                <CardTitle>{category.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {category.questions.map((faq, qIdx) => (
                                        <AccordionItem key={qIdx} value={`item-${idx}-${qIdx}`}>
                                            <AccordionTrigger className="text-left">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="mt-8">
                    <CardContent className="p-6 text-center">
                        <h3 className="font-semibold text-lg mb-2">{content.moreTitle}</h3>
                        <p className="text-muted-foreground mb-4">{content.moreBody}</p>
                        <a href="/contact" className="text-primary hover:underline font-medium">
                            {content.contact}
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
