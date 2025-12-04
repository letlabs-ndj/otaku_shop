import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MarqueeBanner } from "@/components/marquee-banner"
import { ProductsSection } from "@/components/products-section"
import { AnimeShowcase } from "@/components/anime-showcase"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import { NewsletterPopup } from "@/components/newsletter-popup"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <MarqueeBanner />
      <ProductsSection />
      <AnimeShowcase />
      <NewsletterSection />
      <Footer />
      <NewsletterPopup />
    </main>
  )
}
