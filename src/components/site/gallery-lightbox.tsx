"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

type GalleryLightboxItem = {
    id: string;
    imageUrl: string;
    title: string;
};

export function GalleryLightbox({ items }: { items: GalleryLightboxItem[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const active = useMemo(() => {
        if (activeIndex === null) return null;
        return items[activeIndex] ?? null;
    }, [activeIndex, items]);

    return (
        <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        className="overflow-hidden rounded-xl border border-border bg-card text-left"
                        onClick={() => setActiveIndex(index)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title} className="h-48 w-full object-cover" />
                        <figcaption className="px-3 py-2 text-xs text-muted-foreground">{item.title}</figcaption>
                    </button>
                ))}
            </div>

            {active && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="relative w-full max-w-5xl">
                        <button
                            type="button"
                            className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white"
                            onClick={() => setActiveIndex(null)}
                            aria-label="Close lightbox"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={active.imageUrl} alt={active.title} className="max-h-[85vh] w-full rounded-xl object-contain" />
                    </div>
                </div>
            )}
        </>
    );
}
