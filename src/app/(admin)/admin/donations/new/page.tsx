import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createDonation } from "@/actions/donations";
import { addWeeklyDonation } from "@/actions/weekly-project";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default async function NewDonationPage() {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        badge: "ফান্ড অপারেশন",
        title: "অনুদান যোগ করুন",
        subtitle:
          "সাধারণ তহবিল বা নির্দিষ্ট সাপ্তাহিক প্রকল্পের জন্য দ্রুত অনুদান রেকর্ড করুন।",
        fundTypeGeneral: "সাধারণ তহবিল অনুদান",
        fundTypeProject: "সাপ্তাহিক নির্দিষ্ট প্রকল্প",
        fundTypeTubewell: "নির্দিষ্ট টিউবওয়েল প্রকল্প",
        projectPlaceholder:
          "সাপ্তাহিক প্রকল্প নির্বাচন করুন (প্রকল্প অনুদানের জন্য)",
        tubewellPlaceholder:
          "টিউবওয়েল প্রকল্প নির্বাচন করুন (ট্যাগকৃত অনুদানের জন্য)",
        donationSetup: "অনুদান সেটআপ",
        donorDetails: "দাতা ও লেনদেন তথ্য",
        amount: "পরিমাণ",
        donorName: "দাতার নাম",
        phone: "ফোন",
        trxId: "ট্রানজ্যাকশন আইডি",
        comments: "মন্তব্য",
        submit: "অনুদান তৈরি করুন",
        backToList: "অনুদান তালিকায় ফিরুন",
      }
    : {
        badge: "Fund Operations",
        title: "Add Donation",
        subtitle:
          "Quickly record contributions for either the general fund or a specific weekly project.",
        fundTypeGeneral: "General Fund Donation",
        fundTypeProject: "Specific Weekly Project",
        fundTypeTubewell: "Specific Tubewell Project",
        projectPlaceholder:
          "Select weekly project (only for project donations)",
        tubewellPlaceholder: "Select tubewell project (for tagged donations)",
        donationSetup: "Donation Setup",
        donorDetails: "Donor & Transaction Details",
        amount: "Amount",
        donorName: "Donor name",
        phone: "Phone",
        trxId: "TRX ID",
        comments: "Comments",
        submit: "Create Donation",
        backToList: "Back to Donations",
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

  const tubewellProjects = await prisma.tubewellProject.findMany({
    where: { deletedAt: null },
    orderBy: { completionDate: "desc" },
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
    const tubewellProjectId = String(
      formData.get("tubewellProjectId") || "",
    ).trim();

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
          | "EPS"
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

    let enrichedComments = String(formData.get("comments") || "").trim();
    if (fundType === "TUBEWELL_PROJECT") {
      if (!tubewellProjectId) {
        throw new Error("Please select a tubewell project for this donation");
      }

      const tubewellProject = await prisma.tubewellProject.findFirst({
        where: {
          id: tubewellProjectId,
          deletedAt: null,
        },
        select: { slug: true },
      });

      if (!tubewellProject) {
        throw new Error("Selected tubewell project was not found");
      }

      const projectTag = `Campaign:TUBEWELL:${tubewellProject.slug}`;
      enrichedComments = enrichedComments
        ? `${enrichedComments} | ${projectTag}`
        : projectTag;
    }

    await createDonation({
      medium: String(formData.get("medium") || "OTHER") as
        | "BKASH"
        | "NAGAD"
        | "ROCKET"
        | "EPS"
        | "BANK"
        | "OTHER",
      amount: Number(formData.get("amount") || 0),
      trxid: String(formData.get("trxid") || "") || undefined,
      comments: enrichedComments || undefined,
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
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/donations"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.badge}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {copy.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {copy.subtitle}
            </p>
          </div>
        </div>

        <Button
          type="submit"
          form="donation-create-form"
          className="rounded-full bg-[#0b6979] px-5 text-white hover:bg-[#095968]"
        >
          <Save className="h-4 w-4" />
          {copy.submit}
        </Button>
      </header>

      <form
        id="donation-create-form"
        action={createAction}
        className="grid gap-6 lg:grid-cols-[1fr_300px]"
      >
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 dark:border-white/10 dark:bg-[#121d29]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.donationSetup}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <select
                name="fundType"
                defaultValue="GENERAL"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              >
                <option value="GENERAL">{copy.fundTypeGeneral}</option>
                <option value="WEEKLY_PROJECT">{copy.fundTypeProject}</option>
                <option value="TUBEWELL_PROJECT">
                  {copy.fundTypeTubewell}
                </option>
              </select>
              <select
                name="projectId"
                defaultValue=""
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
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
                name="tubewellProjectId"
                defaultValue=""
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              >
                <option value="">{copy.tubewellPlaceholder}</option>
                {tubewellProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {isBn
                      ? project.titleBn || project.titleEn
                      : project.titleEn || project.titleBn}
                  </option>
                ))}
              </select>
              <select
                name="medium"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              >
                <option value="BKASH">BKASH</option>
                <option value="NAGAD">NAGAD</option>
                <option value="ROCKET">ROCKET</option>
                <option value="EPS">EPS</option>
                <option value="BANK">BANK</option>
                <option value="OTHER">OTHER</option>
              </select>
              <select
                name="type"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
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
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
                required
              />
              <input
                name="date"
                type="date"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.donorDetails}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="donorName"
                placeholder={copy.donorName}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="phone"
                placeholder={copy.phone}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <input
                name="trxid"
                placeholder={copy.trxId}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
              <textarea
                name="comments"
                rows={4}
                placeholder={copy.comments}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 md:col-span-2 dark:border-white/15 dark:bg-[#0f1620] dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#121923]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {copy.fundTypeProject}
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {copy.projectPlaceholder}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-linear-to-br from-[#00535b] to-[#006d77] py-6 text-white shadow-lg shadow-[#00535b]/20 transition-transform hover:scale-[0.99]"
          >
            <Save className="h-4 w-4" />
            {copy.submit}
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-2 border-[#bec8ca] py-6 text-slate-700 hover:bg-slate-50 dark:text-slate-200"
          >
            <Link href="/admin/donations">{copy.backToList}</Link>
          </Button>
        </aside>
      </form>
    </div>
  );
}
