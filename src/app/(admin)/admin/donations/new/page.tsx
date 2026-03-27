import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createDonation } from "@/actions/donations";
import { addWeeklyDonation } from "@/actions/weekly-project";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";

export default async function NewDonationPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "অনুদান যোগ করুন",
        fundTypeGeneral: "সাধারণ তহবিল অনুদান",
        fundTypeProject: "সাপ্তাহিক নির্দিষ্ট প্রকল্প",
        projectPlaceholder:
          "সাপ্তাহিক প্রকল্প নির্বাচন করুন (প্রকল্প অনুদানের জন্য)",
        amount: "পরিমাণ",
        donorName: "দাতার নাম",
        phone: "ফোন",
        trxId: "ট্রানজ্যাকশন আইডি",
        comments: "মন্তব্য",
        submit: "অনুদান তৈরি করুন",
      }
    : {
        title: "Add Donation",
        fundTypeGeneral: "General Fund Donation",
        fundTypeProject: "Specific Weekly Project",
        projectPlaceholder:
          "Select weekly project (only for project donations)",
        amount: "Amount",
        donorName: "Donor name",
        phone: "Phone",
        trxId: "TRX ID",
        comments: "Comments",
        submit: "Create Donation",
      };

  const weeklyProjects = await prisma.weeklyProject.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titleBn: true,
      titleEn: true,
      slug: true,
    },
  });

  async function createAction(formData: FormData) {
    "use server";
    const fundType = String(formData.get("fundType") || "GENERAL");
    const projectId = String(formData.get("projectId") || "").trim();

    if (fundType === "WEEKLY_PROJECT") {
      if (!projectId) {
        throw new Error("Please select a weekly project for this donation");
      }

      await addWeeklyDonation({
        projectId,
        medium: String(formData.get("medium") || "OTHER") as
          | "BKASH"
          | "NAGAD"
          | "ROCKET"
          | "BANK"
          | "OTHER",
        amount: Number(formData.get("amount") || 0),
        trxid: String(formData.get("trxid") || "") || undefined,
        comments: String(formData.get("comments") || "") || undefined,
        phone: String(formData.get("phone") || "") || undefined,
        donorName: String(formData.get("donorName") || "") || undefined,
        date: new Date(
          String(formData.get("date") || new Date().toISOString()),
        ),
      });

      redirect(`/admin/weekly-projects/${projectId}`);
    }

    await createDonation({
      medium: String(formData.get("medium") || "OTHER") as
        | "BKASH"
        | "NAGAD"
        | "ROCKET"
        | "BANK"
        | "OTHER",
      amount: Number(formData.get("amount") || 0),
      trxid: String(formData.get("trxid") || "") || undefined,
      comments: String(formData.get("comments") || "") || undefined,
      phone: String(formData.get("phone") || "") || undefined,
      donorName: String(formData.get("donorName") || "") || undefined,
      type: String(formData.get("type") || "GENERAL") as
        | "GENERAL"
        | "ZAKAT"
        | "SADAQAH"
        | "EMERGENCY"
        | "RAMADAN"
        | "OTHER",
      date: new Date(String(formData.get("date") || new Date().toISOString())),
    });
    redirect("/admin/donations");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-100">
          {copy.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createAction} className="grid gap-4 md:grid-cols-2">
          <select
            name="fundType"
            defaultValue="GENERAL"
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="GENERAL">{copy.fundTypeGeneral}</option>
            <option value="WEEKLY_PROJECT">{copy.fundTypeProject}</option>
          </select>
          <select
            name="projectId"
            defaultValue=""
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">{copy.projectPlaceholder}</option>
            {weeklyProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {isBn
                  ? project.titleBn || project.titleEn
                  : project.titleEn || project.titleBn}
              </option>
            ))}
          </select>
          <select
            name="medium"
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="BKASH">BKASH</option>
            <option value="NAGAD">NAGAD</option>
            <option value="ROCKET">ROCKET</option>
            <option value="BANK">BANK</option>
            <option value="OTHER">OTHER</option>
          </select>
          <select
            name="type"
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="GENERAL">GENERAL</option>
            <option value="ZAKAT">ZAKAT</option>
            <option value="SADAQAH">SADAQAH</option>
            <option value="EMERGENCY">EMERGENCY</option>
            <option value="RAMADAN">RAMADAN</option>
            <option value="OTHER">OTHER</option>
          </select>
          <input
            name="amount"
            type="number"
            min={1}
            placeholder={copy.amount}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
            required
          />
          <input
            name="date"
            type="date"
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="donorName"
            placeholder={copy.donorName}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="phone"
            placeholder={copy.phone}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            name="trxid"
            placeholder={copy.trxId}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <textarea
            name="comments"
            rows={4}
            placeholder={copy.comments}
            className="rounded-md border border-input bg-white px-3 py-2 text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
          />
          <Button type="submit" className="w-full md:col-span-2 md:w-fit">
            {copy.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
