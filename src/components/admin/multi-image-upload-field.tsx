"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

type MultiImageUploadFieldProps = {
  name: string;
  label: string;
  hint?: string;
  maxFiles?: number;
  required?: boolean;
  className?: string;
  dropzoneClassName?: string;
  previewGridClassName?: string;
};

function mergeFiles(existing: File[], incoming: File[]): File[] {
  const all = [...existing];
  for (const file of incoming) {
    const exists = all.some(
      (item) =>
        item.name === file.name &&
        item.size === file.size &&
        item.lastModified === file.lastModified,
    );
    if (!exists) all.push(file);
  }
  return all;
}

function syncInputFiles(input: HTMLInputElement | null, files: File[]) {
  if (!input) return;

  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
  input.files = dataTransfer.files;
}

export function MultiImageUploadField({
  name,
  label,
  hint,
  maxFiles = 12,
  required,
  className,
  dropzoneClassName,
  previewGridClassName,
}: MultiImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const setFilesWithPreviews = (nextFiles: File[]) => {
    setFiles(nextFiles);
    setPreviewUrls((previousUrls) => {
      for (const url of previousUrls) URL.revokeObjectURL(url);
      return nextFiles.map((file) => URL.createObjectURL(file));
    });
  };

  useEffect(() => {
    return () => {
      for (const url of previewUrls) URL.revokeObjectURL(url);
    };
  }, [previewUrls]);

  const addFiles = (incoming: File[]) => {
    const merged = mergeFiles(files, incoming).slice(0, maxFiles);
    setFilesWithPreviews(merged);
    syncInputFiles(inputRef.current, merged);
  };

  const removeFile = (index: number) => {
    const next = files.filter((_, fileIndex) => fileIndex !== index);
    setFilesWithPreviews(next);
    syncInputFiles(inputRef.current, next);
  };

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <label
        htmlFor={inputId}
        className={
          dropzoneClassName ||
          "group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-[#00535b] hover:bg-slate-100 dark:border-white/20 dark:bg-[#0f1620]"
        }
      >
        <ImagePlus className="mb-2 h-7 w-7 text-[#00535b]" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Select one or multiple images
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          PNG, JPG, WEBP up to {maxFiles} files
        </p>

        <input
          id={inputId}
          ref={inputRef}
          name={name}
          type="file"
          accept="image/*"
          multiple
          required={required}
          className="sr-only"
          onChange={(event) => {
            const incoming = Array.from(event.target.files || []);
            if (incoming.length) addFiles(incoming);
          }}
        />
      </label>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        {files.length} image{files.length === 1 ? "" : "s"} selected
        {hint ? ` • ${hint}` : ""}
      </p>

      {previewUrls.length > 0 && (
        <div
          className={
            previewGridClassName ||
            "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          }
        >
          {previewUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0f1620]"
            >
              <Image
                src={url}
                alt={files[index]?.name || `Selected image ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="h-full w-full object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
