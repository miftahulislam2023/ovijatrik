import Link from "next/link";
import { notFound } from "next/navigation";
import { getRequestLanguage } from "@/lib/language";
import { prisma } from "@/lib/prisma";
import DonationReceiptDownload from "@/components/site/donation-receipt-download";
import { ArrowLeft, CheckCircle2, ReceiptText } from "lucide-react";

type DonationReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DonationReceiptPage({
  params,
}: DonationReceiptPageProps) {
  const { id } = await params;
  const language = await getRequestLanguage();

  const donation = await prisma.donation.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      amount: true,
      trxid: true,
      donorName: true,
      medium: true,
      date: true,
      comments: true,
    },
  });

  const weeklyDonation = donation
    ? null
    : await prisma.weeklyDonation.findFirst({
        where: { id, deletedAt: null },
        select: {
          id: true,
          amount: true,
          trxid: true,
          donorName: true,
          medium: true,
          date: true,
          project: {
            select: {
              slug: true,
              titleBn: true,
              titleEn: true,
            },
          },
        },
      });

  if (!donation && !weeklyDonation) {
    notFound();
  }

  const tubewellSlug = donation?.comments?.match(
    /Campaign:TUBEWELL:([a-z0-9-]+)/i,
  )?.[1];
  const tubewellProject = tubewellSlug
    ? await prisma.tubewellProject.findFirst({
        where: { slug: tubewellSlug, deletedAt: null },
        select: { titleBn: true, titleEn: true },
      })
    : null;

  const copy = {
    en: {
      title: "Donation Confirmed",
      subtitle:
        "Your payment has been completed successfully. Thank you for supporting Ovijatrik.",
      receiptId: "Receipt ID",
      trxid: "Transaction ID",
      donor: "Donor",
      anonymous: "Anonymous",
      donationFor: "Donation For",
      amount: "Amount",
      date: "Date",
      medium: "Payment Method",
      weeklyProject: "Weekly Project",
      tubewellProject: "Tubewell Project",
      generalFund: "General Fund",
      downloadReceipt: "Download Payment Receipt",
      generatingReceipt: "Generating Receipt...",
      backToDonate: "Back to Donation Page",
      backHome: "Back to Home",
    },
    bn: {
      title: "অনুদান সফলভাবে সম্পন্ন হয়েছে",
      subtitle:
        "আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। ওভিজাত্রিককে সহায়তা করার জন্য ধন্যবাদ।",
      receiptId: "রিসিট আইডি",
      trxid: "ট্রানজ্যাকশন আইডি",
      donor: "দাতার নাম",
      anonymous: "নাম প্রকাশে অনিচ্ছুক",
      donationFor: "অনুদানের ধরণ",
      amount: "পরিমাণ",
      date: "তারিখ",
      medium: "পেমেন্ট মাধ্যম",
      weeklyProject: "সাপ্তাহিক প্রকল্প",
      tubewellProject: "টিউবওয়েল প্রকল্প",
      generalFund: "সাধারণ তহবিল",
      downloadReceipt: "পেমেন্ট রিসিট ডাউনলোড করুন",
      generatingReceipt: "রিসিট তৈরি হচ্ছে...",
      backToDonate: "অনুদান পাতায় ফিরে যান",
      backHome: "হোমে ফিরে যান",
    },
  } as const;

  const content = copy[language];

  const normalized = donation
    ? {
        id: donation.id,
        amount: donation.amount,
        trxid: donation.trxid,
        donorName: donation.donorName,
        medium: donation.medium,
        date: donation.date,
        donationFor: tubewellProject
          ? language === "en"
            ? `${content.tubewellProject}: ${tubewellProject.titleEn || tubewellProject.titleBn}`
            : `${content.tubewellProject}: ${tubewellProject.titleBn}`
          : content.generalFund,
      }
    : {
        id: weeklyDonation!.id,
        amount: weeklyDonation!.amount,
        trxid: weeklyDonation!.trxid,
        donorName: weeklyDonation!.donorName,
        medium: weeklyDonation!.medium,
        date: weeklyDonation!.date,
        donationFor:
          language === "en"
            ? `${content.weeklyProject}: ${weeklyDonation!.project.titleEn || weeklyDonation!.project.titleBn}`
            : `${content.weeklyProject}: ${weeklyDonation!.project.titleBn}`,
      };

  const dateFormatter = new Intl.DateTimeFormat(
    language === "bn" ? "bn-BD" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    },
  );

  const amountText = new Intl.NumberFormat(
    language === "bn" ? "bn-BD" : "en-US",
  ).format(normalized.amount);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.22),transparent_36%),radial-gradient(circle_at_95%_20%,rgba(16,185,129,0.2),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef9ff_48%,#f6fff9_100%)] dark:bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.2),transparent_36%),radial-gradient(circle_at_95%_20%,rgba(16,185,129,0.16),transparent_30%),linear-gradient(180deg,#06121b_0%,#0a1b2a_48%,#0b1e1a_100%)]">
      <section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="overflow-hidden rounded-3xl border border-cyan-200/60 bg-white/90 shadow-[0_24px_70px_-32px_rgba(8,47,73,0.65)] backdrop-blur dark:border-cyan-100/10 dark:bg-slate-900/70">
          <div className="border-b border-cyan-100/70 bg-linear-to-r from-cyan-50 to-emerald-50 px-6 py-7 dark:border-cyan-100/10 dark:from-cyan-950/35 dark:to-emerald-950/25 sm:px-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {content.title}
            </p>
            <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-extrabold tracking-tight text-slate-900 dark:text-cyan-50 sm:text-4xl">
              {content.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-700 dark:text-cyan-50/75 sm:text-base">
              {content.subtitle}
            </p>
          </div>

          <div className="px-6 py-7 sm:px-8">
            <div className="mb-6 flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
              <ReceiptText className="h-5 w-5" />
              <span className="text-sm font-semibold">
                {content.receiptId}: {normalized.id}
              </span>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300/80">
                  {content.trxid}
                </dt>
                <dd className="mt-1 break-all text-sm font-medium text-slate-900 dark:text-slate-100">
                  {normalized.trxid || "N/A"}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300/80">
                  {content.amount}
                </dt>
                <dd className="mt-1 text-base font-bold text-emerald-700 dark:text-emerald-300">
                  {amountText} {language === "bn" ? "টাকা" : "BDT"}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300/80">
                  {content.donor}
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {normalized.donorName || content.anonymous}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300/80">
                  {content.date}
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {dateFormatter.format(normalized.date)}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300/80">
                  {content.medium}
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {normalized.medium}
                </dd>
              </div>
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-800/45">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-300/80">
                  {content.donationFor}
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {normalized.donationFor}
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <DonationReceiptDownload
                receiptId={normalized.id}
                amount={normalized.amount}
                trxid={normalized.trxid}
                donorName={normalized.donorName || content.anonymous}
                donationFor={normalized.donationFor}
                medium={normalized.medium}
                dateIso={normalized.date.toISOString()}
                buttonLabel={content.downloadReceipt}
                generatingLabel={content.generatingReceipt}
                language={language}
              />
              <Link
                href="/donation"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/60 bg-cyan-50/80 px-4 py-2.5 text-sm font-semibold text-cyan-900 transition hover:bg-cyan-100 dark:border-cyan-300/30 dark:bg-cyan-900/25 dark:text-cyan-100 dark:hover:bg-cyan-900/35"
              >
                <ArrowLeft className="h-4 w-4" />
                {content.backToDonate}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-600/70 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {content.backHome}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
