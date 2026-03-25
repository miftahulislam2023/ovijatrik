import type { Metadata } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { getRequestLanguage } from "@/lib/language";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "অভিযাত্রিক ফাউন্ডেশন",
  description:
    "সুবিধাবঞ্চিত মানুষের জন্য শিক্ষা, স্বাস্থ্য ও জীবিকা উন্নয়নে কাজ করে যাচ্ছে অভিযাত্রিক ফাউন্ডেশন।",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const language = await getRequestLanguage();

  return (
    <html lang={language} suppressHydrationWarning>
      <body
        className={`${hind.variable} ${inter.variable} bg-background text-foreground min-h-screen`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
