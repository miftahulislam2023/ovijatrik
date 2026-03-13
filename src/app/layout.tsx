import type { Metadata } from "next"
import { Geist_Mono, Hind_Siliguri } from "next/font/google"
import { AppProviders } from "@/components/providers/app-providers"
import "./globals.css"

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["300", "400", "500", "600", "700"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Ovijatrik",
    template: "%s | Ovijatrik",
  },
  description: "Ovijatrik is a charitable organization supporting weekly projects, clean water, and community impact.",
  manifest: "/manifest.json",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Ovijatrik" />
      </head>
      <body className={`${hindSiliguri.variable} ${geistMono.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
