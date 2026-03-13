import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Other Projects",
        title: "Impact beyond the weekly schedule.",
        body: "Alongside weekly drives and clean water projects, we run special initiatives that respond to seasonal or emergency needs.",
        projects: [
            {
                title: "Winter blanket drive",
                description: "Seasonal distribution of warm clothing for families in northern districts.",
            },
            {
                title: "Education kits",
                description: "School supplies for children to stay enrolled throughout the year.",
            },
            {
                title: "Emergency medical support",
                description: "Immediate support for medical emergencies identified by local coordinators.",
            },
        ],
    },
    bn: {
        tag: "অন্যান্য প্রকল্প",
        title: "সাপ্তাহিক উদ্যোগের বাইরেও প্রভাব।",
        body: "সাপ্তাহিক উদ্যোগ ও বিশুদ্ধ পানির কাজের পাশাপাশি আমরা মৌসুমি বা জরুরি প্রয়োজনের জন্য বিশেষ কার্যক্রম চালাই।",
        projects: [
            {
                title: "শীতের কম্বল বিতরণ",
                description: "উত্তরাঞ্চলের পরিবারগুলোর জন্য শীতবস্ত্র বিতরণ কার্যক্রম।",
            },
            {
                title: "শিক্ষা কিট",
                description: "শিশুদের স্কুলে টিকে থাকতে প্রয়োজনীয় সামগ্রী সহায়তা।",
            },
            {
                title: "জরুরি চিকিৎসা সহায়তা",
                description: "স্থানীয় সমন্বয়কারীদের শনাক্ত করা জরুরি চিকিৎসা সহায়তা।",
            },
        ],
    },
}

export default async function OtherProjectsPage() {
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
                {content.projects.map((project) => (
                    <Card key={project.title} className="border-none bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">{project.description}</CardContent>
                    </Card>
                ))}
            </section>
        </div>
    )
}
