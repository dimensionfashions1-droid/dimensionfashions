"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { QuantitySelector } from "./QuantitySelector"
import { Product } from "./ProductCard"

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

                <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight text-white">
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
                            <span className="font-bold text-white">₹{discountedPrice.toLocaleString()}</span>
                            <span className="text-lg text-neutral-500 line-through decoration-neutral-500">₹{product.price.toLocaleString()}</span>
                            {product.discount && (
                                <Badge className="bg-red-600 hover:bg-red-700 text-white border-0">
                                    -{product.discount}%
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="font-bold text-white">₹{product.price.toLocaleString()}</span>
                    )}
                </div>
            </div>

            <Separator className="bg-neutral-800" />

            {/* Description */}
            <div className="prose prose-invert max-w-none text-neutral-300">
                <p>
                    Engineered for the modern urban landscape. This piece combines functional utility with avant-garde aesthetics.
                    Crafted from premium heavyweight cotton for durability and comfort. Features reinforced stitching and a relaxed fit.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end gap-8">
                {/* Attributes */}
                <div className="flex-1 space-y-6">
                    {product.colors && product.colors.length > 0 && (
                        <div className="space-y-3">
                            <span className="font-heading font-bold uppercase text-sm tracking-widest text-white">Color</span>
                            <div className="flex flex-wrap gap-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center hover:scale-110 ${selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 border-transparent' : 'border-neutral-700'}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        aria-label={`Select ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-3">
                            <span className="font-heading font-bold uppercase text-sm tracking-widest text-white">Size</span>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-10 min-w-[3rem] px-3 border rounded-lg font-medium transition-all uppercase ${selectedSize === size ? 'bg-white text-black border-white' : 'border-neutral-800 text-neutral-400 hover:border-white hover:text-white'}`}
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
                        <span className="font-heading font-bold uppercase text-sm tracking-widest text-white">Quantity</span>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    </div>

                    <div className="flex gap-4">
                        <Button
                            className="flex-1 h-14 bg-white hover:bg-neutral-200 text-black rounded-full uppercase tracking-widest font-bold text-sm"
                            onClick={onAddToCart}
                            disabled={!product.inStock}
                        >
                            <ShoppingBag className="w-5 h-5 mr-3" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-14 w-14 rounded-full border-neutral-800 text-white hover:bg-white hover:text-black transition-colors bg-transparent"
                        >
                            <Heart className="w-5 h-5" />
                            <span className="sr-only">Add to Wishlist</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center text-center p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <Truck className="w-6 h-6 mb-2 text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">Free Shipping</span>
                    <span className="text-[10px] text-neutral-500 mt-1">On orders over ₹999</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <ShieldCheck className="w-6 h-6 mb-2 text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">Secure Payment</span>
                    <span className="text-[10px] text-neutral-500 mt-1">100% encrypted</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-neutral-900 rounded-xl border border-neutral-800">
                    <RefreshCw className="w-6 h-6 mb-2 text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">Easy Returns</span>
                    <span className="text-[10px] text-neutral-500 mt-1">14 day policy</span>
                </div>
            </div>
        </div>
    )
}
