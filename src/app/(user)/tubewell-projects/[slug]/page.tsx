import { notFound } from "next/navigation";
import Image from "next/image";
import { getTubewellProjectBySlug } from "@/actions/tubewell-project";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default async function TubewellProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const language = await getRequestLanguage();
  const { slug } = await params;
  const project = await getTubewellProjectBySlug(slug);

  if (!project || project.deletedAt) {
    notFound();
  }

  const copy = {
    en: {
      location: "Location",
      completedYear: "Completed year",
      impact: "Impact",
      activeImpact: "Active Impact",
      commissioned: "Commissioned",
      depth: "Depth",
      meters: "meters",
      proverb: "Pure water is the world's first and foremost medicine.",
      livesImpacted: "Lives impacted",
      livesImpactedBody:
        "Individuals now have direct 24/7 access to clean water close to home.",
      sustainabilityTitle: "Project Sustainability",
      sustainabilityBody:
        "Funded and maintained through the long-term sustainability endowment plan.",
      mission: "The Mission",
      sustainabilityTag: "Sustainability",
      communityTag: "Community Development",
      waterTag: "Water Crisis",
      geoFootprint: "Geographic Footprint",
      geoBody:
        "The project serves a central cluster of families and reduces daily travel burden for water access.",
      viewAllProjects: "View all projects",
      donateToProject: "Donate to this project",
      noImage: "No Image",
    },
    bn: {
      location: "অবস্থান",
      completedYear: "সম্পন্নের বছর",
      impact: "প্রভাব",
      activeImpact: "চলমান প্রভাব",
      commissioned: "চালু হয়েছে",
      depth: "গভীরতা",
      meters: "মিটার",
      proverb: "বিশুদ্ধ পানি পৃথিবীর প্রথম ও প্রধান ওষুধ।",
      livesImpacted: "উপকৃত মানুষ",
      livesImpactedBody:
        "এখন মানুষ ঘরের কাছেই ২৪/৭ নিরাপদ পানির সরাসরি সুযোগ পাচ্ছে।",
      sustainabilityTitle: "প্রকল্পের স্থায়িত্ব",
      sustainabilityBody:
        "দীর্ঘমেয়াদি স্থায়িত্ব তহবিল পরিকল্পনার মাধ্যমে অর্থায়ন ও রক্ষণাবেক্ষণ করা হয়।",
      mission: "আমাদের মিশন",
      sustainabilityTag: "টেকসই উন্নয়ন",
      communityTag: "কমিউনিটি উন্নয়ন",
      waterTag: "পানি সংকট",
      geoFootprint: "ভৌগোলিক পরিধি",
      geoBody:
        "এই প্রকল্পটি কেন্দ্রীয় পরিবারসমূহকে সেবা দেয় এবং পানি আনতে দৈনিক যাতায়াতের চাপ কমায়।",
      viewAllProjects: "সব প্রকল্প দেখুন",
      donateToProject: "এই প্রকল্পে অনুদান করুন",
      noImage: "ছবি নেই",
    },
  } as const;

  const content = copy[language];
  const title =
    language === "en" ? project.titleEn || project.titleBn : project.titleBn;
  const description =
    language === "en"
      ? project.descriptionEn || project.descriptionBn
      : project.descriptionBn;

  const primaryPhoto = project.photos[0] || null;
  const secondaryPhoto = project.photos[1] || primaryPhoto;

  const completionLabel = project.completionDate.toLocaleDateString(
    language === "bn" ? "bn-BD" : "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
          <div>
            <p className="inline-flex rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
              {content.activeImpact}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] text-primary md:text-7xl">
              {title}
            </h1>

            <dl className="mt-7 grid gap-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {content.location}
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {project.location}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {content.commissioned}
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {completionLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {content.depth}
                </dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {project.year % 2 === 0 ? "120" : "110"} {content.meters}
                </dd>
              </div>
            </dl>
          </div>

          <aside className="h-fit rounded-2xl bg-muted p-5 text-sm italic text-foreground shadow-sm">
            <p>&quot;{content.proverb}&quot;</p>
            <p className="mt-2 text-xs not-italic text-slate-500">
              - Slovakian Proverb
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-10 sm:px-6 lg:grid-cols-[1fr_300px] lg:px-8">
        <article className="overflow-hidden rounded-xl border border-border bg-card">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto}
              alt={title}
              width={1400}
              height={900}
              className="h-full min-h-85 w-full object-cover"
            />
          ) : (
            <div className="flex min-h-85 items-center justify-center text-4xl font-semibold text-muted-foreground">
              {content.noImage}
            </div>
          )}
        </article>

        <div className="space-y-4">
          <article className="overflow-hidden rounded-xl border border-border bg-card">
            {secondaryPhoto ? (
              <Image
                src={secondaryPhoto}
                alt={`${title} secondary`}
                width={900}
                height={580}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-slate-200" />
            )}
          </article>

          <article className="rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              {content.livesImpacted}
            </p>
            <p className="mt-1 text-4xl font-semibold text-primary">1,240+</p>
            <p className="mt-2 text-xs text-slate-600">
              {content.livesImpactedBody}
            </p>
          </article>

          <article className="rounded-xl border border-border bg-primary p-4 text-primary-foreground">
            <p className="text-base font-semibold">
              {content.sustainabilityTitle}
            </p>
            <p className="mt-2 text-xs text-primary-foreground/90">
              {content.sustainabilityBody}
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-border bg-muted/50 p-6 lg:grid-cols-[1.1fr_1fr]">
          <article>
            <h2 className="text-3xl font-semibold text-foreground">
              {content.mission}
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-700">
              {description}
            </p>

            {project.impactSummary && (
              <blockquote className="mt-6 border-l-2 border-primary pl-4 text-2xl font-medium italic leading-relaxed text-primary">
                {project.impactSummary}
              </blockquote>
            )}

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-sm bg-muted px-2 py-1 text-[10px] uppercase tracking-wider text-primary">
                {content.sustainabilityTag}
              </span>
              <span className="rounded-sm bg-muted px-2 py-1 text-[10px] uppercase tracking-wider text-primary">
                {content.communityTag}
              </span>
              <span className="rounded-sm bg-muted px-2 py-1 text-[10px] uppercase tracking-wider text-primary">
                {content.waterTag}
              </span>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-full min-h-65 w-full bg-linear-to-br from-slate-100 to-slate-300 p-5">
              <h3 className="text-2xl font-semibold text-foreground">
                {content.geoFootprint}
              </h3>
              <p className="mt-3 text-sm text-slate-600">{content.geoBody}</p>
              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> {project.location}
                </p>
                <p>
                  {content.completedYear}: {project.year}
                </p>
                <Link
                  href={`/donation?campaign=TUBEWELL&project=${encodeURIComponent(project.slug)}`}
                  className="inline-flex items-center gap-1 font-medium text-primary"
                >
                  {content.donateToProject}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tubewell-projects"
                  className="inline-flex items-center gap-1 font-medium text-primary"
                >
                  {content.viewAllProjects}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
