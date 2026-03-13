import { Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Contact",
        title: "Let's talk about community care.",
        body: "Reach out to partner, volunteer, or request support. We respond within two working days.",
        nameLabel: "Full name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@email.com",
        messageLabel: "Message",
        messagePlaceholder: "Tell us how we can help",
        submit: "Send message",
        detailsTitle: "Contact details",
        hoursTitle: "Office hours",
        hoursText: "Saturday to Thursday · 10:00 AM - 6:00 PM",
    },
    bn: {
        tag: "যোগাযোগ",
        title: "কমিউনিটি যত্ন নিয়ে কথা বলি।",
        body: "অংশীদার হতে, স্বেচ্ছাসেবী হতে বা সহায়তা চাইতে যোগাযোগ করুন। আমরা দুই কর্মদিবসের মধ্যে সাড়া দিই।",
        nameLabel: "পূর্ণ নাম",
        namePlaceholder: "আপনার নাম",
        emailLabel: "ইমেইল",
        emailPlaceholder: "you@email.com",
        messageLabel: "বার্তা",
        messagePlaceholder: "কিভাবে সহায়তা করতে পারি লিখুন",
        submit: "বার্তা পাঠান",
        detailsTitle: "যোগাযোগের তথ্য",
        hoursTitle: "অফিস সময়",
        hoursText: "শনিবার থেকে বৃহস্পতিবার · সকাল ১০:০০ - সন্ধ্যা ৬:০০",
    },
}

export default async function ContactPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{content.body}</p>
                <form className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                        <label className="text-sm text-muted-foreground">{content.nameLabel}</label>
                        <Input placeholder={content.namePlaceholder} />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm text-muted-foreground">{content.emailLabel}</label>
                        <Input type="email" placeholder={content.emailPlaceholder} />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm text-muted-foreground">{content.messageLabel}</label>
                        <Textarea rows={4} placeholder={content.messagePlaceholder} />
                    </div>
                    <Button className="w-fit bg-primary-dark text-white hover:bg-primary-brand">{content.submit}</Button>
                </form>
            </section>

            <section className="space-y-4">
                <Card className="border-none bg-[#0f2f33] text-white">
                    <CardHeader>
                        <CardTitle>{content.detailsTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-white/80">
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4" />
                            hello@ovijatrik.org
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4" />
                            +880 1XXX-XXXXXX
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4" />
                            Mirpur, Dhaka, Bangladesh
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none bg-white">
                    <CardHeader>
                        <CardTitle>{content.hoursTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {content.hoursText}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
