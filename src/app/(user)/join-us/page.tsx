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
  if (callbackUrl.startsWith("/admin")) return callbackUrl;
  try {
    const parsed = new URL(callbackUrl);
    const internalPath = `${parsed.pathname}${parsed.search}`;
    if (internalPath.startsWith("/admin")) return internalPath;
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
        "স্বেচ্ছাসেবক হতে চাইলে নিচের স্বেচ্ছাসেবক ফর্ম পূরণ করুন। অনুদান সহায়তার আবেদনের জন্য Apply for Donation ব্যবহার করুন।",
      donationApplyCta: "অনুদান সহায়তার আবেদন করতে এখানে যান",
      signInTitle: "অ্যাডমিন সাইন ইন",
      emailPlaceholder: "অ্যাডমিন ইমেইল",
      passwordPlaceholder: "পাসওয়ার্ড",
      submit: "সাইন ইন",
      invalidCredentials: "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
    },
  } as const;

  const content = copy[language];
  const fontClass = language === "bn" ? "font-['Hind_Siliguri']" : "font-sans";

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
    <main className={`min-h-screen bg-linear-to-b from-[#f4faff] via-[#edf7ff] to-[#f7fbff] dark:from-[#0c151e] dark:via-[#0e1a26] dark:to-[#101722] ${fontClass}`}>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-16 md:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:pt-24 sm:px-6 lg:px-8">
        
        {/* Left Column: Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-[#00535b] sm:text-5xl dark:text-[#9becf7]">
              {content.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#3e494a] sm:text-lg dark:text-slate-300">
              {content.subtitle}
            </p>
          </div>

          <div className="rounded-3xl border border-[#bed4de]/60 bg-[#e7f6ff]/50 p-6 shadow-sm dark:border-white/10 dark:bg-[#15202d]/50 sm:p-8">
            <p className="text-sm leading-relaxed text-[#3e494a] dark:text-slate-300">
              {content.volunteerHint}
            </p>
            <div className="mt-4">
              <Link
                href="/apply-for-donation"
                className="inline-flex items-center text-sm font-semibold text-[#00535b] hover:text-[#006d77] hover:underline dark:text-[#9becf7] dark:hover:text-white"
              >
                {content.donationApplyCta} &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Admin Sign In */}
        <div className="flex items-center justify-center">
          <Card className="w-full rounded-3xl border-[#bed4de]/50 bg-white/60 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#14202c]/60">
            <CardHeader className="pb-4 pt-8 text-center">
              <CardTitle className="text-xl text-[#00535b] dark:text-[#9becf7]">
                {content.signInTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form action={signInAction} className="space-y-5">
                {error === "credentials" && (
                  <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    {content.invalidCredentials}
                  </p>
                )}
                <input type="hidden" name="redirectTo" value={redirectTarget} />
                
                <input
                  name="email"
                  type="email"
                  placeholder={content.emailPlaceholder}
                  className="w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20"
                  required
                />
                
                <input
                  name="password"
                  type="password"
                  placeholder={content.passwordPlaceholder}
                  className="w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20"
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full rounded-full bg-[#00535b] py-6 text-sm font-bold text-white hover:bg-[#006d77] dark:bg-[#9becf7] dark:text-[#00535b] dark:hover:bg-[#c8f0f7]"
                >
                  {content.submit}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Volunteer Form Section */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-white/40 p-1 shadow-sm backdrop-blur-sm dark:bg-[#14202c]/40">
           {/* Assuming VolunteerApplyForm handles its own internal styling, 
               we just wrap it to match the rest of the page's spacing */}
          <VolunteerApplyForm />
        </div>
      </section>
    </main>
  );
}