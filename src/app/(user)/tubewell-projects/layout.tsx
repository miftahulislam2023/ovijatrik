import FloatingDonationCta from "@/components/site/floating-donation-cta";
import { getRequestLanguage } from "@/lib/language";

export default async function TubewellProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await getRequestLanguage();

  return (
    <>
      {children}
      <FloatingDonationCta
        href="/donation?campaign=TUBEWELL"
        language={language}
      />
    </>
  );
}
