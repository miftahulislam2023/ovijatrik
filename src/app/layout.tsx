import type { Metadata } from "next";
import { Hind_Siliguri, Geist_Mono } from "next/font/google";
import "./globals.css";


const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
});


export async function generateMetadata(): Promise<Metadata> {
 

  return {
    
    manifest: '/manifest.json',
  };
}

export default async function RootLayout({children}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="QArabic" />
      </head>
      <body>
    {children}
      </body>
    </html>
  );
}
