import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Weekly Project",
        title: "Support this week's community drive.",
        body:
            "Each week we focus on a clear need: food relief, emergency medical help, school supplies, or seasonal care. Your support makes it possible to respond quickly and transparently.",
        donate: "Donate to a weekly drive",
        target: "Target",
        collected: "Collected",
        empty: "Weekly projects will be published here as soon as the first drive launches.",
    },
    bn: {
        tag: "সাপ্তাহিক প্রকল্প",
        title: "এই সপ্তাহের কমিউনিটি উদ্যোগে সহায়তা করুন।",
        body:
            "প্রতি সপ্তাহে আমরা একটি নির্দিষ্ট প্রয়োজনকে অগ্রাধিকার দিই: খাদ্য সহায়তা, জরুরি চিকিৎসা, স্কুল সামগ্রী, বা মৌসুমি যত্ন। আপনার সহায়তা দ্রুত ও স্বচ্ছভাবে সাড়া দিতে সহায়তা করে।",
        donate: "সাপ্তাহিক উদ্যোগে দান করুন",
        target: "লক্ষ্য",
        collected: "সংগ্রহ হয়েছে",
        empty: "প্রথম উদ্যোগ শুরু হলে এখানে প্রকাশ করা হবে।",
    },
}

export default async function WeeklyProjectPage() {
    const language = await getRequestLanguage()
    const content = copy[language]
    const projects = await prisma.weeklyProject.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-white px-8 py-10 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-primary-dark">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-muted-foreground">{content.body}</p>
                <Button asChild className="mt-6 bg-primary-dark text-white hover:bg-primary-brand">
                    <Link href="/donation">{content.donate}</Link>
                </Button>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => {
                    const progress = project.targetAmount
                        ? Math.min(100, Math.round((project.currentAmount / project.targetAmount) * 100))
                        : 0

                    return (
                        <Card key={project.id} className="overflow-hidden">
                            {project.imageUrls[0] && (
                                <Image
                                    src={project.imageUrls[0]}
                                    alt={project.title}
                                    width={1200}
                                    height={720}
                                    className="h-48 w-full object-cover"
                                    unoptimized
                                />
                            )}
                            <CardHeader>
                                <div className="flex items-center justify-between gap-3">
                                    <CardTitle className="text-xl">{project.title}</CardTitle>
                                    <Badge className="bg-[#e67954] text-white">{content.target} {project.targetAmount.toLocaleString()} BDT</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <p>{project.summary || project.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{content.collected}: {project.currentAmount.toLocaleString()} BDT</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} />
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
                {projects.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            {content.empty}
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    )
}
