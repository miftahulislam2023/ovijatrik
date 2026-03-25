import { getGalleryItems } from "@/actions/gallery";
import { GalleryLightbox } from "@/components/site/gallery-lightbox";
import { getRequestLanguage } from "@/lib/language";

export default async function GalleryPage() {
  const language = await getRequestLanguage();
  const items = await getGalleryItems();

  const copy = {
    en: {
      title: "Gallery",
      subtitle: "Some moments from our work.",
      empty: "No images have been added yet.",
      fallbackTitle: "Gallery image",
    },
    bn: {
      title: "গ্যালারি",
      subtitle: "আমাদের কার্যক্রমের কিছু মুহূর্ত।",
      empty: "এখনও কোনো ছবি যুক্ত করা হয়নি।",
      fallbackTitle: "Gallery image",
    },
  } as const;

  const content = copy[language];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        {items.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">{content.empty}</p>
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
            }))}
          />
        )}
      </section>
    </main>
  );
}
