import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminOverviewCharts } from "@/components/charts/admin-overview-charts";
import { prisma } from "@/lib/prisma";

function monthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function labelFromMonthKey(key: string) {
    const [year, month] = key.split("-");
    return `${month}/${year}`;
}

export default async function AdminDashboardPage() {
    const [
        globalDonations,
        weeklyDonations,
        weeklyProjects,
        weeklyProjectCount,
        tubewellProjects,
        donationTypeGroups,
        completedTubewells,
    ] = await Promise.all([
        prisma.donation.findMany({
            where: { deletedAt: null },
            select: { amount: true, date: true, phone: true },
        }),
        prisma.weeklyDonation.findMany({
            where: { deletedAt: null },
            select: { amount: true, date: true, phone: true },
        }),
        prisma.weeklyProject.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 8,
            select: { titleBn: true, titleEn: true, targetAmount: true, currentAmount: true },
        }),
        prisma.weeklyProject.count({ where: { deletedAt: null } }),
        prisma.tubewellProject.findMany({
            where: { deletedAt: null },
            select: { year: true },
        }),
        prisma.donation.groupBy({
            by: ["type"],
            where: { deletedAt: null },
            _sum: { amount: true },
        }),
        prisma.tubewellProject.count({ where: { deletedAt: null } }),
    ]);

    const totalGlobal = globalDonations.reduce((sum, item) => sum + item.amount, 0);
    const totalWeekly = weeklyDonations.reduce((sum, item) => sum + item.amount, 0);
    const totalDonations = totalGlobal + totalWeekly;

    const uniquePhones = new Set(
        [...globalDonations, ...weeklyDonations]
            .map((item) => item.phone?.trim())
            .filter((phone): phone is string => !!phone),
    );

    const monthlyMap = new Map<string, number>();
    for (const entry of [...globalDonations, ...weeklyDonations]) {
        const key = monthKey(entry.date);
        monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + entry.amount);
    }

    const monthlyDonations = Array.from(monthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12)
        .map(([key, amount]) => ({
            label: labelFromMonthKey(key),
            amount,
        }));

    const donationTypeData = donationTypeGroups
        .map((item) => ({
            type: item.type,
            amount: item._sum.amount ?? 0,
        }))
        .filter((item) => item.amount > 0);

    const weeklyProgress = weeklyProjects.map((item) => ({
        title: (item.titleEn || item.titleBn).slice(0, 18),
        target: item.targetAmount,
        current: item.currentAmount,
    }));

    const tubewellYearMap = new Map<number, number>();
    for (const item of tubewellProjects) {
        tubewellYearMap.set(item.year, (tubewellYearMap.get(item.year) ?? 0) + 1);
    }
    const tubewellByYear = Array.from(tubewellYearMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([year, count]) => ({ year: String(year), count }));

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">Total Donations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{totalDonations.toLocaleString()} BDT</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">Total Donors (Unique Phone)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{uniquePhones.size.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">Total Weekly Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{weeklyProjectCount.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">Completed Tubewell Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-semibold">{completedTubewells.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            <AdminOverviewCharts
                monthlyDonations={monthlyDonations}
                donationTypeData={donationTypeData}
                weeklyProgress={weeklyProgress}
                tubewellByYear={tubewellByYear}
            />
        </div>
    );
}
