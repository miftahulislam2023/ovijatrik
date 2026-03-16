import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Hind_Siliguri, Manrope } from "next/font/google";

const hind = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "অভিযাত্রিক ফাউন্ডেশন",
  description:
    "সুবিধাবঞ্চিত মানুষের জন্য শিক্ষা, স্বাস্থ্য ও জীবিকা উন্নয়নে কাজ করে যাচ্ছে অভিযাত্রিক ফাউন্ডেশন।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${hind.variable} ${manrope.variable} bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Header />

        <main className="flex-1">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
