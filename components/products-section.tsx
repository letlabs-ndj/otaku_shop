"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Search, SlidersHorizontal, X, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product, ProductsData } from "@/lib/types"
import { useI18n } from "@/lib/i18n-context"
import { API_CONFIG, fetchFromApi } from "@/lib/api-config"

const isBase64Image = (src: string) => src?.startsWith("data:image")
const isExternalUrl = (src: string) => src?.startsWith("http://") || src?.startsWith("https://")

function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const imageSrc = src || "/anime-merchandise.png"

  if (isBase64Image(imageSrc) || isExternalUrl(imageSrc)) {
    return (
      <img src={imageSrc || "/placeholder.svg"} alt={alt} className={cn("object-cover w-full h-full", className)} />
    )
  }

  return <Image src={imageSrc || "/placeholder.svg"} alt={alt} fill className={cn("object-cover", className)} />
}

export function ProductsSection() {
  const { t } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetchFromApi(API_CONFIG.endpoints.products)
      if (res.ok) {
        const data: ProductsData = await res.json()
        setProducts(data.products || [])
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()

    // Poll for updates every 5 seconds to sync with admin changes
    const interval = setInterval(fetchProducts, 5000)

    return () => clearInterval(interval)
  }, [fetchProducts])

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = [...products]

    // Category filter
    if (activeCategory !== "All") {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredProducts = getFilteredProducts()

  const activeFilters = [
    ...(activeCategory !== "All" ? [{ type: "category", value: activeCategory }] : []),
    ...(searchQuery ? [{ type: "search", value: searchQuery }] : []),
  ]

  const clearFilter = (type: string) => {
    switch (type) {
      case "category":
        setActiveCategory("All")
        break
      case "search":
        setSearchQuery("")
        break
    }
  }

  const clearAllFilters = () => {
    setActiveCategory("All")
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground">{t.products.loading}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            {t.products.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.products.title1}{" "}
            <span className="text-primary relative">
              {t.products.title2}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full" />
            </span>{" "}
            {t.products.title3}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.products.description}</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.products.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border h-11"
              />
            </div>

            {/* Category Pills - Desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  {category === "All" ? t.products.all : category}
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-border bg-background"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {t.products.categories}
            </Button>
          </div>

          {/* Mobile Category Pills */}
          {showFilters && (
            <div className="lg:hidden flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
              {["All", ...categories].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  {category === "All" ? t.products.all : category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm text-muted-foreground">{t.products.activeFilters}</span>
            {activeFilters.map((filter) => (
              <button
                key={`${filter.type}-${filter.value}`}
                onClick={() => clearFilter(filter.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors group"
              >
                <span className="capitalize">{filter.value}</span>
                <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              </button>
            ))}
            {activeFilters.length > 1 && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.products.clearAll}
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {t.products.showing} <span className="text-foreground font-medium">{filteredProducts.length}</span>{" "}
            {t.products.productsText}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Category */}
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">{product.category}</span>

                  {/* Name */}
                  <h3 className="font-semibold text-sm text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <span className="text-base font-bold text-foreground">${product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t.products.noProducts}</h3>
            <p className="text-muted-foreground mb-6">{t.products.noProductsDesc}</p>
            <Button onClick={clearAllFilters} className="bg-primary hover:bg-primary/90">
              {t.products.clearFilters}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
