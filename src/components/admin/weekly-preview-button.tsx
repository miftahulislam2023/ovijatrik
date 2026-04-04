"use client";

import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/slug";

type WeeklyPreviewButtonProps = {
  fallbackText: string;
};

export function WeeklyPreviewButton({
  fallbackText,
}: WeeklyPreviewButtonProps) {
  const router = useRouter();

  const openPreview = () => {
    const slugInput =
      document.querySelector<HTMLInputElement>("input[name='slug']")?.value ||
      "";
    const titleEn =
      document.querySelector<HTMLInputElement>("input[name='titleEn']")
        ?.value || "";
    const titleBn =
      document.querySelector<HTMLInputElement>("input[name='titleBn']")
        ?.value || "";

    const slug = slugify(slugInput || titleEn || titleBn || "preview");
    router.push(`/admin/weekly-projects/new/preview/${slug}`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full rounded-full border-2 border-[#bec8ca] py-6 text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
      onClick={openPreview}
    >
      <Eye className="h-4 w-4" />
      {fallbackText}
    </Button>
  );
}
