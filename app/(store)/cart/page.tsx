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
import { CartItem } from "@/components/cart/CartItem"
import { CartSummary } from "@/components/cart/CartSummary"
import { EmptyCart } from "@/components/cart/EmptyCart"
import { useCart } from "@/hooks/use-cart"
import { createClient } from "@/lib/supabase/client"

import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CartPage() {
    const cart = useCart()
    const { toast } = useToast()
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

    // Show loading state while syncing or checking initial auth
    const isLoading = isAuthenticated && !cart.isSynced

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pt-10 pb-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    {/* Skeleton Header */}
                    <div className="mb-12 border-b border-primary/10 pb-8">
                        <div className="flex gap-2 mb-6">
                            <Skeleton className="h-3 w-12 bg-primary/10 rounded-full" />
                            <div className="h-3 w-4 flex items-center justify-center text-primary/10">/</div>
                            <Skeleton className="h-3 w-20 bg-primary/10 rounded-full" />
                        </div>
                        <Skeleton className="h-12 w-64 bg-primary/20 rounded-lg" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Skeleton Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 p-4 border border-primary/5 rounded-2xl">
                                    <Skeleton className="w-24 h-32 md:w-32 md:h-40 bg-primary/5 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 space-y-4 py-2">
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-24 bg-primary/10" />
                                            <Skeleton className="h-6 w-full md:w-64 bg-primary/20" />
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton className="h-4 w-12 bg-primary/10" />
                                            <Skeleton className="h-4 w-12 bg-primary/10" />
                                        </div>
                                        <div className="flex justify-between items-end pt-4">
                                            <Skeleton className="h-8 w-24 bg-primary/10 rounded-full" />
                                            <Skeleton className="h-6 w-16 bg-primary/20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Skeleton Summary */}
                        <div className="lg:col-span-1">
                            <div className="p-8 border border-primary/5 rounded-3xl space-y-6">
                                <Skeleton className="h-6 w-32 bg-primary/20" />
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20 bg-primary/10" />
                                        <Skeleton className="h-4 w-16 bg-primary/10" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20 bg-primary/10" />
                                        <Skeleton className="h-4 w-16 bg-primary/10" />
                                    </div>
                                    <div className="h-px bg-primary/5 my-2" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-6 w-20 bg-primary/20" />
                                        <Skeleton className="h-6 w-24 bg-primary/20" />
                                    </div>
                                </div>
                                <Skeleton className="h-14 w-full bg-primary rounded-full mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-20">
                <EmptyCart />
            </div>
        )
    }

    // Subtotal and stock are now driven entirely by the hydrated cart items from the API
    const subtotal = cart.getTotalPrice()
    const hasOutOfStockItems = cart.items.some(item => {
        const anyItem = item as any
        return anyItem.inStock === false || (anyItem.stockCount !== undefined && anyItem.stockCount < item.quantity)
    })

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        cart.updateQuantity(id, newQuantity, isAuthenticated)
    }

    const handleRemoveItem = (id: string) => {
        cart.removeFromCart(id, isAuthenticated)
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
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Shopping Bag</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Shopping <span>Bag</span></h1>
                        {hasOutOfStockItems && (
                            <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-full flex items-center gap-2 text-red-600 text-[10px] font-sans font-bold uppercase tracking-widest animate-pulse">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Some items are currently unavailable
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Section: Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => {
                            const anyItem = item as any
                            const isAvailable = anyItem.inStock !== false && (anyItem.stockCount === undefined || anyItem.stockCount >= item.quantity)
                            
                            return (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                    isOutOfStock={!isAvailable}
                                />
                            )
                        })}
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary 
                            subtotal={subtotal} 
                            shipping={0} 
                            disabled={hasOutOfStockItems} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
