"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { submitVolunteerApplication } from "@/actions/volunteers";

export function VolunteerApplyForm() {
  const { language } = useLanguage();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const copy = {
    en: {
      title: "Apply as a volunteer",
      subtitle:
        "Join our field work and community activities. Fill out the form and our team will contact you.",
      name: "Name",
      phone: "Phone",
      emailOptional: "Email (optional)",
      addressOptional: "Address (optional)",
      availability: "Availability",
      interests: "Area of interest",
      experience: "Experience",
      motivation: "Why do you want to volunteer?",
      submit: "Submit volunteer application",
      success:
        "Your volunteer application has been submitted. We will get in touch soon.",
      genericError: "Something went wrong. Please try again.",
    },
    bn: {
      title: "স্বেচ্ছাসেবক হিসেবে আবেদন করুন",
      subtitle:
        "আমাদের ফিল্ড ও কমিউনিটি কার্যক্রমে যুক্ত হতে ফর্মটি পূরণ করুন। আমাদের টিম দ্রুত যোগাযোগ করবে।",
      name: "নাম",
      phone: "ফোন",
      emailOptional: "ইমেইল (ঐচ্ছিক)",
      addressOptional: "ঠিকানা (ঐচ্ছিক)",
      availability: "কখন সময় দিতে পারবেন",
      interests: "আগ্রহের ক্ষেত্র",
      experience: "অভিজ্ঞতা",
      motivation: "কেন স্বেচ্ছাসেবক হতে চান?",
      submit: "স্বেচ্ছাসেবক আবেদন জমা দিন",
      success:
        "আপনার স্বেচ্ছাসেবক আবেদন সফলভাবে জমা হয়েছে। আমরা দ্রুত যোগাযোগ করবো।",
      genericError: "কিছু ভুল হয়েছে, আবার চেষ্টা করুন।",
    },
  } as const;

  const content = copy[language];

  async function handleSubmit(formData: FormData): Promise<void> {
    try {
      await submitVolunteerApplication(formData);
      setStatus("success");
      setMessage(content.success);
    } catch (err: unknown) {
      setStatus("error");
      const errorMessage = err instanceof Error ? err.message : "";
      setMessage(errorMessage || content.genericError);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">{content.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{content.subtitle}</p>
      </div>

      <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
        {status === "success" && (
          <div className="rounded-md bg-green-100 p-3 text-sm text-green-800 md:col-span-2">
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-md bg-red-100 p-3 text-sm text-red-800 md:col-span-2">
            {message}
          </div>
        )}

        <input
          name="name"
          placeholder={`${content.name} *`}
          className="rounded-md border border-input px-3 py-2"
          required
        />
        <input
          name="phone"
          placeholder={`${content.phone} *`}
          className="rounded-md border border-input px-3 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder={content.emailOptional}
          className="rounded-md border border-input px-3 py-2"
        />
        <input
          name="address"
          placeholder={content.addressOptional}
          className="rounded-md border border-input px-3 py-2"
        />
        <input
          name="availability"
          placeholder={content.availability}
          className="rounded-md border border-input px-3 py-2"
        />
        <input
          name="interests"
          placeholder={content.interests}
          className="rounded-md border border-input px-3 py-2"
        />
        <textarea
          name="experience"
          rows={3}
          placeholder={content.experience}
          className="rounded-md border border-input px-3 py-2 md:col-span-2"
        />
        <textarea
          name="motivation"
          rows={4}
          placeholder={`${content.motivation} *`}
          className="rounded-md border border-input px-3 py-2 md:col-span-2"
          required
        />
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 md:col-span-2 md:w-fit"
        >
          {content.submit}
        </button>
      </form>
    </div>
  );
}
