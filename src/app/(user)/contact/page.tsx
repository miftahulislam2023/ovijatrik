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
      subjectOptional: "বিষয় (ঐচ্ছিক)",
      message: "বার্তা",
      submit: "বার্তা পাঠান",
      success: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
      genericError: "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।",
    },
  } as const;

  const content = copy[language];

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      await sendContactMessage(formData); // server action (ignored return)
      setStatus("success");
      setMessage(content.success);

      // Reset form
      const form = document.querySelector("form") as HTMLFormElement | null;
      form?.reset();
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "";
      setMessage(errorMessage || content.genericError);
    }
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

        <form
          action={handleSubmit}
          className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Success Message */}
          {status === "success" && (
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              {message}
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
              {message}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{content.name} *</label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{content.email} *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {content.phoneOptional}
            </label>
            <input
              name="phone"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {content.subjectOptional}
            </label>
            <input
              name="subject"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{content.message} *</label>
            <textarea
              name="body"
              required
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {content.submit}
          </button>
        </form>
      </section>
    </main>
  );
}
