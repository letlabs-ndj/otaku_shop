"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function NewsletterSection() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/newsletter/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          setIsSubmitted(true)
          setEmail("")
        } else {
          // Still show success to user
          setIsSubmitted(true)
          setEmail("")
        }
      } catch (error) {
        console.error("Error subscribing to newsletter:", error)
        // Still show success to user
        setIsSubmitted(true)
        setEmail("")
      }
    }
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="uppercase tracking-[0.3em] text-sm font-medium">{t.newsletter.badge}</span>
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="font-[var(--font-display)] text-4xl md:text-6xl tracking-tight text-foreground">
              {t.newsletter.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">{t.newsletter.description}</p>
          </div>

          {isSubmitted ? (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
              <p className="text-primary font-medium text-lg">ありがとう! {t.newsletter.thanks}</p>
              <p className="text-muted-foreground text-sm mt-2">{t.newsletter.checkInbox}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t.newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-input border-border focus:border-primary h-12 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8"
              >
                {t.newsletter.subscribe}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}

          <p className="text-muted-foreground text-xs">{t.newsletter.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}
