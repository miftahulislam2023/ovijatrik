import { getGalleryItems } from "@/actions/gallery";
import { GalleryLightbox } from "@/components/site/gallery-lightbox";
import { getRequestLanguage } from "@/lib/language";
import Link from "next/link";

export default async function GalleryPage() {
  const language = await getRequestLanguage();
  const items = await getGalleryItems();

  const copy = {
    en: {
      title: "Visual Stories",
      titleAccent: "of Impact",
      subtitle:
        "A curated gaze into the communities we serve. Every frame documents progress, resilience, and shared humanity.",
      galleryLabel: "Editorial Archive",
      empty: "No images have been added yet.",
      fallbackTitle: "Gallery image",
      ctaTitle: "Be part of the next story.",
      ctaText:
        "Your support helps us build projects and document measurable change across communities.",
      donate: "Make a Donation",
      volunteer: "Become a Volunteer",
    },
    bn: {
      title: "চিত্রে",
      titleAccent: "প্রভাবের গল্প",
      subtitle:
        "আমাদের কাজের মাঠ থেকে বাছাইকৃত মুহূর্ত। প্রতিটি ছবিতে আছে পরিবর্তন, সহমর্মিতা এবং অগ্রগতির দলিল।",
      galleryLabel: "দলিলভিত্তিক ভিজ্যুয়াল আর্কাইভ",
      empty: "এখনও কোনো ছবি যুক্ত করা হয়নি।",
      fallbackTitle: "Gallery image",
      ctaTitle: "পরবর্তী গল্পের অংশ হোন।",
      ctaText:
        "আপনার সহায়তা প্রকল্প বাস্তবায়ন ও পরিবর্তনের গল্প নথিভুক্ত করতে সরাসরি অবদান রাখে।",
      donate: "ডোনেট করুন",
      volunteer: "স্বেচ্ছাসেবক হোন",
    },
  } as const;

  const content = copy[language];
  const fontClass = language === "bn" ? "font-['Hind_Siliguri']" : "font-serif";

  return (
    <main
      className={`min-h-screen bg-linear-to-b from-[#f4faff] via-[#edf7ff] to-[#f7fbff] text-[#0e1d25] dark:from-[#0c151e] dark:via-[#0e1a26] dark:to-[#101722] dark:text-slate-100 ${fontClass}`}
    >
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        
        {/* Header Section */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center rounded-full border border-[#bed4de] bg-[#e7f6ff]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#00535b] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#14202c]/80 dark:text-[#9becf7]">
            {content.galleryLabel}
          </p>
          <h1 className="text-4xl font-medium leading-tight tracking-tight text-[#00535b] sm:text-5xl lg:text-6xl dark:text-[#9becf7]">
            {content.title}
            <span className="mt-2 block font-light italic text-[#8c4e35] dark:text-[#ffb59a]">
              {content.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#3e494a] sm:text-lg dark:text-slate-300">
            {content.subtitle}
          </p>
        </header>

        {/* Gallery / Empty State Section */}
        <div className="mt-16 sm:mt-20">
          {items.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-dashed border-[#bec8ca] bg-[#e7f6ff]/50 px-8 py-16 text-center dark:border-white/10 dark:bg-[#15202d]/50">
              <svg
                className="mb-4 h-12 w-12 text-[#00535b]/40 dark:text-[#9becf7]/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <p className="text-base font-medium text-[#3e494a] dark:text-slate-300">
                {content.empty}
              </p>
            </div>
          ) : (
            <GalleryLightbox
              items={items.map((item) => ({
                id: item.id,
                imageUrl: item.imageUrl,
                title:
                  language === "en"
                    ? item.titleEn || item.titleBn || content.fallbackTitle
                    : item.titleBn || item.titleEn || content.fallbackTitle,
                details: item.details || undefined,
              }))}
            />
          )}
        </div>

        {/* Call to Action Section */}
        <section className="relative mx-auto mt-24 flex max-w-4xl flex-col items-center overflow-hidden rounded-[2.5rem] border border-[#bed4de]/50 bg-linear-to-br from-[#006d77] to-[#00535b] px-6 py-16 text-center text-white shadow-2xl dark:border-white/10 sm:px-12 lg:px-20 lg:py-20">
          
          {/* Decorative Ambient Background Blurs */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#9becf7]/10 blur-3xl" />

          <h2 className="relative z-10 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
            {content.ctaTitle}
          </h2>
          <p className="relative z-10 mt-4 max-w-xl text-sm leading-relaxed text-[#c8f0f7] sm:text-base">
            {content.ctaText}
          </p>
          
          <div className="relative z-10 mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/donation"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#00535b] shadow-lg transition-all hover:scale-105 hover:bg-[#e7f6ff] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {content.donate}
            </Link>
            <Link
              href="/join-us"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-transparent px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {content.volunteer}
            </Link>
          </div>
        </section>

      </section>
    </main>
  );
}