"use client";

import { useState } from "react";
import { sendContactMessage } from "@/actions/contact";
import { useLanguage } from "@/components/providers/language-provider";

export default function ContactPage() {
  const { language } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const copy = {
    en: {
      title: "Contact us",
      subtitle: "Your feedback, questions, or suggestions matter to us.",
      name: "Name",
      email: "Email",
      phoneOptional: "Phone (optional)",
      subjectOptional: "Subject (optional)",
      message: "Message",
      submit: "Send message",
      success: "Your message has been sent successfully.",
      genericError: "Something went wrong. Please try again.",
    },
    bn: {
      title: "যোগাযোগ করুন",
      subtitle: "আপনার মতামত, প্রশ্ন বা প্রস্তাব আমাদের জন্য গুরুত্বপূর্ণ।",
      name: "নাম",
      email: "ইমেইল",
      phoneOptional: "ফোন (ঐচ্ছিক)",
      subjectOptional: "বিষয় (ঐচ্ছিক)",
      message: "বার্তা",
      submit: "বার্তা পাঠান",
      success: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
      genericError: "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।",
    },
  } as const;

  const content = copy[language];
  const fontClass = language === "bn" ? "font-['Hind_Siliguri']" : "font-sans";

  // Reusable styles for inputs
  const inputBaseClass =
    "w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20";
  const labelClass =
    "mb-1.5 block text-sm font-medium text-[#3e494a] dark:text-slate-300";

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      await sendContactMessage(formData);
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

          <div className="space-y-1">
            <label className={labelClass}>{content.name} *</label>
            <input name="name" required className={inputBaseClass} />
          </div>

          <div className="space-y-1">
            <label className={labelClass}>{content.email} *</label>
            <input
              type="email"
              name="email"
              required
              className={inputBaseClass}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={labelClass}>{content.phoneOptional}</label>
              <input name="phone" className={inputBaseClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>{content.subjectOptional}</label>
              <input name="subject" className={inputBaseClass} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>{content.message} *</label>
            <textarea
              name="body"
              required
              rows={5}
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
      </section>
    </main>
  );
}