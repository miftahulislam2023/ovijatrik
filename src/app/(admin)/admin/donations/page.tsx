import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDonationsPage() {
    const donations = await prisma.donation.findMany({
        where: { deletedAt: null },
        orderBy: { date: "desc" },
        take: 100,
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Global Donations</h1>
                <Button asChild>
                    <Link href="/admin/donations/new">Add Donation</Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {donations.map((donation) => (
                    <Card key={donation.id}>
                        <CardHeader>
                            <CardTitle className="text-base">{donation.amount.toLocaleString()} BDT</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center justify-between gap-4 text-sm">
                            <p className="text-muted-foreground">
                                {donation.type} via {donation.medium}
                            </p>
                            <Button asChild variant="outline" size="sm">
                                <Link href={`/admin/donations/${donation.id}`}>Edit</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
