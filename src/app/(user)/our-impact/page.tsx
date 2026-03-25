import { getRequestLanguage } from "@/lib/language";

export default async function OurImpactPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Our impact",
      subtitle:
        "A quick snapshot of the changes our work has helped create over the past few years.",
      stats: [
        { value: "1,000+", label: "Families supported directly" },
        { value: "200+", label: "Education support initiatives" },
        { value: "50+", label: "Tubewells installed" },
      ],
      footer:
        "These numbers are only the beginning. With your support, we can go much further.",
    },
    bn: {
      title: "আমাদের প্রভাব",
      subtitle:
        "গত কয়েক বছরে আমাদের কাজের মাধ্যমে যেসব পরিবর্তন এসেছে তার একটি সংক্ষিপ্ত চিত্র।",
      stats: [
        { value: "১,০০০+", label: "পরিবার সরাসরি সহায়তা পেয়েছে" },
        { value: "২০০+", label: "শিক্ষা সহায়তা প্রজেক্ট" },
        { value: "৫০+", label: "টিউবওয়েল স্থাপন" },
      ],
      footer:
        "এই সংখ্যাগুলো কেবল শুরু। আপনার সহযোগিতায় আমরা আরও অনেক দূর যেতে পারি।",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">
              {content.stats[0].value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.stats[0].label}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">
              {content.stats[1].value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.stats[1].label}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-2xl font-bold text-primary">
              {content.stats[2].value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {content.stats[2].label}
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">{content.footer}</p>
      </section>
    </main>
  );
}
