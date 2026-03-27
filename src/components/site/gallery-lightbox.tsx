"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

type GalleryLightboxItem = {
  id: string;
  imageUrl: string;
  title: string;
  details?: string;
};

export function GalleryLightbox({ items }: { items: GalleryLightboxItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = useMemo(() => {
    if (activeIndex === null) return null;
    return items[activeIndex] ?? null;
  }, [activeIndex, items]);

  const cardPattern = [
    "md:col-span-6",
    "md:col-span-3",
    "md:col-span-3",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-6",
  ] as const;

  const imagePattern = [
    "aspect-[16/10]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-square",
    "aspect-square",
    "aspect-[5/4]",
    "aspect-[5/4]",
  ] as const;

  return (
    <>
      <div
        className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-12 md:gap-6"
      >
        {items.map((item, index) => {
          const cardClass = cardPattern[index % cardPattern.length];
          const imageClass = imagePattern[index % imagePattern.length];

          return (
            <article key={item.id} className={cardClass}>
              <button
                type="button"
                className="group block w-full text-left"
                onClick={() => setActiveIndex(index)}
              >
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#e7f6ff] shadow-[0_16px_30px_-24px_rgba(14,29,37,0.35)] transition-transform duration-500 group-hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#15202d]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={`w-full max-h-56 object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:max-h-64 md:max-h-72 ${imageClass}`}
                  />
                </div>

                <div className="mt-3 px-1">
                  <h3 className="text-lg text-[#00535b] sm:text-xl dark:text-[#9becf7]">
                    {item.title}
                  </h3>
                  {item.details && (
                    <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-slate-300">
                      {item.details}
                    </p>
                  )}
                </div>
              </button>
            </article>
          );
        })}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
              onClick={() => setActiveIndex(null)}
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.imageUrl}
                alt={active.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div
              className="mt-2 rounded-xl bg-black/40 px-4 py-2.5 text-white"
            >
              <p className="text-lg">{active.title}</p>
              {active.details && (
                <p className="mt-1 text-xs text-white/85 sm:text-sm">
                  {active.details}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
