"use client"

import { useState } from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductCard } from "@/components/product/ProductCard"
import { WishlistEmpty } from "@/components/product/WishlistEmpty"
import { Product } from "@/components/product/ProductCard"

// Mock Data for Wishlist
const MOCK_WISHLIST_ITEMS: Product[] = [
    {
        id: "1",
        title: "Midnight Bloom Kanjivaram",
        price: 18499,
        category: "Sarees",
        image: "https://www.sourcesplash.com/i/random?q=kanjivaram-saree,indian-model&w=1200&h=1600",
        inStock: true,
        colors: ["Maroon", "Gold"],
        sizes: ["Standard"]
    },
    {
        id: "3",
        title: "Pastel Kurta Set",
        price: 4999,
        category: "Kurta Sets",
        image: "https://www.sourcesplash.com/i/random?q=kurti,set,indian-fashion&w=1200&h=1600",
        inStock: true,
        colors: ["Ivory", "Emerald"],
        sizes: ["XS", "S", "M", "L", "XL"]
    }
]

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<Product[]>(MOCK_WISHLIST_ITEMS)

    if (wishlistItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-20 lg:py-32">
                <WishlistEmpty />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pt-10 pb-20">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-12 border-b border-primary/10 pb-8">
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[10px] tracking-[0.2em] text-primary/60 hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-accent/40" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Wishlist</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Your <span className="italic text-accent">Wishlist</span></h1>
                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40">{wishlistItems.length} exquisite pieces saved</p>
                        </div>
                    </div>
                </div>

                {/* Wishlist Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {wishlistItems.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
