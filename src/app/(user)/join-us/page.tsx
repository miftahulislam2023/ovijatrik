import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRequestLanguage } from "@/lib/language";
import { VolunteerApplyForm } from "@/components/site/volunteer-apply-form";

function resolveRedirectTarget(callbackUrl?: string) {
  if (!callbackUrl) return "/admin/dashboard";

  if (callbackUrl.startsWith("/admin")) {
    return callbackUrl;
  }

  try {
    const parsed = new URL(callbackUrl);
    const internalPath = `${parsed.pathname}${parsed.search}`;
    if (internalPath.startsWith("/admin")) {
      return internalPath;
    }
  } catch {
    return "/admin/dashboard";
  }

  return "/admin/dashboard";
}

export default async function JoinUsPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const language = await getRequestLanguage();
  const { callbackUrl, error } = await searchParams;
  const redirectTarget = resolveRedirectTarget(callbackUrl);
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
      invalidCredentials: "Invalid credentials. Please try again.",
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
      invalidCredentials: "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
    },
  } as const;

  const content = copy[language];

  async function signInAction(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const redirectTo = resolveRedirectTarget(
      String(formData.get("redirectTo") || "")
    );

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(
          `/join-us?error=credentials&callbackUrl=${encodeURIComponent(redirectTo)}`
        );
      }

      throw error;
    }
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
              {error === "credentials" && (
                <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {content.invalidCredentials}
                </p>
              )}
              <input type="hidden" name="redirectTo" value={redirectTarget} />
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
