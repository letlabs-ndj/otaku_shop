"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Sparkles, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

export function NewsletterPopup() {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem("eno-newsletter-popup-seen")
    if (hasSeenPopup) return

    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 60000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      localStorage.setItem("eno-newsletter-popup-seen", "true")
    }, 300)
  }

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
          localStorage.setItem("eno-newsletter-popup-seen", "true")
          setTimeout(() => {
            handleClose()
          }, 2500)
        } else {
          // Still show success to user even if there's an error (like duplicate email)
          setIsSubmitted(true)
          localStorage.setItem("eno-newsletter-popup-seen", "true")
          setTimeout(() => {
            handleClose()
          }, 2500)
        }
      } catch (error) {
        console.error("Error subscribing to newsletter:", error)
        // Still show success to user
        setIsSubmitted(true)
        localStorage.setItem("eno-newsletter-popup-seen", "true")
        setTimeout(() => {
          handleClose()
        }, 2500)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Popup */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-red-500 to-primary rounded-2xl blur-lg opacity-50 animate-pulse" />

        <div className="relative bg-card border border-primary/30 rounded-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-red-400 to-primary" />

          {/* Content */}
          <div className="p-8">
            {isSubmitted ? (
              <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">ありがとう!</h3>
                <p className="text-muted-foreground">{t.newsletterPopup.thanks}</p>
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {t.newsletterPopup.title} <span className="text-primary">{t.newsletterPopup.titleHighlight}</span>{" "}
                    {t.newsletterPopup.titleEnd}
                  </h3>
                  <p className="text-muted-foreground text-sm">{t.newsletterPopup.description}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder={t.newsletterPopup.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-input border-border focus:border-primary text-foreground placeholder:text-muted-foreground text-center"
                  />
                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
                  >
                    {t.newsletterPopup.subscribe}
                  </Button>
                </form>

                {/* Footer text */}
                <p className="text-center text-muted-foreground text-xs mt-4">{t.newsletterPopup.disclaimer}</p>
              </>
            )}
          </div>

          {/* Bottom decorative elements */}
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl translate-x-1/2 translate-y-1/2" />
        </div>
      </div>
    </div>
  )
}
