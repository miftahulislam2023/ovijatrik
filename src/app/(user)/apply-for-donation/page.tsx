import { createDonationApplication } from "@/actions/donation-applications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Apply for Donation",
        title: "Request support from Ovijatrik.",
        body: "This form helps us understand your needs. Our team will review and contact you for verification.",
        formTitle: "Application form",
        nameLabel: "Full name",
        namePlaceholder: "Applicant name",
        phoneLabel: "Phone number",
        phonePlaceholder: "01XXXXXXXXX",
        emailLabel: "Email (optional)",
        emailPlaceholder: "email@example.com",
        addressLabel: "Address",
        addressPlaceholder: "Village, upazila, district",
        amountLabel: "Amount requested (BDT)",
        amountPlaceholder: "25000",
        reasonLabel: "Reason for support",
        reasonPlaceholder: "Explain the situation and the support needed.",
        submit: "Submit application",
    },
    bn: {
        tag: "সহায়তার আবেদন",
        title: "অভিযাত্রীকের সহায়তার আবেদন করুন।",
        body: "এই ফর্মটি আপনার প্রয়োজন বুঝতে সাহায্য করে। যাচাইয়ের জন্য আমাদের টিম যোগাযোগ করবে।",
        formTitle: "আবেদন ফর্ম",
        nameLabel: "পূর্ণ নাম",
        namePlaceholder: "আবেদনকারীর নাম",
        phoneLabel: "ফোন নম্বর",
        phonePlaceholder: "01XXXXXXXXX",
        emailLabel: "ইমেইল (ঐচ্ছিক)",
        emailPlaceholder: "email@example.com",
        addressLabel: "ঠিকানা",
        addressPlaceholder: "গ্রাম, উপজেলা, জেলা",
        amountLabel: "চাওয়া অর্থ (BDT)",
        amountPlaceholder: "25000",
        reasonLabel: "সহায়তার কারণ",
        reasonPlaceholder: "পরিস্থিতি ও প্রয়োজনীয় সহায়তার ব্যাখ্যা দিন।",
        submit: "আবেদন জমা দিন",
    },
}

export default async function ApplyForDonationPage() {
    const language = await getRequestLanguage()
    const content = copy[language]

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{content.body}</p>
            </section>

            <Card className="border-none bg-white">
                <CardHeader>
                    <CardTitle>{content.formTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createDonationApplication} className="grid gap-4">
                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">{content.nameLabel}</label>
                            <Input name="fullName" placeholder={content.namePlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">{content.phoneLabel}</label>
                            <Input name="phone" placeholder={content.phonePlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">{content.emailLabel}</label>
                            <Input name="email" type="email" placeholder={content.emailPlaceholder} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">{content.addressLabel}</label>
                            <Input name="address" placeholder={content.addressPlaceholder} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">{content.amountLabel}</label>
                            <Input name="amountRequested" type="number" min="0" placeholder={content.amountPlaceholder} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-muted-foreground">{content.reasonLabel}</label>
                            <Textarea name="reason" rows={4} placeholder={content.reasonPlaceholder} required />
                        </div>
                        <Button type="submit" className="w-fit bg-primary-dark text-white hover:bg-primary-brand">{content.submit}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
