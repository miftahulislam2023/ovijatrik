import FloatingDonationCta from "@/components/site/floating-donation-cta";
import { getRequestLanguage } from "@/lib/language";

export default async function WeeklyProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await getRequestLanguage();

  return (
    <>
      {children}
      <FloatingDonationCta
        href="/donation?campaign=WEEKLY"
        language={language}
      />
    </>
  );
}
