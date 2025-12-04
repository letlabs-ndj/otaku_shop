"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/lib/i18n-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.jpg" alt="Entre Nous Otakus" width={50} height={50} className="rounded-full" />
            <span className="hidden md:block font-[var(--font-display)] text-2xl tracking-wider text-foreground">
              ENO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#products"
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {t.header.shop}
            </Link>
            <Link
              href="#products"
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {t.header.collections}
            </Link>
            <Link
              href="#"
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {t.header.about}
            </Link>
            <Link
              href="#"
              className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {t.header.contact}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                href="#products"
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.header.shop}
              </Link>
              <Link
                href="#products"
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.header.collections}
              </Link>
              <Link
                href="#"
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.header.about}
              </Link>
              <Link
                href="#"
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.header.contact}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
