"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Twitter, Youtube } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/logo.jpg" alt="Entre Nous Otakus" width={60} height={60} className="rounded-full" />
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">{t.footer.description}</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-[var(--font-display)] text-lg tracking-wider text-foreground">{t.footer.shop}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.allProducts}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.newArrivals}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.bestSellers}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.sale}
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-[var(--font-display)] text-lg tracking-wider text-foreground">{t.footer.support}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.contactUs}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.shippingInfo}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.returns}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.faq}
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-[var(--font-display)] text-lg tracking-wider text-foreground">{t.footer.legal}</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.privacy}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.terms}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                {t.footer.cookies}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">{t.footer.copyright}</p>
          <p className="text-muted-foreground text-sm">{t.footer.madeWith}</p>
        </div>
      </div>
    </footer>
  )
}
