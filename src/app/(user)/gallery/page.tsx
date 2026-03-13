import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Gallery",
        title: "Moments from Ovijatrik projects.",
        body: "Photo updates from weekly drives, volunteer teams, and clean water initiatives.",
        emptyTitle: "No photos yet",
        emptyBody: "Gallery photos will appear after the first projects are published.",
    },
    bn: {
        tag: "গ্যালারি",
        title: "অভিযাত্রীক প্রকল্পের কিছু মুহূর্ত।",
        body: "সাপ্তাহিক উদ্যোগ, স্বেচ্ছাসেবক দল ও বিশুদ্ধ পানির কাজের ছবি আপডেট।",
        emptyTitle: "এখনো কোনো ছবি নেই",
        emptyBody: "প্রথম প্রকল্প প্রকাশ হলে এখানে ছবি দেখা যাবে।",
    },
}

export default async function GalleryPage() {
    const language = await getRequestLanguage()
    const content = copy[language]
    const [weekly, tubewell] = await Promise.all([
        prisma.weeklyProject.findMany({
            select: { imageUrls: true, title: true },
            orderBy: { createdAt: "desc" },
            take: 12,
        }),
        prisma.tubewellProject.findMany({
            select: { imageUrls: true, title: true },
            orderBy: { createdAt: "desc" },
            take: 12,
        }),
    ])

    const images = [...weekly, ...tubewell]
        .flatMap((project) => project.imageUrls.map((url) => ({ url, title: project.title })))
        .slice(0, 16)

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-[#0f2f33] px-8 py-10 text-white shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-white/80">{content.body}</p>
            </section>

            <section className="grid gap-4 md:grid-cols-4">
                {images.map((image, index) => (
                    <div key={`${image.url}-${index}`} className="group overflow-hidden rounded-2xl bg-white shadow-soft">
                        <Image
                            src={image.url}
                            alt={image.title}
                            width={1200}
                            height={720}
                            className="h-48 w-full object-cover transition group-hover:scale-105"
                            unoptimized
                        />
                    </div>
                ))}
                {images.length === 0 && (
                    <Card className="border-dashed md:col-span-4">
                        <CardHeader>
                            <CardTitle>{content.emptyTitle}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            {content.emptyBody}
                        </CardContent>
                    </Card>
                )}
            </section>
        </div>
    )
}
