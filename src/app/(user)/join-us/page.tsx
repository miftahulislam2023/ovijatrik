import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRequestLanguage } from "@/lib/language";
import { VolunteerApplyForm } from "@/components/site/volunteer-apply-form";

function resolveRedirectTarget(callbackUrl?: string) {
  if (!callbackUrl) return "/profile";
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
    return callbackUrl;
  }
  try {
    const parsed = new URL(callbackUrl);
    const internalPath = `${parsed.pathname}${parsed.search}`;
    if (internalPath.startsWith("/")) return internalPath;
  } catch {
    return "/profile";
  }
  return "/profile";
}

const signUpSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default async function JoinUsPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; signup?: string }>;
}) {
  const language = await getRequestLanguage();
  const { callbackUrl, error, signup } = await searchParams;
  const redirectTarget = resolveRedirectTarget(callbackUrl);
  
  const copy = {
    en: {
      title: "Join us",
      subtitle:
        "You can be part of Ovijatrik Foundation’s journey as a volunteer, donor, or partner.",
      volunteerHint:
        "Want to volunteer? Submit the volunteer form below. For donation support requests, use Apply for Donation.",
      donationApplyCta: "Need donation support? Apply here",
      signUpTitle: "Create donor account",
      signUpNamePlaceholder: "Your full name",
      signUpEmailPlaceholder: "Your email",
      signUpPasswordPlaceholder: "Create password",
      signUpConfirmPasswordPlaceholder: "Confirm password",
      signUpSubmit: "Create account",
      signUpSuccess: "Account created. You are now signed in.",
      signUpInvalid: "Please check your signup details and try again.",
      signUpEmailTaken: "This email is already registered. Please sign in.",
      signInTitle: "Sign in",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      submit: "Sign in",
      invalidCredentials: "Invalid credentials. Please try again.",
      adminHint: "Admins can sign in with their existing credentials.",
    },
    bn: {
      title: "আমাদের সাথে যুক্ত হোন",
      subtitle:
        "স্বেচ্ছাসেবক, দাতা বা অংশীদার হিসেবে আপনি অভিযাত্রিক ফাউন্ডেশনের যাত্রার অংশ হতে পারেন।",
      volunteerHint:
        "স্বেচ্ছাসেবক হতে চাইলে নিচের স্বেচ্ছাসেবক ফর্ম পূরণ করুন। অনুদান সহায়তার আবেদনের জন্য Apply for Donation ব্যবহার করুন।",
      donationApplyCta: "অনুদান সহায়তার আবেদন করতে এখানে যান",
      signUpTitle: "ডোনার অ্যাকাউন্ট তৈরি করুন",
      signUpNamePlaceholder: "আপনার পূর্ণ নাম",
      signUpEmailPlaceholder: "আপনার ইমেইল",
      signUpPasswordPlaceholder: "পাসওয়ার্ড তৈরি করুন",
      signUpConfirmPasswordPlaceholder: "পাসওয়ার্ড নিশ্চিত করুন",
      signUpSubmit: "অ্যাকাউন্ট তৈরি করুন",
      signUpSuccess: "অ্যাকাউন্ট তৈরি হয়েছে। আপনি এখন সাইন ইন অবস্থায় আছেন।",
      signUpInvalid: "সাইনআপ তথ্য ঠিক করে আবার চেষ্টা করুন।",
      signUpEmailTaken: "এই ইমেইল আগে থেকেই ব্যবহার করা হয়েছে। অনুগ্রহ করে সাইন ইন করুন।",
      signInTitle: "সাইন ইন",
      emailPlaceholder: "ইমেইল",
      passwordPlaceholder: "পাসওয়ার্ড",
      submit: "সাইন ইন",
      invalidCredentials: "ইমেইল বা পাসওয়ার্ড সঠিক নয়। আবার চেষ্টা করুন।",
      adminHint: "অ্যাডমিনরাও তাদের বিদ্যমান ক্রেডেনশিয়াল দিয়ে সাইন ইন করতে পারবেন।",
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

  async function signUpAction(formData: FormData) {
    "use server";

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");
    const redirectTo = resolveRedirectTarget(String(formData.get("redirectTo") || ""));

    const parsed = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!parsed.success) {
      redirect(
        `/join-us?signup=invalid&callbackUrl=${encodeURIComponent(redirectTo)}`,
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      redirect(
        `/join-us?signup=email_taken&callbackUrl=${encodeURIComponent(redirectTo)}`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo,
      });
    } catch (signInError) {
      if (signInError instanceof AuthError) {
        redirect(
          `/join-us?signup=success&callbackUrl=${encodeURIComponent(redirectTo)}`,
        );
      }
      throw signInError;
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

        {/* Right Column: Sign Up + Sign In */}
        <div className="flex items-center justify-center">
          <Card className="w-full rounded-3xl border-[#bed4de]/50 bg-white/60 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#14202c]/60">
            <CardHeader className="pb-3 pt-8 text-center">
              <CardTitle className="text-xl text-[#00535b] dark:text-[#9becf7]">
                {content.signUpTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-3">
              <form action={signUpAction} className="space-y-4">
                {signup === "success" && (
                  <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {content.signUpSuccess}
                  </p>
                )}
                {signup === "invalid" && (
                  <p className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    {content.signUpInvalid}
                  </p>
                )}
                {signup === "email_taken" && (
                  <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                    {content.signUpEmailTaken}
                  </p>
                )}

                <input type="hidden" name="redirectTo" value={redirectTarget} />

                <input
                  name="name"
                  type="text"
                  placeholder={content.signUpNamePlaceholder}
                  className="w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20"
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder={content.signUpEmailPlaceholder}
                  className="w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20"
                  required
                />

                <input
                  name="password"
                  type="password"
                  placeholder={content.signUpPasswordPlaceholder}
                  className="w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20"
                  required
                />

                <input
                  name="confirmPassword"
                  type="password"
                  placeholder={content.signUpConfirmPasswordPlaceholder}
                  className="w-full rounded-xl border border-[#bec8ca] bg-white/80 px-4 py-3 text-sm text-[#0e1d25] outline-none transition-all placeholder:text-gray-400 focus:border-[#00535b] focus:ring-2 focus:ring-[#00535b]/20 dark:border-white/10 dark:bg-[#0c151e]/80 dark:text-slate-100 dark:focus:border-[#9becf7] dark:focus:ring-[#9becf7]/20"
                  required
                />

                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#00535b] py-6 text-sm font-bold text-white hover:bg-[#006d77] dark:bg-[#9becf7] dark:text-[#00535b] dark:hover:bg-[#c8f0f7]"
                >
                  {content.signUpSubmit}
                </Button>
              </form>
            </CardContent>

            <div className="mx-8 my-3 h-px bg-border/60" />

            <CardHeader className="pb-4 pt-2 text-center">
              <CardTitle className="text-xl text-[#00535b] dark:text-[#9becf7]">
                {content.signInTitle}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{content.adminHint}</p>
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