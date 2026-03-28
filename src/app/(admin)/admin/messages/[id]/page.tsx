import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { markMessageAsRead, softDeleteMessage } from "@/actions/contact";
import { redirect } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowLeft, MailCheck, Trash2 } from "lucide-react";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        noSubject: "কোনো বিষয় নেই",
        name: "নাম",
        email: "ইমেইল",
        phone: "ফোন",
        read: "পঠিত",
        yes: "হ্যাঁ",
        no: "না",
        markRead: "পঠিত হিসেবে চিহ্নিত করুন",
        archive: "বার্তা আর্কাইভ করুন",
      }
    : {
        noSubject: "No Subject",
        name: "Name",
        email: "Email",
        phone: "Phone",
        read: "Read",
        yes: "Yes",
        no: "No",
        markRead: "Mark as Read",
        archive: "Archive Message",
      };

  const { id } = await params;
  const message = await prisma.message.findFirst({
    where: { id, deletedAt: null },
  });

  if (!message) {
    notFound();
  }

  async function markReadAction() {
    "use server";
    await markMessageAsRead(id);
    redirect(`/admin/messages/${id}`);
  }

  async function deleteAction() {
    "use server";
    await softDeleteMessage(id);
    redirect("/admin/messages");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#121923]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {isBn ? "মেসেজ ডিটেইল" : "Message Detail"}
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {message.subject || copy.noSubject}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!message.readAt && (
            <form action={markReadAction}>
              <Button
                type="submit"
                variant="outline"
                className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <MailCheck className="h-4 w-4" />
                {copy.markRead}
              </Button>
            </form>
          )}
          <form action={deleteAction}>
            <Button
              type="submit"
              className="rounded-xl bg-rose-600 text-white hover:bg-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              {copy.archive}
            </Button>
          </form>
        </div>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-[#e9f0f6] p-5 text-sm dark:border-white/10 dark:bg-[#121d29]">
        <div className="grid gap-2 sm:grid-cols-2">
          <p className="text-slate-700 dark:text-slate-200">
            <span className="font-semibold">{copy.name}:</span> {message.name}
          </p>
          <p className="text-slate-700 dark:text-slate-200">
            <span className="font-semibold">{copy.email}:</span> {message.email}
          </p>
          <p className="text-slate-700 dark:text-slate-200">
            <span className="font-semibold">{copy.phone}:</span>{" "}
            {message.phone || "-"}
          </p>
          <p className="text-slate-700 dark:text-slate-200">
            <span className="font-semibold">{copy.read}:</span>{" "}
            {message.readAt ? copy.yes : copy.no}
          </p>
        </div>

        <p className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-200">
          {message.body}
        </p>
      </section>
    </div>
  );
}
