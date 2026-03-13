import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRequestLanguage } from "@/lib/language"

const copy = {
    en: {
        weekly: "Weekly projects",
        tubewell: "Tubewell projects",
        donation: "Donation applications",
    },
    bn: {
        weekly: "সাপ্তাহিক প্রকল্প",
        tubewell: "টিউবওয়েল প্রকল্প",
        donation: "সহায়তার আবেদন",
    },
}

export default async function AdminDashboardPage() {
    const language = await getRequestLanguage()
    const content = copy[language]
    const [weeklyCount, tubewellCount, donationCount] = await Promise.all([
        prisma.weeklyProject.count(),
        prisma.tubewellProject.count(),
        prisma.donationApplication.count(),
    ])

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white text-slate-900 dark:bg-white/5 dark:text-white">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500 dark:text-white/60">{content.weekly}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-semibold">{weeklyCount}</p>
                </CardContent>
            </Card>
            <Card className="bg-white text-slate-900 dark:bg-white/5 dark:text-white">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500 dark:text-white/60">{content.tubewell}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-semibold">{tubewellCount}</p>
                </CardContent>
            </Card>
            <Card className="bg-white text-slate-900 dark:bg-white/5 dark:text-white">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-500 dark:text-white/60">{content.donation}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-semibold">{donationCount}</p>
                </CardContent>
            </Card>
        </div>
    )
}
