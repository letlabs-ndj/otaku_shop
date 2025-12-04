"use client"

export function MarqueeBanner() {
  const items = [
    "FREE SHIPPING OVER $50",
    "新着アイテム",
    "LIMITED EDITION DROPS",
    "オタク文化",
    "EXCLUSIVE MERCH",
    "アニメコレクション",
    "NEW ARRIVALS WEEKLY",
    "漫画",
  ]

  return (
    <div className="bg-primary py-3 overflow-hidden">
      <div className="flex animate-[scroll_20s_linear_infinite] whitespace-nowrap">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={index} className="mx-8 text-sm font-medium uppercase tracking-widest text-primary-foreground">
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  )
}
