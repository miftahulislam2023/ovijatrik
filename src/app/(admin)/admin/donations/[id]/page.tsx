import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditDonationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const donation = await prisma.donation.findFirst({ where: { id, deletedAt: null } });

    if (!donation) {
        notFound();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Donation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                Amount: {donation.amount.toLocaleString()} BDT, Type: {donation.type}, Medium: {donation.medium}
            </CardContent>
        </Card>
    );
}
