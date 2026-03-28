"use client";

import { submitApplication } from "@/actions/applications";
import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";

export default function ApplyForDonationPage() {
  const { language } = useLanguage();

  const copy = {
    en: {
      title: "Apply for a donation",
      subtitle:
        "If you or someone you know needs help, please fill out the form below.",
    },
    bn: {
      title: "অনুদানের জন্য আবেদন করুন",
      subtitle:
        "আপনি বা আপনার পরিচিত কেউ যদি সহায়তার প্রয়োজন অনুভব করেন, তাহলে নিচের ফর্মটি পূরণ করুন।",
    },
  } as const;

  const content = copy[language];
  const fontClass = language === "bn" ? "font-['Hind_Siliguri']" : "font-sans";

  return (
    <main
      className={`min-h-screen bg-linear-to-b from-[#f4faff] via-[#edf7ff] to-[#f7fbff] pb-20 pt-12 dark:from-[#0c151e] dark:via-[#0e1a26] dark:to-[#101722] ${fontClass}`}
    >
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-medium tracking-tight text-[#00535b] sm:text-5xl dark:text-[#9becf7]">
            {content.title}
          </h1>
          <p className="mt-4 text-base text-[#3e494a] dark:text-slate-300">
            {content.subtitle}
          </p>
        </div>

        <ApplyForm />
      </section>
    </main>
  );
}

function ApplyForm() {
  const { language } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const copy = {
    en: {
      name: "Name",
      phone: "Phone",
      emailOptional: "Email (optional)",
      addressOptional: "Address (optional)",
      reason: "Reason for support",
      details: "Additional details",
      submit: "Submit application",
      success: "Your application has been submitted. We will contact you soon.",
      genericError: "Something went wrong. Please try again.",
    },
    bn: {
      name: "নাম",
      phone: "ফোন",
      emailOptional: "ইমেইল (ঐচ্ছিক)",
      addressOptional: "ঠিকানা (ঐচ্ছিক)",
      reason: "সহায়তার কারণ",
      details: "বিস্তারিত বিবরণ",
      submit: "আবেদন জমা দিন",
      success: "আপনার আবেদন সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করবো।",
      genericError: "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।",
    },
  } as const;

  const content = copy[language];

  // Reusable UI variables
  const inputBaseClass =
    "w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20";
  const labelClass =
    "mb-1.5 block text-sm font-medium text-[#3e494a] dark:text-slate-300";

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      await submitApplication(formData);
      setStatus("success");
      setMessage(content.success);
      const form = document.querySelector("form") as HTMLFormElement | null;
      form?.reset();
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "";
      setMessage(errorMessage || content.genericError);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="mt-12 space-y-6 rounded-3xl border border-[#bed4de]/50 bg-white/50 p-8 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-[#14202c]/50 sm:p-10"
    >
      {status === "success" && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-700 dark:text-emerald-300">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-700 dark:text-red-300">
          {message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass}>{content.name} *</label>
          <input name="name" required className={inputBaseClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>{content.phone} *</label>
          <input name="phone" required className={inputBaseClass} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass}>{content.emailOptional}</label>
          <input type="email" name="email" className={inputBaseClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>{content.addressOptional}</label>
          <input name="address" className={inputBaseClass} />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}>{content.reason} *</label>
        <input name="reason" required className={inputBaseClass} />
      </div>

      <div className="space-y-1">
        <label className={labelClass}>{content.details}</label>
        <textarea
          name="details"
          rows={4}
          className={`${inputBaseClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-[#00535b] px-6 py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[#006d77] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#00535b]/50 dark:bg-[#9becf7] dark:text-[#00535b] dark:hover:bg-[#c8f0f7]"
      >
        {content.submit}
      </button>
    </form>
  );
}