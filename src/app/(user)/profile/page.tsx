import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRequestLanguage } from "@/lib/language";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const language = await getRequestLanguage();
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/join-us");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      role: true,
      preferredDonationAmount: true,
      preferredDonationFrequency: true,
      receiveWeeklyDigest: true,
      receiveCampaignAlerts: true,
    },
  });

  if (!user) {
    await signOut({ redirectTo: "/" });
  }

  const copy = {
    en: {
      title: "My Profile",
      subtitle: "Update your account information or delete your profile.",
      name: "Name",
      email: "Email",
      image: "Image URL",
      role: "Role",
      update: "Update Profile",
      deleteTitle: "Danger Zone",
      deleteHelp: "Deleting your profile is permanent and cannot be undone.",
      delete: "Delete Profile",
      donorToolsTitle: "Donor Account",
      donorToolsSubtitle:
        "See your donation activity, track receipt references, and manage recurring support settings.",
      donationHistory: "Donation History",
      noDonations:
        "No donations are linked with your name yet. Use your profile name when donating to get automatic tracking.",
      receiptRef: "Receipt ref",
      recurringTitle: "Recurring Donation Preferences",
      recurringHelp:
        "Set your preferred recurring support amount and frequency. You can use this on your next donation.",
      amountLabel: "Preferred amount (BDT)",
      frequencyLabel: "Frequency",
      frequencyMonthly: "Monthly",
      frequencyQuarterly: "Quarterly",
      frequencyYearly: "Yearly",
      savePrefs: "Save Preferences",
      updatesTitle: "Personalized Updates",
      updatesHelp:
        "Control how often you receive impact updates about campaigns you support.",
      updatesWeekly: "Weekly email digest",
      updatesCampaign: "Campaign milestone alerts",
      saveUpdates: "Save Update Settings",
      donateNow: "Donate now",
      preferencesSaved: "Donation preferences saved.",
      updatesSaved: "Update preferences saved.",
    },
    bn: {
      title: "আমার প্রোফাইল",
      subtitle: "আপনার তথ্য আপডেট করুন অথবা প্রোফাইল মুছে ফেলুন।",
      name: "নাম",
      email: "ইমেইল",
      image: "ছবির URL",
      role: "ভূমিকা",
      update: "প্রোফাইল আপডেট করুন",
      deleteTitle: "সতর্কতা",
      deleteHelp: "প্রোফাইল মুছে ফেললে তা আর ফেরত আনা যাবে না।",
      delete: "প্রোফাইল মুছে ফেলুন",
      donorToolsTitle: "ডোনার অ্যাকাউন্ট",
      donorToolsSubtitle:
        "আপনার অনুদানের তথ্য, রিসিপ্ট রেফারেন্স এবং রিকারিং সহায়তা সেটিংস এক জায়গায় দেখুন।",
      donationHistory: "অনুদান ইতিহাস",
      noDonations:
        "এখনও আপনার নামে অনুদান মেলেনি। অনুদান দেওয়ার সময় প্রোফাইলের নাম ব্যবহার করলে স্বয়ংক্রিয়ভাবে ট্র্যাক হবে।",
      receiptRef: "রিসিপ্ট রেফ",
      recurringTitle: "রিকারিং অনুদান পছন্দ",
      recurringHelp:
        "আপনার পছন্দের অনুদান পরিমাণ ও সময়চক্র সেট করুন, পরবর্তী অনুদানে এটি ব্যবহার করতে পারবেন।",
      amountLabel: "পছন্দের পরিমাণ (টাকা)",
      frequencyLabel: "সময়চক্র",
      frequencyMonthly: "মাসিক",
      frequencyQuarterly: "ত্রৈমাসিক",
      frequencyYearly: "বার্ষিক",
      savePrefs: "সেটিংস সংরক্ষণ করুন",
      updatesTitle: "পার্সোনালাইজড আপডেট",
      updatesHelp:
        "আপনি যেসব ক্যাম্পেইনে সহায়তা করেন তার আপডেট কত ঘন ঘন পাবেন তা ঠিক করুন।",
      updatesWeekly: "সাপ্তাহিক ইমেইল ডাইজেস্ট",
      updatesCampaign: "ক্যাম্পেইন মাইলস্টোন এলার্ট",
      saveUpdates: "আপডেট সেটিংস সংরক্ষণ করুন",
      donateNow: "এখনই অনুদান করুন",
      preferencesSaved: "অনুদান পছন্দ সফলভাবে সংরক্ষিত হয়েছে।",
      updatesSaved: "আপডেট পছন্দ সফলভাবে সংরক্ষিত হয়েছে।",
    },
  } as const;

  const content = copy[language];

  const nameQuery = user.name?.trim();
  const [generalDonations, weeklyDonations] = await Promise.all([
    nameQuery
      ? prisma.donation.findMany({
          where: {
            deletedAt: null,
            donorName: {
              contains: nameQuery,
              mode: "insensitive",
            },
          },
          orderBy: { date: "desc" },
          take: 12,
          select: {
            id: true,
            amount: true,
            date: true,
            medium: true,
            type: true,
          },
        })
      : Promise.resolve([]),
    nameQuery
      ? prisma.weeklyDonation.findMany({
          where: {
            deletedAt: null,
            donorName: {
              contains: nameQuery,
              mode: "insensitive",
            },
          },
          orderBy: { date: "desc" },
          take: 12,
          select: {
            id: true,
            amount: true,
            date: true,
            medium: true,
            project: {
              select: {
                slug: true,
                titleBn: true,
                titleEn: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  const donationHistory = [
    ...generalDonations.map((donation) => ({
      id: donation.id,
      amount: donation.amount,
      date: donation.date,
      medium: donation.medium,
      kind: donation.type,
      details: null as string | null,
      href: null as string | null,
    })),
    ...weeklyDonations.map((donation) => ({
      id: donation.id,
      amount: donation.amount,
      date: donation.date,
      medium: donation.medium,
      kind: "WEEKLY",
      details:
        language === "en"
          ? donation.project.titleEn || donation.project.titleBn
          : donation.project.titleBn,
      href: `/weekly-projects/${donation.project.slug}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 12);

  const donationTotal = donationHistory.reduce((sum, item) => sum + item.amount, 0);

  async function updateProfileAction(formData: FormData) {
    "use server";

    const currentSession = await auth();
    if (!currentSession?.user?.id) {
      redirect("/join-us");
    }

    const name = String(formData.get("name") || "").trim() || null;
    const emailRaw = String(formData.get("email") || "").trim().toLowerCase();
    const image = String(formData.get("image") || "").trim() || null;

    if (!emailRaw) {
      throw new Error("Email is required");
    }

    await prisma.user.update({
      where: { id: currentSession.user.id },
      data: {
        name,
        email: emailRaw,
        image,
      },
    });

    redirect("/profile");
  }

  async function deleteProfileAction() {
    "use server";

    const currentSession = await auth();
    if (!currentSession?.user?.id) {
      redirect("/join-us");
    }

    await prisma.user.delete({
      where: { id: currentSession.user.id },
    });

    await signOut({ redirectTo: "/" });
  }

  async function saveDonationPreferencesAction(formData: FormData) {
    "use server";

    const currentSession = await auth();
    if (!currentSession?.user?.id) {
      redirect("/join-us");
    }

    const amountRaw = Number(String(formData.get("preferredAmount") || "0"));
    const frequencyRaw = String(formData.get("donationFrequency") || "").toUpperCase();

    const normalizedAmount = Number.isFinite(amountRaw)
      ? Math.max(100, Math.floor(amountRaw))
      : 1000;

    const normalizedFrequency =
      frequencyRaw === "MONTHLY" ||
      frequencyRaw === "QUARTERLY" ||
      frequencyRaw === "YEARLY"
        ? frequencyRaw
        : "MONTHLY";

    await prisma.user.update({
      where: { id: currentSession.user.id },
      data: {
        preferredDonationAmount: normalizedAmount,
        preferredDonationFrequency: normalizedFrequency,
      },
    });

    redirect("/profile?saved=preferences");
  }

  async function saveUpdatePreferencesAction(formData: FormData) {
    "use server";

    const currentSession = await auth();
    if (!currentSession?.user?.id) {
      redirect("/join-us");
    }

    await prisma.user.update({
      where: { id: currentSession.user.id },
      data: {
        receiveWeeklyDigest: formData.get("weeklyDigest") === "on",
        receiveCampaignAlerts: formData.get("campaignAlerts") === "on",
      },
    });

    redirect("/profile?saved=updates");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{content.title}</h1>
        <p className="text-sm text-muted-foreground">{content.subtitle}</p>
        {params.saved === "preferences" && (
          <p className="text-sm font-medium text-primary">{content.preferencesSaved}</p>
        )}
        {params.saved === "updates" && (
          <p className="text-sm font-medium text-primary">{content.updatesSaved}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {content.name}
              </label>
              <input
                id="name"
                name="name"
                defaultValue={user.name ?? ""}
                className="w-full rounded-md border border-input px-3 py-2"
                placeholder={content.name}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {content.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={user.email ?? ""}
                className="w-full rounded-md border border-input px-3 py-2"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                {content.image}
              </label>
              <input
                id="image"
                name="image"
                type="url"
                defaultValue={user.image ?? ""}
                className="w-full rounded-md border border-input px-3 py-2"
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              <span className="font-medium">{content.role}: </span>
              <span className="text-muted-foreground">{user.role}</span>
            </div>

            <Button type="submit">{content.update}</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{content.donorToolsTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">{content.donorToolsSubtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{content.donationHistory}</h3>
              <span className="text-sm text-muted-foreground">
                {donationTotal.toLocaleString()} BDT
              </span>
            </div>

            {donationHistory.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{content.noDonations}</p>
            ) : (
              <div className="mt-3 space-y-3">
                {donationHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {item.amount.toLocaleString()} BDT
                      </span>
                      <span className="text-muted-foreground">
                        {item.date.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.medium}</span>
                      <span>•</span>
                      <span>{item.kind}</span>
                      <span>•</span>
                      <span>
                        {content.receiptRef}: OVJ-{item.id.slice(-6).toUpperCase()}
                      </span>
                      {item.details && (
                        <>
                          <span>•</span>
                          {item.href ? (
                            <Link href={item.href} className="text-primary hover:underline">
                              {item.details}
                            </Link>
                          ) : (
                            <span>{item.details}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form
            action={saveDonationPreferencesAction}
            className="space-y-4 rounded-md border border-border bg-muted/30 p-4"
          >
            <div>
              <h3 className="text-sm font-semibold">{content.recurringTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{content.recurringHelp}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="preferredAmount" className="text-sm font-medium">
                {content.amountLabel}
              </label>
              <input
                id="preferredAmount"
                name="preferredAmount"
                type="number"
                min={100}
                step={100}
                defaultValue={user.preferredDonationAmount ?? 1000}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="donationFrequency" className="text-sm font-medium">
                {content.frequencyLabel}
              </label>
              <select
                id="donationFrequency"
                name="donationFrequency"
                defaultValue={user.preferredDonationFrequency ?? "MONTHLY"}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="MONTHLY">{content.frequencyMonthly}</option>
                <option value="QUARTERLY">{content.frequencyQuarterly}</option>
                <option value="YEARLY">{content.frequencyYearly}</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="outline">
                {content.savePrefs}
              </Button>
              <Button asChild>
                <Link href="/donation">{content.donateNow}</Link>
              </Button>
            </div>
          </form>

          <form
            action={saveUpdatePreferencesAction}
            className="space-y-4 rounded-md border border-border bg-muted/30 p-4"
          >
            <div>
              <h3 className="text-sm font-semibold">{content.updatesTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{content.updatesHelp}</p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="weeklyDigest"
                defaultChecked={user.receiveWeeklyDigest}
                className="h-4 w-4 rounded"
              />
              <span>{content.updatesWeekly}</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="campaignAlerts"
                defaultChecked={user.receiveCampaignAlerts}
                className="h-4 w-4 rounded"
              />
              <span>{content.updatesCampaign}</span>
            </label>

            <Button type="submit" variant="outline">
              {content.saveUpdates}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 border-destructive/30">
        <CardHeader>
          <CardTitle>{content.deleteTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{content.deleteHelp}</p>
          <form action={deleteProfileAction}>
            <Button type="submit" variant="destructive">
              {content.delete}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
