"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function HeroSection() {
  const { t } = useI18n()

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background z-10" />

      {/* Decorative red glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] z-0" />

      <div className="container mx-auto px-4 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium">{t.hero.welcome}</p>
              <h1 className="font-[var(--font-display)] text-5xl md:text-7xl lg:text-8xl leading-none tracking-tight text-foreground">
                {t.hero.title1}
                <span className="block text-primary">{t.hero.title2}</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto lg:mx-0">{t.hero.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground animate-pulse-glow"
                onClick={scrollToProducts}
              >
                {t.hero.exploreCollection}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-primary hover:text-primary bg-transparent"
                onClick={scrollToProducts}
              >
                {t.hero.newArrivals}
              </Button>
            </div>
          </div>

          {/* Right content - Logo display */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-lg aspect-square animate-float">
              <Image
                src="/images/logo.jpg"
                alt="Entre Nous Otakus"
                fill
                className="object-contain drop-shadow-[0_0_80px_rgba(220,38,38,0.4)]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-muted-foreground text-xs uppercase tracking-widest">{t.hero.scroll}</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  )
}
