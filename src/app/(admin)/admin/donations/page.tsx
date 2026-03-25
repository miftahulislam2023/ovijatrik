import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { duplicateDonation, softDeleteDonation } from "@/actions/donations";
import { DonationMedium, DonationType } from "@/generated/prisma/enums";

export default async function AdminDonationsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string; medium?: string; page?: string }>;
}) {
    const params = await searchParams;
    const q = (params.q || "").trim();
    const type = (params.type || "").trim();
    const medium = (params.medium || "").trim();
    const page = Math.max(1, Number(params.page || "1") || 1);
    const pageSize = 12;

    const where = {
        deletedAt: null,
        ...(q
            ? {
                OR: [
                    { donorName: { contains: q, mode: "insensitive" as const } },
                    { phone: { contains: q, mode: "insensitive" as const } },
                    { trxid: { contains: q, mode: "insensitive" as const } },
                    { comments: { contains: q, mode: "insensitive" as const } },
                ],
            }
            : {}),
        ...(type && ["GENERAL", "ZAKAT", "SADAQAH", "EMERGENCY", "RAMADAN", "OTHER"].includes(type)
            ? { type: type as DonationType }
            : {}),
        ...(medium && ["BKASH", "NAGAD", "ROCKET", "BANK", "OTHER"].includes(medium)
            ? { medium: medium as DonationMedium }
            : {}),
    };

    const [donations, totalCount] = await Promise.all([
        prisma.donation.findMany({
            where,
            orderBy: { date: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.donation.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const prevPage = Math.max(1, page - 1);
    const nextPage = Math.min(totalPages, page + 1);

    const queryWithPage = (targetPage: number) => {
        const qp = new URLSearchParams();
        if (q) qp.set("q", q);
        if (type) qp.set("type", type);
        if (medium) qp.set("medium", medium);
        qp.set("page", String(targetPage));
        return `/admin/donations?${qp.toString()}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Global Donations</h1>
                <Button asChild>
                    <Link href="/admin/donations/new">Add Donation</Link>
                </Button>
            </div>

            <form className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_180px_180px_auto]" method="get">
                <input
                    name="q"
                    defaultValue={q}
                    placeholder="Search donor/phone/trx"
                    className="rounded-md border border-input px-3 py-2"
                />
                <select name="type" defaultValue={type} className="rounded-md border border-input px-3 py-2">
                    <option value="">All types</option>
                    <option value="GENERAL">GENERAL</option>
                    <option value="ZAKAT">ZAKAT</option>
                    <option value="SADAQAH">SADAQAH</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                    <option value="RAMADAN">RAMADAN</option>
                    <option value="OTHER">OTHER</option>
                </select>
                <select name="medium" defaultValue={medium} className="rounded-md border border-input px-3 py-2">
                    <option value="">All mediums</option>
                    <option value="BKASH">BKASH</option>
                    <option value="NAGAD">NAGAD</option>
                    <option value="ROCKET">ROCKET</option>
                    <option value="BANK">BANK</option>
                    <option value="OTHER">OTHER</option>
                </select>
                <Button type="submit">Apply</Button>
            </form>

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
                            <div className="flex items-center gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/donations/${donation.id}`}>Edit</Link>
                                </Button>
                                <form action={async () => {
                                    "use server";
                                    await duplicateDonation(donation.id);
                                }}>
                                    <Button variant="outline" size="sm" type="submit">Duplicate</Button>
                                </form>
                                <form action={async () => {
                                    "use server";
                                    await softDeleteDonation(donation.id);
                                }}>
                                    <Button variant="destructive" size="sm" type="submit">Archive</Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Page {page} of {totalPages} ({totalCount} items)</p>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" disabled={page <= 1}>
                        <Link href={queryWithPage(prevPage)}>Previous</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" disabled={page >= totalPages}>
                        <Link href={queryWithPage(nextPage)}>Next</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
