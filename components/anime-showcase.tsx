"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

const animeImages = [
  {
    id: 1,
    image: "/images/anime/shingeki-no-kyojin.jpg",
    title: "Shingeki no Kyojin",
    subtitle: "進撃の巨人",
  },
  {
    id: 2,
    image: "/images/anime/demon-slayer.webp",
    title: "Demon Slayer",
    subtitle: "鬼滅の刃",
  },
  {
    id: 3,
    image: "/images/anime/naruto.jpg",
    title: "Naruto",
    subtitle: "ナルト",
  },
  {
    id: 4,
    image: "/images/anime/frieren.webp",
    title: "Frieren",
    subtitle: "葬送のフリーレン",
  },
  {
    id: 5,
    image: "/images/anime/jujutsu-kaisen.jpg",
    title: "Jujutsu Kaisen",
    subtitle: "呪術廻戦",
  },
]

export function AnimeShowcase() {
  const { t } = useI18n()
  const [activeIndex, setActiveIndex] = useState(2)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handleNext = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === animeImages.length - 1 ? 0 : prev + 1))
  }, [isAnimating])

  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? animeImages.length - 1 : prev - 1))
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 400)
    return () => clearTimeout(timer)
  }, [activeIndex])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setIsAnimating(true)
      setActiveIndex((prev) => (prev === animeImages.length - 1 ? 0 : prev + 1))
    }, 1800)
    return () => clearInterval(interval)
  }, [isPaused])

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex
    const totalItems = animeImages.length

    let adjustedDiff = diff
    if (diff > totalItems / 2) adjustedDiff = diff - totalItems
    if (diff < -totalItems / 2) adjustedDiff = diff + totalItems

    const isCenter = adjustedDiff === 0
    const isAdjacent = Math.abs(adjustedDiff) === 1
    const isSecondary = Math.abs(adjustedDiff) === 2

    const translateX = adjustedDiff * 160
    let translateZ = 0
    let rotateY = 0
    let opacity = 0
    let scale = 0.6
    let zIndex = 0

    if (isCenter) {
      translateZ = 100
      scale = 1
      opacity = 1
      zIndex = 5
    } else if (isAdjacent) {
      translateZ = -50
      rotateY = adjustedDiff > 0 ? -30 : 30
      scale = 0.75
      opacity = 0.85
      zIndex = 3
    } else if (isSecondary) {
      translateZ = -150
      rotateY = adjustedDiff > 0 ? -40 : 40
      scale = 0.55
      opacity = 0.5
      zIndex = 1
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    }
  }

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center space-y-3">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-medium">{t.animeShowcase.subtitle}</p>
          <h2 className="font-[var(--font-display)] text-3xl md:text-5xl tracking-tight text-foreground">
            {t.animeShowcase.title}
          </h2>
        </div>
      </div>

      {/* 3D Carousel */}
      <div
        className="relative h-[300px] md:h-[360px] flex items-center justify-center"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {animeImages.map((item, index) => {
            const style = getCardStyle(index)
            const isActive = index === activeIndex

            return (
              <div
                key={item.id}
                className="absolute w-40 md:w-48 aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out"
                style={{
                  ...style,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => !isAnimating && setActiveIndex(index)}
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-3 transition-all duration-500"
                  style={{ opacity: isActive ? 1 : 0.6 }}
                >
                  <p className="text-primary text-xs font-medium mb-0.5">{item.subtitle}</p>
                  <h3 className="font-[var(--font-display)] text-sm md:text-base text-white">{item.title}</h3>
                </div>

                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 border-2 border-primary/60 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.3)] pointer-events-none" />
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 border border-primary/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 border border-primary/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
          {animeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => !isAnimating && setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-primary w-6" : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
