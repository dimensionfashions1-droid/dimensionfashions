import type React from "react"
import type { Metadata } from "next"
import { Unbounded, Manrope } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const unbounded = Unbounded({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
})

const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DIMENSIONS | Modern Menswear",
  description: "Redefining modern menswear with minimal, confident, and premium designs.",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.className} ${unbounded.variable} ${manrope.variable} antialiased bg-background text-foreground selection:bg-white selection:text-black`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
