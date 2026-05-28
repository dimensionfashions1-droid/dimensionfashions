"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "./QuantitySelector"
import { RichTextRenderer } from "@/components/ui/rich-text-renderer"
import { Product } from "@/types"
import { useWishlist } from "@/hooks/use-wishlist"

interface ProductInfoProps {
    product: Product
    onAddToCart: (attributes: Record<string, string>) => Promise<void> | void
    quantity: number
    setQuantity: (q: number) => void
    selectedColor?: string
    setSelectedColor: (c: string) => void
    selectedSize?: string
    setSelectedSize: (s: string) => void
    isAuthenticated: boolean
}

export function ProductInfo({
    product,
    onAddToCart,
    quantity,
    setQuantity,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    isAuthenticated
}: ProductInfoProps) {
    const router = useRouter()
    const wishlist = useWishlist()
    const isWishlisted = wishlist.isInWishlist(product.id)
    const [isRedirecting, setIsRedirecting] = useState(false)

    const handleIncrease = () => setQuantity(quantity + 1)
    const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1)

    const hasDiscount = product.originalPrice && product.originalPrice > product.price
    const discountPercentage = hasDiscount
        ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
        : null

    const handleAddToCart = async () => {
        const attributes: Record<string, string> = {}
        if (selectedColor) attributes.color = selectedColor
        if (selectedSize) attributes.size = selectedSize

        await onAddToCart(attributes)
    }

    const handleBuyNow = async () => {
        if (!product.inStock) return
        setIsRedirecting(true)

        const attributes: Record<string, string> = {}
        if (selectedColor) attributes.color = selectedColor
        if (selectedSize) attributes.size = selectedSize

        await onAddToCart(attributes)
        router.push('/checkout')
    }

    const toggleWishlist = () => {
        if (isWishlisted) {
            wishlist.removeFromWishlist(product.id)
        } else {
            wishlist.addToWishlist(product)
        }
    }

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-[0.4em] text-accent uppercase font-sans">
                        {product.category}
                    </span>
                    <div className="h-px flex-1 bg-primary/5" />
                    {product.inStock ? (
                        <span className="text-[9px] text-green-600 font-bold uppercase tracking-[0.2em] font-sans px-2 py-1 rounded bg-green-50">
                            In Stock
                        </span>
                    ) : (
                        <span className="text-[9px] text-primary/40 font-bold uppercase tracking-[0.2em] font-sans px-2 py-1 rounded bg-gray-50">
                            Out of Stock
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <h1 className="font-heading text-4xl md:text-5xl font-normal leading-[1.1] text-primary tracking-tight">
                        {product.title}
                    </h1>
                </div>

                <div className="flex items-center gap-5 pt-4">
                    <span className="text-3xl font-heading font-normal text-primary tracking-tight">₹{product.price.toLocaleString()}</span>
                    {hasDiscount && (
                        <div className="flex items-center gap-3">
                            <span className="text-lg text-primary/30 line-through font-sans">₹{product.originalPrice?.toLocaleString()}</span>
                            <span className="bg-accent/10 text-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 font-bold font-sans rounded-full">
                                {discountPercentage}% OFF
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="border-l-2 border-accent/20 pl-6 ">
                {product.description ? (
                    <RichTextRenderer content={product.description} />
                ) : (
                    <div className="max-w-none text-primary/70 leading-relaxed font-sans text-sm">
                        Engineered for the modern urban landscape. This piece combines functional utility with avant-garde aesthetics. Crafted from premium materials for durability and comfort.
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-10">
                {/* Attributes */}
                <div className="space-y-10">
                    {product.colors && product.colors.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-primary">Select Palette</span>
                                <span className="text-[10px] font-bold text-primary/40 font-sans uppercase tracking-widest">{selectedColor}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {(product.colorOptions || product.colors?.map(c => ({ name: c, hex: c.toLowerCase() })) || []).map((colorOpt) => (
                                    <button
                                        key={colorOpt.name}
                                        onClick={() => setSelectedColor(colorOpt.name)}
                                        className={cn(
                                            "w-10 h-10 rounded-full border transition-all duration-500 flex items-center justify-center hover:scale-110",
                                            selectedColor === colorOpt.name ? 'ring-2 ring-primary ring-offset-4 border-transparent' : 'border-primary/10'
                                        )}
                                        style={{ backgroundColor: colorOpt.hex }}
                                        aria-label={`Select ${colorOpt.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-primary">Select Size</span>
                                <span className="text-[10px] font-bold text-primary/40 font-sans underline cursor-pointer hover:text-primary transition-colors uppercase tracking-widest">Size Guide</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={cn(
                                            "h-14 min-w-[5rem] px-6 border rounded-xl font-sans font-bold text-[11px] tracking-widest transition-all duration-500 uppercase",
                                            selectedSize === size
                                                ? "bg-primary text-secondary border-primary shadow-xl shadow-black/10 scale-105"
                                                : "border-primary/10 text-primary/60 hover:border-primary hover:text-primary"
                                        )}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-8 pt-4">
                    <div className="flex items-center gap-10">
                        <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-primary">Quantity</span>
                        <QuantitySelector
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button
                            className="w-full h-16 bg-black hover:bg-zinc-900 text-white rounded-full uppercase tracking-[0.3em] font-sans font-bold text-[11px] transition-all duration-500 shadow-2xl shadow-black/20"
                            onClick={handleBuyNow}
                            disabled={!product.inStock || isRedirecting}
                        >
                            {isRedirecting ? <Loader2 className="w-4 h-4 mr-4 animate-spin" /> : null}
                            {product.inStock ? (isRedirecting ? 'Redirecting...' : 'Buy Now') : 'Out of Stock'}
                        </Button>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                className="flex-1 h-16 border-primary/20 hover:border-primary text-primary rounded-full uppercase tracking-[0.3em] font-sans font-bold text-[11px] transition-all duration-500"
                                onClick={handleAddToCart}
                                disabled={!product.inStock || isRedirecting}
                            >
                                <ShoppingBag className="w-4 h-4 mr-4" />
                                {product.inStock ? 'Add to Bag' : 'Out of Stock'}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-16 w-16 rounded-full border-primary/10 text-primary hover:bg-black hover:text-accent transition-all duration-500 bg-transparent flex-shrink-0"
                                onClick={toggleWishlist}
                            >
                                <Heart className={cn("w-5 h-5", isWishlisted ? "fill-accent text-accent" : "")} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
