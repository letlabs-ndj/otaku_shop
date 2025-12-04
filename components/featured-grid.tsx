import Image from "next/image"

const featuredItems = [
  {
    id: 1,
    title: "Manga Collection",
    image: "/manga-books-stack-anime-style.jpg",
    category: "Books",
  },
  {
    id: 2,
    title: "Anime Figures",
    image: "/anime-figure-collectible-japanese.jpg",
    category: "Collectibles",
  },
  {
    id: 3,
    title: "Streetwear",
    image: "/anime-streetwear-hoodie-japanese-style.jpg",
    category: "Apparel",
  },
  {
    id: 4,
    title: "Accessories",
    image: "/anime-accessories-pins-badges-japanese.jpg",
    category: "Accessories",
  },
]

export function FeaturedGrid() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-medium">Curated Collections</p>
          <h2 className="font-[var(--font-display)] text-4xl md:text-6xl tracking-tight text-foreground">
            SHOP BY CATEGORY
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-card cursor-pointer"
            >
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <p className="text-primary text-xs uppercase tracking-widest mb-1">{item.category}</p>
                <h3 className="font-[var(--font-display)] text-xl md:text-2xl text-foreground">{item.title}</h3>
              </div>
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
