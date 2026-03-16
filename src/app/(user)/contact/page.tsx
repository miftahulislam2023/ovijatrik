"use client";

import { useState } from "react";
import { sendContactMessage } from "@/actions/contact";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      await sendContactMessage(formData); // server action (ignored return)
      setStatus("success");
      setMessage("আপনার বার্তা সফলভাবে পাঠানো হয়েছে।");

      // Reset form
      const form = document.querySelector("form") as HTMLFormElement | null;
      form?.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।");
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">যোগাযোগ করুন</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          আপনার মতামত, প্রশ্ন বা প্রস্তাব আমাদের জন্য গুরুত্বপূর্ণ।
        </p>

        <form
          action={handleSubmit}
          className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          {/* Success Message */}
          {status === "success" && (
            <div className="rounded-md bg-green-100 p-3 text-sm text-green-800">
              {message}
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="rounded-md bg-red-100 p-3 text-sm text-red-800">
              {message}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">নাম *</label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ইমেইল *</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ফোন (ঐচ্ছিক)</label>
            <input
              name="phone"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="text-sm font-medium">বিষয় (ঐচ্ছিক)</label>
            <input
              name="subject"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">বার্তা *</label>
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
            বার্তা পাঠান
          </button>
        </form>
      </section>
    </main>
  );
}
