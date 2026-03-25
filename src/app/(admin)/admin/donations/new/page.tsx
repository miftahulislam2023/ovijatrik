import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createDonation } from "@/actions/donations";

export default function NewDonationPage() {
    async function createAction(formData: FormData) {
        "use server";
        await createDonation({
            medium: String(formData.get("medium") || "OTHER") as "BKASH" | "NAGAD" | "ROCKET" | "BANK" | "OTHER",
            amount: Number(formData.get("amount") || 0),
            trxid: String(formData.get("trxid") || "") || undefined,
            comments: String(formData.get("comments") || "") || undefined,
            phone: String(formData.get("phone") || "") || undefined,
            donorName: String(formData.get("donorName") || "") || undefined,
            type: String(formData.get("type") || "GENERAL") as "GENERAL" | "ZAKAT" | "SADAQAH" | "EMERGENCY" | "RAMADAN" | "OTHER",
            date: new Date(String(formData.get("date") || new Date().toISOString())),
        });
        redirect("/admin/donations");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add Global Donation</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={createAction} className="grid gap-4 md:grid-cols-2">
                    <select name="medium" className="rounded-md border border-input px-3 py-2">
                        <option value="BKASH">BKASH</option>
                        <option value="NAGAD">NAGAD</option>
                        <option value="ROCKET">ROCKET</option>
                        <option value="BANK">BANK</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                    <select name="type" className="rounded-md border border-input px-3 py-2">
                        <option value="GENERAL">GENERAL</option>
                        <option value="ZAKAT">ZAKAT</option>
                        <option value="SADAQAH">SADAQAH</option>
                        <option value="EMERGENCY">EMERGENCY</option>
                        <option value="RAMADAN">RAMADAN</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                    <input name="amount" type="number" min={1} placeholder="Amount" className="rounded-md border border-input px-3 py-2" required />
                    <input name="date" type="date" className="rounded-md border border-input px-3 py-2" />
                    <input name="donorName" placeholder="Donor name" className="rounded-md border border-input px-3 py-2" />
                    <input name="phone" placeholder="Phone" className="rounded-md border border-input px-3 py-2" />
                    <input name="trxid" placeholder="TRX ID" className="rounded-md border border-input px-3 py-2 md:col-span-2" />
                    <textarea name="comments" rows={4} placeholder="Comments" className="rounded-md border border-input px-3 py-2 md:col-span-2" />
                    <Button type="submit" className="md:col-span-2 w-fit">Create Donation</Button>
                </form>
            </CardContent>
        </Card>
    );
}
