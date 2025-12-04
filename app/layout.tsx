import type React from "react"
import type { Metadata } from "next"
import { Inter, Bebas_Neue, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
})
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Entre Nous Otakus | Premium Anime & Manga Merch",
  description:
    "Your ultimate destination for exclusive anime merchandise, manga collectibles, and otaku culture essentials.",
  icons: {
    icon: [
      {
        url: "/images/logo.jpg",
        sizes: "any",
      },
      {
        url: "/images/logo.jpg",
        type: "image/jpeg",
      },
    ],
    apple: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${bebasNeue.variable} font-sans antialiased`}>
        <I18nProvider>{children}</I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
