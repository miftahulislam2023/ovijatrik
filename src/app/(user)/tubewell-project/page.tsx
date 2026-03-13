import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        tag: "Tubewell Project",
        title: "A record of clean water projects completed by Ovijatrik.",
        body:
            "Tubewell projects are fully funded through partners and supporters. This page documents completed installations and community maintenance updates. We do not collect donations for tubewell projects directly.",
        empty: "Tubewell project stories will appear here once the first update is published.",
    },
    bn: {
        tag: "টিউবওয়েল প্রকল্প",
        title: "অভিযাত্রীকের সম্পন্ন বিশুদ্ধ পানির প্রকল্পের নথি।",
        body:
            "টিউবওয়েল প্রকল্প অংশীদার ও সহায়তাকারীদের পূর্ণ অর্থায়নে বাস্তবায়িত হয়। এখানে সম্পন্ন স্থাপন ও কমিউনিটি রক্ষণাবেক্ষণ আপডেট নথিভুক্ত করা হয়। টিউবওয়েল প্রকল্পের জন্য এখানে দান সংগ্রহ করা হয় না।",
        empty: "প্রথম আপডেট প্রকাশ হলে টিউবওয়েল প্রকল্পের গল্প এখানে দেখা যাবে।",
    },
}

export default async function TubewellProjectPage() {
    const language = await getRequestLanguage()
    const content = copy[language]
    const projects = await prisma.tubewellProject.findMany({
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-10">
            <section className="rounded-3xl bg-[#0f2f33] px-8 py-10 text-white shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{content.tag}</p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">{content.title}</h1>
                <p className="mt-4 text-base text-white/80">{content.body}</p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
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
                            <CardTitle className="text-xl">{project.title}</CardTitle>
                            {project.location && <p className="text-sm text-muted-foreground">{project.location}</p>}
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            {project.description}
                        </CardContent>
                    </Card>
                ))}
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
