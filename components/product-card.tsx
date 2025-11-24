"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  onAddToWishlist?: (product: Product) => void
}

export function ProductCard({ product, onAddToWishlist }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const { addToCart } = useCart()

  const discount = Math.round((1 - product.price / product.originalPrice) * 100)

  const handleAddToCart = () => {
    addToCart(product, selectedColor, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product)
  }

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 animate-fade-in-scale border border-[rgb(218_184_105)]/10 hover:border-[rgb(218_184_105)]/30">
      {/* Image Container */}
      <div className="relative h-96 overflow-hidden bg-muted pattern-dots">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent z-5" />
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-[rgb(218_184_105)] to-[rgb(208_174_95)] text-black px-4 py-2 rounded-full text-sm font-bold z-10 font-sans shadow-lg">
            -{discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-3 rounded-full bg-white/95 backdrop-blur hover:bg-white transition-all z-10 shadow-md hover:shadow-lg"
        >
          <Heart
            className={`w-5 h-5 transition-all ${isWishlisted ? "fill-[rgb(218_184_105)] text-[rgb(218_184_105)] scale-110" : "text-foreground"}`}
          />
        </button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-end justify-center opacity-0 group-hover:opacity-100 z-8">
          <div className="mb-6 w-4/5 space-y-3">
            <Button
              size="lg"
              className="w-full bg-[rgb(218_184_105)] hover:bg-[rgb(208_174_95)] text-black font-bold text-base rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-sans"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isAdded ? "Added!" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-[rgb(218_184_105)] rounded-full" />
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-sans font-semibold">
            {product.fabric}
          </p>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-serif font-bold text-foreground line-clamp-2 group-hover:text-[rgb(218_184_105)] transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-[rgb(218_184_105)] text-[rgb(218_184_105)]"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-sans">({product.reviews})</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 pt-2 border-t border-border">
          <p className="text-xl font-bold text-[rgb(218_184_105)] font-serif">₹{product.price.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground line-through font-sans">
            ₹{product.originalPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
