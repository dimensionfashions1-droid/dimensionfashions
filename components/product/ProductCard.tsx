"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Product } from "@/types"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false)

    return (
        <div className="group space-y-4">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-primary/5 rounded-2xl">
                <Link href={`/product/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                        unoptimized
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

                {/* Action Button — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    {product.hasVariants ? (
                        <Link href={`/product/${product.slug}`}>
                            <Button
                                size="sm"
                                className="w-full rounded-full bg-primary text-secondary text-[10px] font-sans font-bold uppercase tracking-[0.25em] h-10 transition-all duration-500 hover:bg-black gap-2"
                            >
                                View Product
                            </Button>
                        </Link>
                    ) : (
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
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2.5 text-center px-1">
                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-heading font-normal text-lg text-primary tracking-tight transition-colors group-hover:text-accent line-clamp-1">
                        {product.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-center gap-3">
                    <p className="text-[12px] font-sans font-bold text-primary tracking-widest">
                        ₹{product.price.toLocaleString("en-IN")}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <>
                            <p className="text-[10px] font-sans font-medium text-primary/40 line-through tracking-wider">
                                ₹{product.originalPrice.toLocaleString("en-IN")}
                            </p>
                            <span className="text-[9px] font-sans font-bold text-accent uppercase tracking-tighter">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
