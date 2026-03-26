import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRequestLanguage } from "@/lib/language";
import { VolunteerApplyForm } from "@/components/site/volunteer-apply-form";

export default async function JoinUsPage() {
  const language = await getRequestLanguage();
  const copy = {
    en: {
      title: "Join us",
      subtitle:
        "You can be part of Ovijatrik Foundation’s journey as a volunteer, donor, or partner.",
      volunteerHint:
        "Want to volunteer? Submit the volunteer form below. For donation support requests, use Apply for Donation.",
      donationApplyCta: "Need donation support? Apply here",
      signInTitle: "Admin sign in",
      emailPlaceholder: "Admin email",
      passwordPlaceholder: "Password",
      submit: "Sign in",
    },
    bn: {
      title: "আমাদের সাথে যুক্ত হোন",
      subtitle:
        "স্বেচ্ছাসেবক, দাতা বা অংশীদার হিসেবে আপনি অভিযাত্রিক ফাউন্ডেশনের যাত্রার অংশ হতে পারেন।",
      volunteerHint:
        "স্বেচ্ছাসেবক হতে চাইলে নিচের স্বেচ্ছাসেবক ফর্ম পূরণ করুন। অনুদান সহায়তার আবেদনের জন্য Apply for Donation ব্যবহার করুন।",
      donationApplyCta: "অনুদান সহায়তার আবেদন করতে এখানে যান",
      signInTitle: "অ্যাডমিন সাইন ইন",
      emailPlaceholder: "অ্যাডমিন ইমেইল",
      passwordPlaceholder: "পাসওয়ার্ড",
      submit: "সাইন ইন",
    },
  } as const;

  const content = copy[language];

  async function signInAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });

    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {content.title}
          </h1>
          <p className="text-sm text-muted-foreground">{content.subtitle}</p>
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            {content.volunteerHint}
            <div className="mt-2">
              <Link
                href="/apply-for-donation"
                className="text-primary underline"
              >
                {content.donationApplyCta}
              </Link>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{content.signInTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={signInAction} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder={content.emailPlaceholder}
                className="w-full rounded-md border border-input px-3 py-2"
                required
              />
              <input
                name="password"
                type="password"
                placeholder={content.passwordPlaceholder}
                className="w-full rounded-md border border-input px-3 py-2"
                required
              />
              <Button type="submit" className="w-full">
                {content.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12">
        <VolunteerApplyForm />
      </section>
    </main>
  );
}
