"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

export interface Product {
    id: string
    title: string
    price: number
    category: string
    image: string
    colors?: string[]
    discount?: number
    rating?: number
    inStock?: boolean
    description?: string
    sizes?: string[]
}

interface ProductCardProps {
    product: Product
}

const DEFAULT_COLORS = [
    { name: "Maroon", value: "#6B1D2A" },
    { name: "Navy", value: "#1B2A4A" },
    { name: "Emerald", value: "#1B4332" },
    { name: "Gold", value: "#B8860B" },
]

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [selectedColor, setSelectedColor] = useState(0)

    const colors = product.colors
        ? product.colors.map((c, i) => ({ name: c, value: c }))
        : DEFAULT_COLORS

    return (
        <div className="group space-y-4">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-primary/5 rounded-2xl">
                <Link href={`/product/${product.id}`} className="block w-full h-full">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-md text-[8px] uppercase tracking-[0.3em] font-sans font-extrabold px-3 py-1.5 text-primary shadow-sm border border-black/5 rounded-full">
                        {product.category}
                    </span>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        setIsWishlisted(!isWishlisted)
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/5 shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-md"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    suppressHydrationWarning
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-all duration-300",
                            isWishlisted
                                ? "fill-red-500 text-red-500 scale-110"
                                : "text-primary/60 hover:text-primary"
                        )}
                    />
                </button>

                {/* Add to Cart — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <Button
                        size="sm"
                        className="w-full rounded-full bg-primary text-secondary text-[10px] font-sans font-bold uppercase tracking-[0.25em] h-10 transition-all duration-500 hover:bg-black gap-2"
                        onClick={(e) => {
                            e.preventDefault()
                            // TODO: Add to cart logic
                        }}
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2.5 text-center px-1">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-heading font-normal text-lg text-primary tracking-tight transition-colors group-hover:text-accent line-clamp-1">
                        {product.title}
                    </h3>
                </Link>

                <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-primary/80">
                    {product.category}
                </p>

                {/* Color Selector */}
                <div className="flex items-center justify-center gap-1.5 py-1">
                    {colors.slice(0, 4).map((color, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedColor(index)}
                            className={cn(
                                "w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-125",
                                selectedColor === index
                                    ? "border-primary/60 scale-110"
                                    : "border-transparent"
                            )}
                            style={{ backgroundColor: color.value }}
                            aria-label={`Select ${color.name}`}
                            suppressHydrationWarning
                        />
                    ))}
                </div>

                <p className="text-[12px] font-sans font-bold text-primary tracking-widest">
                    ₹{product.price.toLocaleString("en-IN")}
                </p>
            </div>
        </div>
    )
}
