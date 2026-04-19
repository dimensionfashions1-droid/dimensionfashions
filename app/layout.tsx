import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { AuthToasterWatcher } from "@/components/auth/AuthToasterWatcher"
import "./globals.css"
import { Suspense } from "react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DIMENSIONS | Premium Women's Wear",
  description: "A curated collection of contemporary and ethnic women's wear designed for elegance and comfort.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Analytics />
        <Toaster />
        <Suspense fallback={null}>
          <AuthToasterWatcher />
        </Suspense>
      </body>
    </html>
  )
}
