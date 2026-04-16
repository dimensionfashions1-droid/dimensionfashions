"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { QuantitySelector } from "./QuantitySelector"
import { Product } from "@/types"

interface ProductInfoProps {
    product: Product
    onAddToCart: () => void
    quantity: number
    setQuantity: (q: number) => void
    selectedColor?: string
    setSelectedColor: (c: string) => void
    selectedSize?: string
    setSelectedSize: (s: string) => void
}

export function ProductInfo({
    product,
    onAddToCart,
    quantity,
    setQuantity,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize
}: ProductInfoProps) {
    const discountedPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : null

    const handleIncrease = () => setQuantity(quantity + 1)
    const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1)

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium tracking-widest text-neutral-400 uppercase">
                        {product.category}
                    </span>
                    {product.inStock ? (
                        <Badge variant="outline" className="border-green-600 text-green-500 uppercase tracking-wider text-[10px]">
                            In Stock
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="border-neutral-800 text-neutral-500 uppercase tracking-wider text-[10px]">
                            Out of Stock
                        </Badge>
                    )}
                </div>

                <h1 className="font-heading text-4xl md:text-5xl font-normal leading-tight text-primary">
                    {product.title}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < (product.rating || 0) ? 'fill-current' : 'text-neutral-600'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-neutral-400 underline decoration-neutral-600 underline-offset-4">
                        128 Reviews
                    </span>
                </div>

                <div className="flex items-center gap-4 text-2xl">
                    {discountedPrice ? (
                        <>
                            <span className="font-bold text-primary">₹{discountedPrice.toLocaleString()}</span>
                            <span className="text-lg text-primary/40 line-through decoration-primary/40">₹{product.price.toLocaleString()}</span>
                            {product.discount && (
                                <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">
                                    -{product.discount}%
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="font-bold text-primary">₹{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>

            <Separator className="bg-primary/5" />

            {/* Description */}
            <div className="prose prose-neutral max-w-none text-primary/60">
                <p>
                    {product.description || "Engineered for the modern urban landscape. This piece combines functional utility with avant-garde aesthetics. Crafted from premium materials for durability and comfort."}
                </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end gap-8">
                {/* Attributes */}
                <div className="flex-1 space-y-6">
                    {product.colors && product.colors.length > 0 && (
                        <div className="space-y-3">
                            <span className="font-heading font-normal uppercase text-[10px] tracking-[0.25em] text-primary">Color</span>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center hover:scale-110 ${selectedColor === color ? 'ring-2 ring-accent ring-offset-2 border-transparent' : 'border-primary/10'}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        aria-label={`Select ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-3">
                            <span className="font-heading font-normal uppercase text-[10px] tracking-[0.25em] text-primary">Size</span>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 min-w-[4rem] px-4 border rounded-none font-sans font-bold text-[10px] tracking-widest transition-all uppercase ${selectedSize === size ? 'bg-primary text-secondary border-primary' : 'border-primary/10 text-primary/60 hover:border-primary hover:text-primary'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex-1 space-y-6 w-full">
                    <div className="flex items-center gap-6">
                        <span className="font-heading font-normal uppercase text-[10px] tracking-[0.25em] text-primary">Quantity</span>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            className="flex-1 h-14 bg-primary hover:bg-black text-secondary rounded-full uppercase tracking-[0.25em] font-sans font-bold text-[10px] transition-all duration-500"
                            onClick={onAddToCart}
                            disabled={!product.inStock}
                        >
                            <ShoppingBag className="w-4 h-4 mr-3" />
                            {product.inStock ? 'Add to Bag' : 'Out of Stock'}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-full border-primary/10 text-primary hover:bg-primary hover:text-secondary transition-all duration-500 bg-transparent flex-shrink-0"
                        >
                            <Heart className={cn("w-5 h-5", product.inStock ? "" : "opacity-50")} />
                            <span className="sr-only">Add to Wishlist</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-primary">
                <div className="flex flex-col items-center text-center p-6 bg-accent/5 rounded-2xl border border-primary/5 group hover:bg-accent/10 transition-colors duration-500">
                    <Truck className="w-6 h-6 mb-3 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Free Shipping</span>
                    <span className="text-[9px] text-primary/40 mt-1 uppercase tracking-widest font-sans">On orders over ₹999</span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-accent/5 rounded-2xl border border-primary/5 group hover:bg-accent/10 transition-colors duration-500">
                    <ShieldCheck className="w-6 h-6 mb-3 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Secure Payment</span>
                    <span className="text-[9px] text-primary/40 mt-1 uppercase tracking-widest font-sans">100% encrypted</span>
                </div>
                <div className="flex flex-col items-center text-center p-6 bg-accent/5 rounded-2xl border border-primary/5 group hover:bg-accent/10 transition-colors duration-500">
                    <RefreshCw className="w-6 h-6 mb-3 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Easy Returns</span>
                    <span className="text-[9px] text-primary/40 mt-1 uppercase tracking-widest font-sans">14 day policy</span>
                </div>
            </div>
        </div>
    )
}
