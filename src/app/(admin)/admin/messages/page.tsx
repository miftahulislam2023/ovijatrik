import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  bulkMarkMessagesAsRead,
  bulkSoftDeleteMessages,
  markMessageAsRead,
  softDeleteMessage,
} from "@/actions/contact";
import { getRequestLanguage } from "@/lib/language";
import { Eye, MailCheck, Search, Trash2 } from "lucide-react";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; read?: string; page?: string }>;
}) {
  const language = await getRequestLanguage();
  const isBn = language === "bn";
  const copy = isBn
    ? {
        title: "যোগাযোগ বার্তাসমূহ",
        search: "প্রেরক, বিষয়, বার্তা দিয়ে খুঁজুন",
        all: "সব",
        read: "পড়া",
        unread: "অপঠিত",
        apply: "প্রয়োগ করুন",
        noSubject: "কোনো বিষয় নেই",
        view: "দেখুন",
        markRead: "পঠিত করুন",
        archive: "আর্কাইভ",
        selectedActions: "নির্বাচিত বার্তার অ্যাকশন",
        markSelectedRead: "নির্বাচিত পঠিত করুন",
        archiveSelected: "নির্বাচিত আর্কাইভ",
        select: "নির্বাচন",
        noData: "কোনো বার্তা পাওয়া যায়নি।",
        page: "পৃষ্ঠা",
        of: "/",
        items: "আইটেম",
        previous: "পূর্ববর্তী",
        next: "পরবর্তী",
      }
    : {
        title: "Contact Messages",
        search: "Search sender, subject, message",
        all: "All",
        read: "Read",
        unread: "Unread",
        apply: "Apply",
        noSubject: "No Subject",
        view: "View",
        markRead: "Mark Read",
        archive: "Archive",
        selectedActions: "Actions for selected messages",
        markSelectedRead: "Mark Selected Read",
        archiveSelected: "Archive Selected",
        select: "Select",
        noData: "No messages found.",
        page: "Page",
        of: "of",
        items: "items",
        previous: "Previous",
        next: "Next",
      };

  const params = await searchParams;
  const q = (params.q || "").trim();
  const read = (params.read || "").trim();
  const page = Math.max(1, Number(params.page || "1") || 1);
  const pageSize = 12;

  const where = {
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { subject: { contains: q, mode: "insensitive" as const } },
            { body: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(read === "read" ? { readAt: { not: null as Date | null } } : {}),
    ...(read === "unread" ? { readAt: null } : {}),
  };

  const [messages, totalCount] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.message.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  const queryWithPage = (targetPage: number) => {
    const qp = new URLSearchParams();
    if (q) qp.set("q", q);
    if (read) qp.set("read", read);
    qp.set("page", String(targetPage));
    return `/admin/messages?${qp.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-[#111a23]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {isBn ? "অ্যাডমিন / ইনবক্স" : "Admin / Inbox"}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {isBn
                ? "যোগাযোগ বার্তা পর্যবেক্ষণ করুন এবং ফলো-আপের জন্য সেগুলো দ্রুত শ্রেণিবদ্ধ করুন।"
                : "Monitor incoming contact messages and classify them quickly for follow-up."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-[#055763] p-4 text-white">
            <p className="text-xs uppercase tracking-[0.16em] text-white/80">
              {isBn ? "মোট বার্তা" : "Total Messages"}
            </p>
            <p className="mt-1 text-3xl font-black sm:text-4xl">{totalCount}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-700/50 dark:bg-emerald-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              {copy.read}
            </p>
            <p className="mt-1 text-3xl font-black text-emerald-700 dark:text-emerald-300 sm:text-4xl">
              {messages.filter((item) => item.readAt).length}
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-900/25">
            <p className="text-xs uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              {copy.unread}
            </p>
            <p className="mt-1 text-3xl font-black text-amber-700 dark:text-amber-300 sm:text-4xl">
              {messages.filter((item) => !item.readAt).length}
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-slate-200 bg-[#dbe8f1] p-3 sm:grid-cols-2 md:grid-cols-[1fr_180px_auto] dark:border-white/10 dark:bg-[#13202a]"
        method="get"
      >
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder={copy.search}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
          />
        </label>
        <select
          name="read"
          defaultValue={read}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-[#0f1720] dark:text-slate-100"
        >
          <option value="">{copy.all}</option>
          <option value="read">{copy.read}</option>
          <option value="unread">{copy.unread}</option>
        </select>
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#045e6f] text-white hover:bg-[#034c5a] sm:w-auto"
        >
          {copy.apply}
        </Button>
      </form>

      <form
        id="messages-bulk-actions"
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-[#111a23]"
      >
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
          {copy.selectedActions}
        </span>
        <Button
          type="submit"
          formAction={bulkMarkMessagesAsRead}
          size="sm"
          className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/10"
        >
          {copy.markSelectedRead}
        </Button>
        <Button
          type="submit"
          formAction={bulkSoftDeleteMessages}
          size="sm"
          className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
        >
          {copy.archiveSelected}
        </Button>
      </form>

      <div className="grid gap-4">
        {messages.map((message) => (
          <article
            key={message.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#0b5e7a]/40 dark:border-white/10 dark:bg-[#111a23]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {message.subject || copy.noSubject}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {message.name} - {message.email}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {message.readAt ? `(${copy.read})` : `(${copy.unread})`}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-white/15 dark:text-slate-300">
                  <input
                    type="checkbox"
                    name="ids"
                    value={message.id}
                    form="messages-bulk-actions"
                    className="h-4 w-4"
                  />
                  {copy.select}
                </label>

                <div className="flex flex-wrap gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-[#0c5f72] text-[#0c5f72] hover:bg-[#0c5f72] hover:text-white dark:border-[#66bdd0] dark:text-[#8dd6e4]"
                  >
                    <Link href={`/admin/messages/${message.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      {copy.view}
                    </Link>
                  </Button>
                  {!message.readAt && (
                    <form
                      action={async () => {
                        "use server";
                        await markMessageAsRead(message.id);
                      }}
                    >
                      <Button
                        type="submit"
                        size="sm"
                        className="rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:bg-transparent dark:text-slate-200 dark:hover:bg-white/10"
                      >
                        <MailCheck className="h-3.5 w-3.5" />
                        {copy.markRead}
                      </Button>
                    </form>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await softDeleteMessage(message.id);
                    }}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {copy.archive}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </article>
        ))}

        {messages.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-[#111a23] dark:text-slate-300">
            {copy.noData}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 dark:text-slate-300">
          {copy.page} {page} {copy.of} {totalPages} ({totalCount} {copy.items})
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page <= 1}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(prevPage)}>{copy.previous}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            className="rounded-lg border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
          >
            <Link href={queryWithPage(nextPage)}>{copy.next}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
