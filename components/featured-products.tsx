"use client"

import { useState } from "react"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <section className="py-24 bg-white pattern-grid relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-[rgb(218_184_105)]" />
            <p className="text-[rgb(218_184_105)] text-sm font-bold tracking-widest uppercase font-sans">
              Curated Collection
            </p>
            <div className="w-8 h-px bg-[rgb(218_184_105)]" />
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-4">Featured Sarees</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-sans leading-relaxed">
            Handpicked collection of the finest sarees, curated for elegance and comfort
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 font-sans text-sm uppercase tracking-wide ${
              selectedCategory === null
                ? "bg-[rgb(218_184_105)] text-black shadow-lg"
                : "bg-muted text-foreground hover:bg-muted/80 border border-border"
            }`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 font-sans text-sm uppercase tracking-wide ${
                selectedCategory === cat
                  ? "bg-[rgb(218_184_105)] text-black shadow-lg"
                  : "bg-muted text-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              {cat
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              style={{
                animation: `fade-in-scale 0.5s ease-out ${index * 0.1}s backwards`,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg font-sans">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
