import Link from "next/link";
import Image from "next/image";
import { getTubewellProjects } from "@/actions/tubewell-project";
import { getRequestLanguage } from "@/lib/language";
import { stripHtmlToText } from "@/lib/rich-text";

export default async function TubewellProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; district?: string; year?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const district = (params.district || "").trim();
  const year = Number(params.year || "");

  const language = await getRequestLanguage();
  const projects = await getTubewellProjects();

  const copy = {
    en: {
      badge: "Historical Archive",
      title: "Clean Water, Lasting Impact",
      subtitle:
        "A documented record of completed tubewell installations and the communities they continue to serve.",
      location: "Location",
      district: "District",
      year: "Year",
      allDistricts: "All districts",
      allYears: "All years",
      archiveCode: "Archive",
      totalProjects: "Completed projects",
      latestCompletion: "Latest completion",
      activeDistricts: "Active districts",
      statsTitle: "Quantifying years of commitment.",
      statsDescription:
        "Every completed installation reflects long-term access to cleaner water and better health outcomes.",
      projectsCountLabel: "Projects documented",
      districtsCountLabel: "Districts reached",
      filterTitle: "Search archive",
      filterPlaceholder: "Search by title or location...",
      applyFilters: "Apply",
      clearFilters: "Clear",
      showingResults: "Showing projects",
      empty: "No tubewell projects have been added yet.",
    },
    bn: {
      badge: "ঐতিহাসিক আর্কাইভ",
      title: "নিরাপদ পানি, দীর্ঘস্থায়ী প্রভাব",
      subtitle:
        "সম্পন্ন হওয়া টিউবওয়েল স্থাপনাগুলোর নথিভুক্ত বিবরণ, যা এখনো কমিউনিটির সেবায় নিয়োজিত।",
      location: "অবস্থান",
      district: "জেলা",
      year: "বছর",
      allDistricts: "সব জেলা",
      allYears: "সব বছর",
      archiveCode: "আর্কাইভ",
      totalProjects: "সম্পন্ন প্রজেক্ট",
      latestCompletion: "সর্বশেষ সম্পন্ন",
      activeDistricts: "সক্রিয় জেলা",
      statsTitle: "বছরের পর বছর অঙ্গীকারের পরিমাপ।",
      statsDescription:
        "প্রতিটি সম্পন্ন স্থাপনা নিরাপদ পানির ধারাবাহিকতা ও সুস্থ জীবনের নিশ্চয়তার প্রতিফলন।",
      projectsCountLabel: "নথিভুক্ত প্রজেক্ট",
      districtsCountLabel: "সেবা পাওয়া জেলা",
      filterTitle: "আর্কাইভে অনুসন্ধান",
      filterPlaceholder: "শিরোনাম বা অবস্থান লিখুন...",
      applyFilters: "প্রয়োগ করুন",
      clearFilters: "রিসেট",
      showingResults: "দেখানো হচ্ছে",
      empty: "এখনও কোনো টিউবওয়েল প্রজেক্ট যুক্ত করা হয়নি।",
    },
  } as const;

  const content = copy[language];
  const normalizedQuery = q.toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      project.titleBn.toLowerCase().includes(normalizedQuery) ||
      (project.titleEn || "").toLowerCase().includes(normalizedQuery) ||
      project.location.toLowerCase().includes(normalizedQuery) ||
      stripHtmlToText(project.descriptionBn || "")
        .toLowerCase()
        .includes(normalizedQuery) ||
      stripHtmlToText(project.descriptionEn || "")
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesDistrict = district.length === 0 || project.location === district;
    const matchesYear = !Number.isFinite(year) || year <= 0 || project.year === year;

    return matchesQuery && matchesDistrict && matchesYear;
  });

  const latestProject = filteredProjects[0];
  const districts = Array.from(new Set(projects.map((project) => project.location)));
  const years = Array.from(new Set(projects.map((project) => project.year))).sort(
    (a, b) => b - a
  );

  const dateFormatter = new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/50 bg-linear-to-b from-primary/10 via-background to-background">
        <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-36 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.2fr_1fr] md:items-center md:pb-20 md:pt-20">
          <div>
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-foreground">
              {content.badge}
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.subtitle}
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {content.totalProjects}
                </p>
                <p className="mt-2 text-2xl font-bold">{filteredProjects.length}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {content.latestCompletion}
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {latestProject
                    ? dateFormatter.format(new Date(latestProject.completionDate))
                    : "-"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {content.activeDistricts}
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {new Set(filteredProjects.map((project) => project.location)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="relative md:justify-self-end">
            <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl">
              {latestProject?.photos?.[0] ? (
                <Image
                  src={latestProject.photos[0]}
                  alt={latestProject.titleEn || latestProject.titleBn}
                  width={900}
                  height={1100}
                  className="aspect-4/5 w-full object-cover"
                />
              ) : (
                <div className="aspect-4/5 w-full bg-linear-to-br from-primary/20 via-secondary to-accent/15" />
              )}
            </div>
            <div className="absolute -bottom-6 -left-3 max-w-60 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur sm:-left-6 sm:p-5">
              <p className="text-sm font-semibold text-primary">{content.archiveCode}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {latestProject
                  ? language === "en"
                    ? latestProject.titleEn || latestProject.titleBn
                    : latestProject.titleBn
                  : content.empty}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/40">
        <form
          className="mx-auto grid max-w-7xl gap-4 px-4 py-7 md:grid-cols-[1.4fr_1fr_1fr_auto]"
          method="get"
        >
          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.filterTitle}
            </span>
            <input
              name="q"
              defaultValue={q}
              placeholder={content.filterPlaceholder}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none ring-0 transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.district}
            </span>
            <select
              name="district"
              defaultValue={district}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition-colors focus:border-primary"
            >
              <option value="">{content.allDistricts}</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.year}
            </span>
            <select
              name="year"
              defaultValue={params.year || ""}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none ring-0 transition-colors focus:border-primary"
            >
              <option value="">{content.allYears}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end gap-3 md:justify-end">
            <button
              type="submit"
              className="h-11 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
            >
              {content.applyFilters}
            </button>
            <Link
              href="/tubewell-projects"
              className="inline-flex h-11 items-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-primary/40"
            >
              {content.clearFilters}
            </Link>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-7 text-sm font-medium text-muted-foreground">
          {content.showingResults}: {filteredProjects.length}
        </div>

        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center text-muted-foreground">
            {content.empty}
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/tubewell-projects/${project.slug}`}
                className="group block rounded-3xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {project.photos[0] ? (
                    <Image
                      src={project.photos[0]}
                      alt={project.titleEn || project.titleBn}
                      width={900}
                      height={500}
                      className="aspect-16/10 w-full object-cover grayscale-[0.15] transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="aspect-16/10 w-full bg-linear-to-br from-primary/20 via-secondary to-accent/15" />
                  )}
                  <span className="absolute left-3 top-3 rounded-lg bg-foreground/90 px-3 py-1 text-xs font-semibold text-background">
                    #{project.year}-{project.id.slice(-4).toUpperCase()}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary">
                      {language === "en"
                        ? project.titleEn || project.titleBn
                        : project.titleBn}
                    </h2>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-primary">
                      {dateFormatter.format(new Date(project.completionDate))}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground">
                    {content.location}: {project.location}
                  </p>

                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {stripHtmlToText(
                      language === "en"
                        ? project.descriptionEn || project.descriptionBn
                        : project.descriptionBn,
                    )}
                  </p>

                  <div className="h-1.5 w-14 rounded-full bg-primary/20 transition-all duration-300 group-hover:w-full group-hover:bg-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 md:pb-20">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-lg md:col-span-2">
            <h3 className="text-2xl font-bold leading-tight md:text-3xl">
              {content.statsTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85 md:text-base">
              {content.statsDescription}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-5">
              <div>
                <p className="text-3xl font-black md:text-4xl">{filteredProjects.length}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-primary-foreground/80">
                  {content.projectsCountLabel}
                </p>
              </div>
              <div>
                <p className="text-3xl font-black md:text-4xl">
                  {new Set(filteredProjects.map((project) => project.location)).size}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-primary-foreground/80">
                  {content.districtsCountLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.year}
            </p>
            <p className="mt-3 text-3xl font-black text-primary">
              {filteredProjects[0]?.year ?? "-"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{content.latestCompletion}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {content.archiveCode}
            </p>
            <p className="mt-3 text-3xl font-black text-primary">
              #{filteredProjects.length > 0 ? filteredProjects[0].id.slice(-4).toUpperCase() : "----"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{content.totalProjects}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
