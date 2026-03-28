import { notFound } from "next/navigation";
import { getWeeklyProjectBySlug } from "@/actions/weekly-project";
import { getRequestLanguage } from "@/lib/language";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WeeklyProjectProgressBar } from "@/components/site/weekly-project-progress-bar";

function maskPhone(phone?: string | null) {
  if (!phone) return "";
  if (!phone.startsWith("+8801") && !phone.startsWith("01")) return phone;
  const last2 = phone.slice(-2);
  return `+8801xxxxxxx${last2}`;
}

export default async function WeeklyProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const project = await getWeeklyProjectBySlug(slug);

  if (!project || project.deletedAt) {
    notFound();
  }

  const copy = {
    en: {
      goal: "Goal",
      collected: "Collected",
      progress: "Progress",
      recentDonations: "Recent donations",
      noDonations: "No donations recorded yet.",
      anonymous: "Anonymous",
      currency: "BDT",
      locationLabel: "",
      weeklyImpactNarrative: "Weekly Impact Narrative",
      impactSnapshot: "Impact Snapshot",
      supportNow: "Support now",
      goalLabel: "Goal",
      collectedLabel: "Collected",
      progressLabel: "Progress",
      quote:
        "Before, our children's futures were tied to the walk. Now, they are tied to the school that sits next to the well.",
    },
    bn: {
      goal: "লক্ষ্য",
      collected: "সংগ্রহিত",
      progress: "অগ্রগতি",
      recentDonations: "সাম্প্রতিক অনুদান",
      noDonations: "এখনও কোনো অনুদান রেকর্ড করা হয়নি।",
      anonymous: "নাম প্রকাশে অনিচ্ছুক",
      currency: "টাকা",
      locationLabel: "",
      weeklyImpactNarrative: "সাপ্তাহিক প্রভাবের গল্প",
      impactSnapshot: "প্রভাবের সংক্ষিপ্তচিত্র",
      supportNow: "এখনই সহায়তা করুন",
      goalLabel: "লক্ষ্য",
      collectedLabel: "সংগ্রহিত",
      progressLabel: "অগ্রগতি",
      quote:
        "আগে আমাদের শিশুদের ভবিষ্যৎ ছিল দীর্ঘ পথচলার সঙ্গে বাঁধা। এখন সেটি পাশের স্কুলের সঙ্গে যুক্ত।",
    },
  } as const;

  const content = copy[language];
  const title =
    language === "en" ? project.titleEn || project.titleBn : project.titleBn;
  const description =
    language === "en"
      ? project.descriptionEn || project.descriptionBn
      : project.descriptionBn;

  const total = project.donations.reduce((sum, d) => sum + d.amount, 0);
  const progress = project.targetAmount
    ? Math.min(100, Math.round((total / project.targetAmount) * 100))
    : 0;

  const primaryPhoto = project.photos[0] || null;
  const secondaryPhoto = project.photos[1] || primaryPhoto;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative isolate overflow-hidden border-b border-border bg-primary/20">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto}
            alt={title}
            fill
            className="object-cover object-center opacity-70"
            sizes="100vw"
            priority
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-br from-black/55 via-black/35 to-primary/45" />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <p className="inline-flex rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-foreground">
            {content.weeklyImpactNarrative}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] text-white md:text-6xl">
            {title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-100/90">
            <span>
              {content.goal}: {project.targetAmount.toLocaleString()}{" "}
              {content.currency}
            </span>
            <span>
              {content.collected}: {total.toLocaleString()} {content.currency}
            </span>
            <span>
              {content.progress}: {progress}%
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
        <aside className="rounded-2xl border border-border bg-muted p-5 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {content.impactSnapshot}
          </p>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {content.goalLabel}
              </dt>
              <dd className="text-xl font-semibold text-primary">
                {project.targetAmount.toLocaleString()} {content.currency}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {content.collectedLabel}
              </dt>
              <dd className="text-xl font-semibold text-primary">
                {total.toLocaleString()} {content.currency}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {content.progressLabel}
              </dt>
              <dd className="pt-1">
                <WeeklyProjectProgressBar
                  progress={progress}
                  progressLabel={content.progressLabel}
                />
              </dd>
            </div>
          </dl>
        </aside>

        <article>
          <p className="text-base leading-8 text-foreground/85">
            {description}
          </p>

          {secondaryPhoto ? (
            <div className="mt-7 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <Image
                src={secondaryPhoto}
                alt={`${title} visual`}
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>
          ) : null}

          <blockquote className="mt-8 border-l-2 border-primary bg-muted px-5 py-4 text-2xl font-medium italic leading-relaxed text-primary">
            &quot;{content.quote}&quot;
          </blockquote>

          <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-semibold text-foreground">
                {content.recentDonations}
              </h2>
              <Link
                href={`/donation?campaign=WEEKLY&project=${encodeURIComponent(project.slug)}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary"
              >
                {content.supportNow}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-card p-4 text-sm">
              {project.donations.length === 0 && (
                <p className="text-slate-500">{content.noDonations}</p>
              )}

              {project.donations.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-col justify-between gap-2 border-b border-border pb-2 last:border-b-0 last:pb-0 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      {d.donorName || content.anonymous}{" "}
                      <span className="text-xs text-slate-500">
                        ({maskPhone(d.phone || undefined)})
                      </span>
                    </p>
                    {d.comments ? (
                      <p className="text-xs text-slate-500">{d.comments}</p>
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {d.amount.toLocaleString()} {content.currency}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}
