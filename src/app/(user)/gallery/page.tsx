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
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <header className="max-w-4xl">
          <p className="mb-3 inline-flex rounded-full border border-[#bed4de] bg-[#e7f6ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00535b] dark:border-white/15 dark:bg-[#14202c] dark:text-[#9becf7]">
            {content.galleryLabel}
          </p>
          <h1 className="text-3xl leading-[0.98] tracking-tight text-[#00535b] sm:text-4xl lg:text-5xl dark:text-[#9becf7]">
            {content.title}
            <span className="mt-2 block font-light italic text-[#8c4e35] dark:text-[#ffb59a]">
              {content.titleAccent}
            </span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#3e494a] sm:text-base dark:text-slate-300">
            {content.subtitle}
          </p>
        </header>

        {items.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-[#bec8ca] bg-[#e7f6ff] p-8 text-sm text-[#3e494a] dark:border-white/15 dark:bg-[#15202d] dark:text-slate-300">
            {content.empty}
          </div>
        )}

        {items.length > 0 && (
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

        <section className="mt-20 overflow-hidden rounded-3xl border border-[#bed4de] bg-linear-to-br from-[#006d77] to-[#00535b] px-5 py-10 text-white shadow-[0_24px_50px_-30px_rgba(0,83,91,0.8)] sm:px-8 lg:px-12 lg:py-14">
          <h2 className="text-2xl tracking-tight sm:text-3xl lg:text-4xl">
            {content.ctaTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-xs text-[#c8f0f7] sm:text-sm">
            {content.ctaText}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/donation"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#00535b] transition-colors hover:bg-[#e7f6ff] sm:text-sm"
            >
              {content.donate}
            </Link>
            <Link
              href="/join-us"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-white/10 sm:text-sm"
            >
              {content.volunteer}
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
