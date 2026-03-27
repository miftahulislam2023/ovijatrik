"use client";

// src/app/(public)/apply-for-donation/page.tsx

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

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {content.title}
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">{content.subtitle}</p>

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

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      await submitApplication(formData);
      setStatus("success");
      setMessage(content.success);
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "";
      setMessage(errorMessage || content.genericError);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
    >
      {status === "success" && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">{content.name} *</label>
        <input
          name="name"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{content.phone} *</label>
        <input
          name="phone"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{content.emailOptional}</label>
        <input
          type="email"
          name="email"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{content.addressOptional}</label>
        <input
          name="address"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{content.reason} *</label>
        <input
          name="reason"
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{content.details}</label>
        <textarea
          name="details"
          rows={5}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {content.submit}
      </button>
    </form>
  );
}
