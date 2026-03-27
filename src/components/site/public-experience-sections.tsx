"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/providers/language-provider";

type SectionItem = {
  title: {
    en: string;
    bn: string;
  };
  description: {
    en: string;
    bn: string;
  };
  image: string;
};

const sections: SectionItem[] = [
  {
    title: {
      en: "Community Impact Map",
      bn: "সম্প্রদায়ভিত্তিক প্রভাব মানচিত্র",
    },
    description: {
      en: "A living map of neighborhoods where support programs are creating measurable improvement in daily life.",
      bn: "যেসব এলাকায় আমাদের সহায়তা কার্যক্রম মানুষের দৈনন্দিন জীবনে বাস্তব পরিবর্তন আনছে, সেই অগ্রগতির একটি চলমান মানচিত্র।",
    },
    image: "/images/public-sections/impact-map.svg",
  },
  {
    title: {
      en: "Learning Corners",
      bn: "লার্নিং কর্নার",
    },
    description: {
      en: "Safe after-school spaces for children to learn, read, and receive mentorship from volunteers.",
      bn: "শিশুদের জন্য স্কুল-পরবর্তী নিরাপদ শেখার পরিবেশ, যেখানে তারা পড়তে পারে এবং স্বেচ্ছাসেবকদের কাছ থেকে মেন্টরশিপ পায়।",
    },
    image: "/images/public-sections/children-learning.svg",
  },
  {
    title: {
      en: "Clean Water Access",
      bn: "নিরাপদ পানির প্রাপ্যতা",
    },
    description: {
      en: "Tubewell and water support initiatives helping families secure safe water close to home.",
      bn: "টিউবওয়েল ও পানি সহায়তা উদ্যোগের মাধ্যমে পরিবারগুলোকে বাড়ির কাছেই নিরাপদ পানি নিশ্চিত করতে সহায়তা করা।",
    },
    image: "/images/public-sections/water-access.svg",
  },
  {
    title: {
      en: "Volunteer Circle",
      bn: "স্বেচ্ছাসেবক নেটওয়ার্ক",
    },
    description: {
      en: "A growing network of youth and professionals collaborating through local events and field programs.",
      bn: "স্থানীয় ইভেন্ট ও মাঠ পর্যায়ের কার্যক্রমে একসাথে কাজ করা তরুণ ও পেশাজীবীদের ক্রমবর্ধমান নেটওয়ার্ক।",
    },
    image: "/images/public-sections/volunteer-circle.svg",
  },
  {
    title: {
      en: "Future Vision",
      bn: "আগামীর লক্ষ্য",
    },
    description: {
      en: "Long-term plans focused on sustainability, dignity, and equitable access to opportunity for all.",
      bn: "সবার জন্য ন্যায্য সুযোগ, মর্যাদা এবং টেকসই উন্নয়নকে কেন্দ্র করে দীর্ঘমেয়াদি পরিকল্পনা।",
    },
    image: "/images/public-sections/future-vision.svg",
  },
];

export default function PublicExperienceSections() {
  const pathname = usePathname();
  const { language } = useLanguage();

  if (pathname === "/privacy-policy" || pathname === "/terms") {
    return null;
  }

  const copy = {
    en: {
      badge: "Public Highlights",
      title: "Stories, Progress, and Purpose",
      subtitle:
        "Explore how each initiative contributes to a stronger, healthier, and more connected community.",
    },
    bn: {
      badge: "জনসম্মুখের হাইলাইটস",
      title: "গল্প, অগ্রগতি ও লক্ষ্য",
      subtitle:
        "প্রতিটি উদ্যোগ কীভাবে আরও শক্তিশালী, সুস্থ ও সংযুক্ত কমিউনিটি গড়ে তুলছে তা দেখুন।",
    },
  } as const;

  const content = copy[language];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(150deg,#f0fdfa_0%,#f8fafc_38%,#fff7ed_100%)] py-16 dark:bg-[linear-gradient(150deg,#052e2b_0%,#0f172a_40%,#3f1d0d_100%)]">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_16%_14%,rgba(20,184,166,0.24),transparent_28%),radial-gradient(circle_at_84%_8%,rgba(249,115,22,0.24),transparent_26%),radial-gradient(circle_at_50%_82%,rgba(14,165,233,0.22),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 md:space-y-10">
        <header className="space-y-3 text-center">
          <p className="inline-flex rounded-full border border-teal-200/70 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 backdrop-blur-sm dark:border-teal-800/70 dark:bg-slate-950/50 dark:text-teal-200">
            {content.badge}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
            {content.title}
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-300">
            {content.subtitle}
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <article
              key={section.title.en}
              className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-[0_12px_34px_-18px_rgba(15,23,42,0.55)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_-18px_rgba(2,132,199,0.45)] dark:border-slate-700/70 dark:bg-slate-950/55 dark:ring-white/10"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={section.image}
                  alt={section.title[language]}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />
              </div>

              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {section.title[language]}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {section.description[language]}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
