import Link from "next/link";
import { getRequestLanguage } from "@/lib/language";
import { prisma } from "@/lib/prisma";
import { ArrowRight, Droplets, HandHeart, Users } from "lucide-react";

export default async function SponsorPage() {
  const language = await getRequestLanguage();

  const [weeklyProjects, tubewellProjects] = await Promise.all([
    prisma.weeklyProject.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        titleBn: true,
        titleEn: true,
        targetAmount: true,
        currentAmount: true,
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.tubewellProject.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        slug: true,
        titleBn: true,
        titleEn: true,
        location: true,
        year: true,
      },
      orderBy: { completionDate: "desc" },
      take: 4,
    }),
  ]);

  const copy = {
    en: {
      title: "Sponsor a Beneficiary or Tubewell",
      subtitle:
        "Choose where your support goes and receive meaningful milestone updates.",
      pillars: {
        family: {
          title: "Sponsor a Family",
          body: "Contribute to urgent family needs such as food, medicine, and school support.",
        },
        campaign: {
          title: "Sponsor a Campaign",
          body: "Boost a specific weekly campaign and help it reach the finish line faster.",
        },
        water: {
          title: "Sponsor Clean Water",
          body: "Fund tubewell initiatives to improve safe water access in underserved areas.",
        },
      },
      activeCampaigns: "Active sponsorship campaigns",
      tubewells: "Tubewell sponsorship options",
      raised: "Raised",
      goal: "Goal",
      seeDetails: "See details",
      makeSponsor: "Start sponsorship",
      contactNote: "Need help choosing a sponsorship path?",
      contactCta: "Talk to our team",
    },
    bn: {
      title: "একটি পরিবার বা টিউবওয়েল স্পন্সর করুন",
      subtitle:
        "আপনার অনুদান কোথায় যাবে তা নির্বাচন করুন এবং ধাপে ধাপে বাস্তব আপডেট পান।",
      pillars: {
        family: {
          title: "একটি পরিবার স্পন্সর করুন",
          body: "খাদ্য, ওষুধ এবং শিশুদের শিক্ষাসহ জরুরি সহায়তায় অংশ নিন।",
        },
        campaign: {
          title: "ক্যাম্পেইন স্পন্সর করুন",
          body: "নির্দিষ্ট সাপ্তাহিক ক্যাম্পেইনকে দ্রুত লক্ষ্যপূরণে সহায়তা করুন।",
        },
        water: {
          title: "নিরাপদ পানি স্পন্সর করুন",
          body: "সুবিধাবঞ্চিত এলাকায় টিউবওয়েল উদ্যোগে অর্থায়ন করুন।",
        },
      },
      activeCampaigns: "চলমান স্পন্সরশিপ ক্যাম্পেইন",
      tubewells: "টিউবওয়েল স্পন্সরশিপ অপশন",
      raised: "সংগৃহীত",
      goal: "লক্ষ্য",
      seeDetails: "বিস্তারিত দেখুন",
      makeSponsor: "স্পন্সরশিপ শুরু করুন",
      contactNote: "স্পন্সরশিপ নির্বাচন করতে সহায়তা প্রয়োজন?",
      contactCta: "টিমের সাথে কথা বলুন",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 bg-linear-to-b from-primary/10 via-background to-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {content.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">
              {content.pillars.family.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.pillars.family.body}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HandHeart className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">
              {content.pillars.campaign.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.pillars.campaign.body}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Droplets className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">
              {content.pillars.water.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.pillars.water.body}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {content.activeCampaigns}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {weeklyProjects.map((project) => {
              const title =
                language === "en"
                  ? project.titleEn || project.titleBn
                  : project.titleBn;
              const progress =
                project.targetAmount > 0
                  ? Math.min(
                      100,
                      Math.round(
                        (project.currentAmount / project.targetAmount) * 100,
                      ),
                    )
                  : 0;

              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border bg-background p-5 shadow-sm"
                >
                  <h3 className="text-base font-semibold">{title}</h3>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <p>
                      {content.raised}: {project.currentAmount.toLocaleString()}{" "}
                      BDT
                    </p>
                    <p>
                      {content.goal}: {project.targetAmount.toLocaleString()}{" "}
                      BDT
                    </p>
                  </div>
                  <Link
                    href={`/weekly-projects/${project.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    {content.seeDetails}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">
            {content.tubewells}
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {tubewellProjects.map((project) => {
              const title =
                language === "en"
                  ? project.titleEn || project.titleBn
                  : project.titleBn;

              return (
                <Link
                  key={project.id}
                  href={`/tubewell-projects/${project.slug}`}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:bg-muted/20"
                >
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.location} • {project.year}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {content.seeDetails}
                    <ArrowRight className="h-4 w-4" />
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-primary/10 p-8 shadow-sm md:p-10">
            <h2 className="text-2xl font-bold tracking-tight">
              {content.makeSponsor}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.contactNote}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/donation"
                className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {content.makeSponsor}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {content.contactCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
