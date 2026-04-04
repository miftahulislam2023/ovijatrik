import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { requireAdminAction } from "@/lib/authorization";
import { Button } from "@/components/ui/button";

export default async function AdminDonorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdminAction();

  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const params = await searchParams;
  const q = (params.q || "").trim();

  const donors = await prisma.user.findMany({
    where: {
      role: "user",
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      preferredDonationAmount: true,
      preferredDonationFrequency: true,
      createdAt: true,
    },
    take: 100,
  });

  const copy = isBn
    ? {
        title: "ডোনার ম্যানেজমেন্ট",
        subtitle: "অ্যাডমিন থেকে ডোনার তৈরি, আপডেট ও ডিলিট করুন।",
        add: "নতুন ডোনার",
        search: "নাম বা ইমেইল দিয়ে খুঁজুন",
        apply: "প্রয়োগ করুন",
        noData: "কোনো ডোনার পাওয়া যায়নি।",
        donor: "ডোনার",
        frequency: "ফ্রিকোয়েন্সি",
        amount: "পছন্দের পরিমাণ",
        joined: "যুক্ত হয়েছে",
        actions: "অ্যাকশন",
        edit: "এডিট",
      }
    : {
        title: "Donor Management",
        subtitle: "Create, update, and delete donor accounts from admin.",
        add: "New Donor",
        search: "Search by name or email",
        apply: "Apply",
        noData: "No donors found.",
        donor: "Donor",
        frequency: "Frequency",
        amount: "Preferred Amount",
        joined: "Joined",
        actions: "Actions",
        edit: "Edit",
      };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {copy.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {copy.subtitle}
            </p>
          </div>
          <Button
            asChild
            className="h-11 rounded-full bg-[#045e6f] text-white hover:bg-[#034c5a]"
          >
            <Link href="/admin/donors/new">{copy.add}</Link>
          </Button>
        </div>
      </div>

      <form
        method="get"
        className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <input
          name="q"
          defaultValue={q}
          placeholder={copy.search}
          className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm dark:border-white/10 dark:bg-[#0f1720]"
        />
        <Button
          type="submit"
          className="h-10 rounded-lg bg-[#045e6f] text-white hover:bg-[#034c5a]"
        >
          {copy.apply}
        </Button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#edf4f8] text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">{copy.donor}</th>
                <th className="px-4 py-3">{copy.frequency}</th>
                <th className="px-4 py-3">{copy.amount}</th>
                <th className="px-4 py-3">{copy.joined}</th>
                <th className="px-4 py-3">{copy.actions}</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor) => (
                <tr
                  key={donor.id}
                  className="border-t border-slate-100 dark:border-white/10"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {donor.name || "-"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      {donor.email || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {donor.preferredDonationFrequency || "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {donor.preferredDonationAmount
                      ? `BDT ${donor.preferredDonationAmount.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {donor.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/donors/${donor.id}`}>
                        {copy.edit}
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {donors.length === 0 && (
          <div className="border-t border-slate-100 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
            {copy.noData}
          </div>
        )}
      </div>
    </div>
  );
}
