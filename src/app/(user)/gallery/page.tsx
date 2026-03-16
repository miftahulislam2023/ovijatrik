import { getGalleryItems } from "@/actions/gallery";

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">গ্যালারি</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          আমাদের কার্যক্রমের কিছু মুহূর্ত।
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.titleBn || item.titleEn || "Gallery image"}
                className="h-48 w-full object-cover"
              />
              {(item.titleBn || item.titleEn) && (
                <figcaption className="px-3 py-2 text-xs text-muted-foreground">
                  {item.titleBn || item.titleEn}
                </figcaption>
              )}
            </figure>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">এখনও কোনো ছবি যুক্ত করা হয়নি।</p>
          )}
        </div>
      </section>
    </main>
  );
}
