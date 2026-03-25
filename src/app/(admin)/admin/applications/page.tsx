import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { softDeleteApplication } from "@/actions/applications";
import { AppStatus } from "@/generated/prisma/enums";

export default async function AdminApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
    const params = await searchParams;
    const q = (params.q || "").trim();
    const status = (params.status || "").trim();
    const page = Math.max(1, Number(params.page || "1") || 1);
    const pageSize = 10;

    const where = {
        deletedAt: null,
        ...(q
            ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" as const } },
                    { phone: { contains: q, mode: "insensitive" as const } },
                    { email: { contains: q, mode: "insensitive" as const } },
                    { reason: { contains: q, mode: "insensitive" as const } },
                ],
            }
            : {}),
        ...(status && ["PENDING", "APPROVED", "REJECTED"].includes(status)
            ? { status: status as AppStatus }
            : {}),
    };

    const [applications, totalCount] = await Promise.all([
        prisma.application.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.application.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const prevPage = Math.max(1, page - 1);
    const nextPage = Math.min(totalPages, page + 1);

    const queryWithPage = (targetPage: number) => {
        const qp = new URLSearchParams();
        if (q) qp.set("q", q);
        if (status) qp.set("status", status);
        qp.set("page", String(targetPage));
        return `/admin/applications?${qp.toString()}`;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Donation Applications</h1>

            <form className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-[1fr_180px_auto]" method="get">
                <input name="q" defaultValue={q} placeholder="Search name, phone, reason" className="rounded-md border border-input px-3 py-2" />
                <select name="status" defaultValue={status} className="rounded-md border border-input px-3 py-2">
                    <option value="">All statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                </select>
                <Button type="submit">Apply</Button>
            </form>

            <div className="grid gap-4">
                {applications.map((application) => (
                    <Card key={application.id} className="transition hover:border-primary">
                        <CardHeader>
                            <CardTitle className="text-base">{application.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                            <p>{application.phone} - {application.status}</p>
                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/admin/applications/${application.id}`}>View</Link>
                                </Button>
                                <form action={async () => {
                                    "use server";
                                    await softDeleteApplication(application.id);
                                }}>
                                    <Button type="submit" variant="destructive" size="sm">Archive</Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {applications.length === 0 && (
                    <Card>
                        <CardContent className="py-12 text-center text-sm text-muted-foreground">
                            No applications found.
                        </CardContent>
                    </Card>
                )}
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
