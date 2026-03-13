import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { createTubewellProject } from "@/actions/tubewell-projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        addTitle: "Add tubewell project",
        titleLabel: "Title",
        titlePlaceholder: "Mirpur tubewell installation",
        locationLabel: "Location",
        locationPlaceholder: "Mirpur, Dhaka",
        descriptionLabel: "Description",
        descriptionPlaceholder: "Share the story, partner, and outcome.",
        completedLabel: "Completed on",
        photosLabel: "Photos",
        submit: "Create tubewell project",
    },
    bn: {
        addTitle: "টিউবওয়েল প্রকল্প যোগ করুন",
        titleLabel: "শিরোনাম",
        titlePlaceholder: "মিরপুরে টিউবওয়েল স্থাপন",
        locationLabel: "স্থান",
        locationPlaceholder: "মিরপুর, ঢাকা",
        descriptionLabel: "বিবরণ",
        descriptionPlaceholder: "গল্প, অংশীদার ও ফলাফল লিখুন।",
        completedLabel: "সম্পন্নের তারিখ",
        photosLabel: "ছবি",
        submit: "টিউবওয়েল প্রকল্প তৈরি করুন",
    },
}

export default async function TubewellProjectsAdminPage() {
    const language = await getRequestLanguage()
    const content = copy[language]
    const projects = await prisma.tubewellProject.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="grid gap-8">
            <Card className="bg-white text-slate-900 dark:bg-white/5 dark:text-white">
                <CardHeader>
                    <CardTitle>{content.addTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={createTubewellProject} className="grid gap-4" encType="multipart/form-data">
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.titleLabel}</label>
                            <Input name="title" placeholder={content.titlePlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.locationLabel}</label>
                            <Input name="location" placeholder={content.locationPlaceholder} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.descriptionLabel}</label>
                            <Textarea name="description" rows={5} placeholder={content.descriptionPlaceholder} required />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm text-slate-500 dark:text-white/70">{content.completedLabel}</label>
                            <Input name="completedAt" type="date" />
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
                            {project.location && (
                                <p className="text-sm text-slate-500 dark:text-white/50">{project.location}</p>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-white/70">
                            <p>{project.description.slice(0, 120) + "..."}</p>
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
