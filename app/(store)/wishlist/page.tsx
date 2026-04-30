"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
import { useWishlist } from "@/hooks/use-wishlist"
import { createClient } from "@/lib/supabase/client"

export default function WishlistPage() {
    const wishlist = useWishlist()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const checkUser = async () => {
            try {
                const supabase = createClient()
                const { data } = await supabase.auth.getUser()
                setIsAuthenticated(!!data?.user)
            } catch (error) {
                console.error("Auth check failed:", error)
                setIsAuthenticated(false)
            }
        }
        checkUser()
    }, [])

    if (!isMounted) return null

    if (wishlist.items.length === 0) {
        return <WishlistEmpty />
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
                    <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Your <span>Wishlist</span></h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-10">
                    {wishlist.items.map((product) => (
                        <ProductCard key={product.id} product={product} isAuthenticated={isAuthenticated} />
                    ))}
                </div>
            </div>
        </div>
    )
}
