"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";

type CoverImageInputProps = {
  label: string;
  hint: string;
  name: string;
  emptyPreviewLabel: string;
};

export function CoverImageInput({
  label,
  hint,
  name,
  emptyPreviewLabel,
}: CoverImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <label className="block rounded-xl border border-dashed border-slate-300 bg-[#dce8f2] p-6 text-slate-600 dark:border-white/20 dark:bg-[#1d2a38] dark:text-slate-300">
      <div className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center">
        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white/60 dark:border-white/15 dark:bg-black/20">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Cover preview"
              className="h-36 w-full object-cover"
            />
          ) : (
            <div className="flex h-36 w-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
              {emptyPreviewLabel}
            </div>
          )}
        </div>

        <div className="text-center md:text-left">
          <Upload className="mx-auto mb-3 h-8 w-8 md:mx-0" />
          <p className="font-medium">{label}</p>
          <p className="text-xs">{hint}</p>
          <input
            name={name}
            type="file"
            accept="image/*"
            className="mt-4 w-full text-xs"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];

              setPreviewUrl((current) => {
                if (current) {
                  URL.revokeObjectURL(current);
                }
                return file ? URL.createObjectURL(file) : null;
              });
            }}
          />
        </div>
      </div>
    </label>
  );
}
