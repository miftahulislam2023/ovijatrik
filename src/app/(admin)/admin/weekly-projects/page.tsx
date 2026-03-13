import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { createWeeklyProject } from "@/actions/weekly-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        addTitle: "Add weekly project",
        titleLabel: "Title",
        titlePlaceholder: "Clean water drive for Bhairab",
        summaryLabel: "Summary",
        summaryPlaceholder: "Short overview for the card",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Describe the goal, location, and impact.",
        targetLabel: "Target amount (BDT)",
        targetPlaceholder: "100000",
        photosLabel: "Photos",
        submit: "Create weekly project",
        targetText: "Target",
    },
    bn: {
        addTitle: "সাপ্তাহিক প্রকল্প যোগ করুন",
        titleLabel: "শিরোনাম",
        titlePlaceholder: "ভৈরবে বিশুদ্ধ পানির উদ্যোগ",
        summaryLabel: "সারসংক্ষেপ",
        summaryPlaceholder: "কার্ডের জন্য সংক্ষিপ্ত বিবরণ",
        descriptionLabel: "বিবরণ",
        descriptionPlaceholder: "লক্ষ্য, স্থান ও প্রভাব লিখুন।",
        targetLabel: "লক্ষ্যমাত্রা (BDT)",
        targetPlaceholder: "100000",
        photosLabel: "ছবি",
        submit: "সাপ্তাহিক প্রকল্প তৈরি করুন",
        targetText: "লক্ষ্য",
    },
}

export default async function WeeklyProjectsAdminPage() {
    const language = await getRequestLanguage()
    const content = copy[language]
    const projects = await prisma.weeklyProject.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="grid gap-8">
            <Card className="bg-white text-slate-900 dark:bg-white/5 dark:text-white">
                <CardHeader>
                    <CardTitle>{content.addTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createWeeklyProject} className="grid gap-4" encType="multipart/form-data">
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.titleLabel}</label>
                            <Input name="title" placeholder={content.titlePlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.summaryLabel}</label>
                            <Input name="summary" placeholder={content.summaryPlaceholder} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.descriptionLabel}</label>
                            <Textarea name="description" rows={5} placeholder={content.descriptionPlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.targetLabel}</label>
                            <Input name="targetAmount" type="number" min="1" placeholder={content.targetPlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.photosLabel}</label>
                            <Input name="images" type="file" accept="image/*" multiple />
                        </div>
                        <Button type="submit" className="w-fit">{content.submit}</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                    <Card key={project.id} className="bg-white text-slate-900 dark:bg-white/5 dark:text-white">
                        <CardHeader>
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <p className="text-sm text-slate-500 dark:text-white/50">
                                {content.targetText}: {project.targetAmount.toLocaleString()} BDT
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-white/70">
                            <p>{project.summary || project.description.slice(0, 120) + "..."}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.imageUrls.slice(0, 3).map((url) => (
                                    <Image
                                        key={url}
                                        src={url}
                                        alt={project.title}
                                        width={80}
                                        height={80}
                                        className="h-16 w-16 rounded-lg object-cover"
                                        unoptimized
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
