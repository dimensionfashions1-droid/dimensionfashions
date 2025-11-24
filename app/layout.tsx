import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Upright, Jost } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const cormorant = Cormorant_Upright({ weight: ["400", "500", "600", "700"], subsets: ["latin"] })
const jost = Jost({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Silkara - Luxury Sarees Online",
  description: "Discover exquisite handcrafted sarees with timeless elegance and traditional craftsmanship",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${jost.className} antialiased`}
        style={{ "--font-serif": "var(--font-cormorant)" } as React.CSSProperties}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
