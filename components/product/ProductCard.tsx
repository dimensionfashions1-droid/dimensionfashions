"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Product } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useWishlist } from "@/hooks/use-wishlist"
import { createClient } from "@/lib/supabase/client"

interface ProductCardProps {
    product: Product
    isAuthenticated?: boolean
}

export function ProductCard({ product, isAuthenticated = false }: ProductCardProps) {
    const wishlist = useWishlist()
    const cart = useCart()
    const { toast } = useToast()
    const isWishlisted = wishlist.isInWishlist(product.id)

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        await cart.addToCart(product, {}, 1, isAuthenticated)
        toast({
            title: "Added to Bag",
            description: `${product.title} has been added.`,
        })
    }

    return (
        <div className="group space-y-5">
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

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        if (isWishlisted) {
                            wishlist.removeFromWishlist(product.id, isAuthenticated)
                        } else {
                            wishlist.addToWishlist(product, isAuthenticated)
                        }
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md border border-black/5 shadow-sm flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-md z-10"
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    suppressHydrationWarning
                >
                    <Heart
                        className={cn(
                            "w-4 h-4 transition-all duration-300",
                            isWishlisted
                                ? "fill-accent text-accent scale-110"
                                : "text-primary/60 hover:text-primary"
                        )}
                    />
                </button>

                {/* Action Button — slides up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
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
                            onClick={handleQuickAdd}
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Add to Cart
                        </Button>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-3 px-1">
                <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-primary/40 block">
                        {product.category}
                    </span>
                    <Link href={`/product/${product.slug}`} className="block">
                        <h3 className="font-heading font-normal text-lg text-primary tracking-tight transition-colors group-hover:text-accent line-clamp-1 leading-tight">
                            {product.title}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-[14px] font-sans font-bold text-primary tracking-tight">
                        ₹{product.price.toLocaleString("en-IN")}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <div className="flex items-center gap-2">
                            <p className="text-[11px] font-sans font-medium text-primary/30 line-through">
                                ₹{product.originalPrice.toLocaleString("en-IN")}
                            </p>
                            <span className="text-[10px] font-sans font-extrabold text-accent uppercase tracking-tighter">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
