// src/app/(public)/page.tsx  → Home

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getRequestLanguage } from "@/lib/language";
import { ArrowRight, HandCoins, Mail, Users } from "lucide-react";

export default async function HomePage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      eyebrow: "A journey toward brighter smiles",
      titlePrefix: "A humanitarian journey for underserved communities —",
      titleHighlight: "Ovijatrik Foundation",
      description:
        "Since 2005, Ovijatrik Foundation has been working to improve lives through education, healthcare, and livelihood opportunities. Your small donation can create a big change.",
      donateNow: "Donate now",
      viewProjects: "View our projects",
      missionTitle: "Our mission",
      missionBody:
        "Ensuring everyone’s basic rights — quality education, good health, and opportunities for self-reliance. We focus especially on empowering women and children to build a sustainable and humane society.",
      quote:
        "Even a little compassion can change many lives. Let’s join this effort together.",
      quoteAuthor: "— Arif, Founder",
      pillars: [
        {
          title: "Education",
          body: "Support for quality education so children can dream and achieve.",
        },
        {
          title: "Health",
          body: "Primary care, awareness, and emergency support to build healthier communities.",
        },
        {
          title: "Livelihood",
          body: "Skills and livelihood opportunities to help families become self-reliant.",
        },
      ],
      help: {
        title: "How you can help",
        items: {
          donate: {
            title: "Donate",
            body: "Your contribution directly funds education, healthcare, and livelihood initiatives.",
            cta: "Donate now",
          },
          join: {
            title: "Join us",
            body: "Become part of a volunteer-driven community working for lasting change.",
            cta: "Join the team",
          },
          contact: {
            title: "Partner or reach out",
            body: "Collaborate, sponsor, or simply ask a question — we’d love to hear from you.",
            cta: "Contact us",
          },
        },
      },
      explore: {
        title: "Explore our work",
        items: {
          projects: {
            title: "All projects",
            body: "Browse current initiatives and how we support communities.",
            cta: "See projects",
          },
          weekly: {
            title: "Weekly projects",
            body: "Small, consistent actions that create steady impact.",
            cta: "View weekly",
          },
          tubewell: {
            title: "Tubewell projects",
            body: "Clean water access through local, practical solutions.",
            cta: "View tubewell",
          },
          stories: {
            title: "Stories & gallery",
            body: "See moments from the field and updates from the journey.",
            cta: "Explore",
          },
        },
      },
      cta: {
        title: "Ready to make a difference?",
        body: "Donate today or join as a volunteer — every step matters.",
        donate: "Donate",
        join: "Join us",
      },
    },
    bn: {
      eyebrow: "হাসি মুখের খুঁজে অভিযাত্রা",
      titlePrefix: "সুবিধাবঞ্চিত মানুষের জন্য একটি মানবিক যাত্রা —",
      titleHighlight: "অভিযাত্রিক ফাউন্ডেশন",
      description:
        "২০০৫ সাল থেকে অভিযাত্রিক ফাউন্ডেশন শিক্ষা, স্বাস্থ্যসেবা এবং জীবিকা অর্জনের সুযোগ সৃষ্টির মাধ্যমে সুবিধাবঞ্চিত মানুষের জীবনমান উন্নয়নে কাজ করে যাচ্ছে। আপনার ছোট একটি দানও এনে দিতে পারে বিশাল পরিবর্তন।",
      donateNow: "এখনই ডোনেট করুন",
      viewProjects: "আমাদের প্রজেক্টসমূহ দেখুন",
      missionTitle: "আমাদের মিশন",
      missionBody:
        "প্রতিটি মানুষের মৌলিক অধিকার — মানসম্মত শিক্ষা, সুস্বাস্থ্য এবং স্বনির্ভরতার সুযোগ নিশ্চিত করা। বিশেষভাবে নারী ও শিশুদের ক্ষমতায়নের মাধ্যমে একটি টেকসই ও মানবিক সমাজ গড়ে তোলা।",
      quote:
        "সামান্য সহানুভূতিও বহু মানুষের জীবন পাল্টে দিতে পারে। আসুন আমরা সবাই মিলে এই মহান উদ্যোগে শামিল হই।",
      quoteAuthor: "— আরিফ, প্রতিষ্ঠাতা",
      pillars: [
        {
          title: "শিক্ষা",
          body: "সুবিধাবঞ্চিত শিশুদের জন্য মানসম্মত শিক্ষা ও সহায়তা, যাতে তারা স্বপ্ন দেখতে এবং তা পূরণ করতে পারে।",
        },
        {
          title: "স্বাস্থ্য",
          body: "প্রাথমিক স্বাস্থ্যসেবা, সচেতনতা এবং জরুরি সহায়তার মাধ্যমে সুস্থ সমাজ গড়ে তোলার প্রচেষ্টা।",
        },
        {
          title: "জীবিকা",
          body: "দক্ষতা উন্নয়ন ও জীবিকা অর্জনের সুযোগ সৃষ্টি করে পরিবারকে স্বনির্ভর করে তোলার উদ্যোগ।",
        },
      ],
      help: {
        title: "আপনি কীভাবে সহযোগিতা করতে পারেন",
        items: {
          donate: {
            title: "ডোনেট করুন",
            body: "আপনার অনুদান শিক্ষা, স্বাস্থ্যসেবা ও জীবিকা উন্নয়ন কার্যক্রমে সরাসরি সহায়তা করে।",
            cta: "এখনই ডোনেট করুন",
          },
          join: {
            title: "আমাদের সাথে যোগ দিন",
            body: "স্বেচ্ছাসেবী কমিউনিটির অংশ হয়ে টেকসই পরিবর্তনে ভূমিকা রাখুন।",
            cta: "যোগ দিন",
          },
          contact: {
            title: "সহযোগিতা / যোগাযোগ",
            body: "পার্টনারশিপ, স্পনসরশিপ বা কোনো প্রশ্ন — আমাদের জানাতে পারেন।",
            cta: "যোগাযোগ করুন",
          },
        },
      },
      explore: {
        title: "আমাদের কাজ দেখুন",
        items: {
          projects: {
            title: "সব প্রজেক্ট",
            body: "চলমান উদ্যোগসমূহ এবং আমাদের সহায়তার ধরন দেখুন।",
            cta: "প্রজেক্ট দেখুন",
          },
          weekly: {
            title: "সাপ্তাহিক প্রজেক্ট",
            body: "ছোট কিন্তু ধারাবাহিক উদ্যোগে তৈরি হয় বড় প্রভাব।",
            cta: "সাপ্তাহিক দেখুন",
          },
          tubewell: {
            title: "টিউবওয়েল প্রজেক্ট",
            body: "স্থানীয় ও বাস্তবসম্মত সমাধানে নিরাপদ পানির ব্যবস্থা।",
            cta: "টিউবওয়েল দেখুন",
          },
          stories: {
            title: "গল্প ও গ্যালারি",
            body: "মাঠের কাজের মুহূর্ত এবং অভিযাত্রার আপডেট দেখুন।",
            cta: "দেখুন",
          },
        },
      },
      cta: {
        title: "পরিবর্তনের অংশ হতে প্রস্তুত?",
        body: "আজই ডোনেট করুন অথবা স্বেচ্ছাসেবী হিসেবে যুক্ত হন — প্রতিটি পদক্ষেপ গুরুত্বপূর্ণ।",
        donate: "ডোনেট",
        join: "যোগ দিন",
      },
    },
  } as const;

  const content = copy[language];

  const helpItems = [
    {
      href: "/donation",
      icon: HandCoins,
      title: content.help.items.donate.title,
      body: content.help.items.donate.body,
      cta: content.help.items.donate.cta,
    },
    {
      href: "/join-us",
      icon: Users,
      title: content.help.items.join.title,
      body: content.help.items.join.body,
      cta: content.help.items.join.cta,
    },
    {
      href: "/contact",
      icon: Mail,
      title: content.help.items.contact.title,
      body: content.help.items.contact.body,
      cta: content.help.items.contact.cta,
    },
  ];

  const exploreItems = [
    {
      href: "/projects",
      title: content.explore.items.projects.title,
      body: content.explore.items.projects.body,
      cta: content.explore.items.projects.cta,
    },
    {
      href: "/weekly-projects",
      title: content.explore.items.weekly.title,
      body: content.explore.items.weekly.body,
      cta: content.explore.items.weekly.cta,
    },
    {
      href: "/tubewell-projects",
      title: content.explore.items.tubewell.title,
      body: content.explore.items.tubewell.body,
      cta: content.explore.items.tubewell.cta,
    },
    {
      href: "/gallery",
      title: content.explore.items.stories.title,
      body: content.explore.items.stories.body,
      cta: content.explore.items.stories.cta,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 text-foreground">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 -top-40 h-[340px] w-[340px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute right-[-120px] top-30 h-[280px] w-[280px] rounded-full bg-secondary/60 blur-3xl" />
          </div>
          <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center md:py-20">
            <div className="flex-1 space-y-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {content.eyebrow}
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {content.titlePrefix}{" "}
                <span className="text-primary">{content.titleHighlight}</span>
              </h1>
              <p className="max-w-xl text-base text-muted-foreground">
                {content.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/donation"
                  className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  {content.donateNow}
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {content.viewProjects}
                </Link>
              </div>
            </div>

            <div className="mt-10 flex-1 md:mt-0">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold">
                  {content.missionTitle}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {content.missionBody}
                </p>
                <div className="mt-6 rounded-xl bg-background/60 p-4 text-sm text-muted-foreground">
                  “{content.quote}”
                  <br />
                  <span className="mt-2 inline-block font-semibold text-foreground">
                    {content.quoteAuthor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
            <div className="rounded-xl bg-background p-5 shadow-sm">
              <h3 className="text-base font-semibold">
                {content.pillars[0].title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.pillars[0].body}
              </p>
            </div>
            <div className="rounded-xl bg-background p-5 shadow-sm">
              <h3 className="text-base font-semibold">
                {content.pillars[1].title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.pillars[1].body}
              </p>
            </div>
            <div className="rounded-xl bg-background p-5 shadow-sm">
              <h3 className="text-base font-semibold">
                {content.pillars[2].title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {content.pillars[2].body}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-2xl font-bold tracking-tight">
                {content.help.title}
              </h2>
              <Link
                href="/donation"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                {content.donateNow} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {helpItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.href}
                    className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      {item.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <h2 className="text-2xl font-bold tracking-tight">
              {content.explore.title}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {exploreItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-border bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                    <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-primary">
                    {item.cta}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <div className="rounded-3xl border border-border bg-primary/10 p-8 shadow-sm md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {content.cta.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                    {content.cta.body}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/donation"
                    className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    {content.cta.donate}
                  </Link>
                  <Link
                    href="/join-us"
                    className="inline-flex items-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {content.cta.join}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
