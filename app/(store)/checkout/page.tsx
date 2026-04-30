"use client"

import Link from "next/link"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"

export default function CheckoutPage() {
    const cart = useCart()
    const router = useRouter()
    const { toast } = useToast()
    const [isMounted, setIsMounted] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [stockError, setStockError] = useState<string | null>(null)

    useEffect(() => {
        setIsMounted(true)
        
        // Wait for cart to be ready
        // If authenticated, we MUST wait for isSynced
        // If not authenticated, we can proceed as soon as mounted (localStorage is sync)
        const isCartReady = cart.isAuthenticated ? cart.isSynced : true

        if (isCartReady) {
            if (cart.items.length === 0) {
                router.push('/cart') // Redirect back to cart instead of products
                return
            }
            setIsValidating(false)
        }
    }, [cart.items, cart.isSynced, cart.isAuthenticated, router])

    if (!isMounted || isValidating) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/40 font-sans">Preparing Secure Checkout...</p>
            </div>
        )
    }

    const subtotal = cart.getTotalPrice()
    const shipping = 0 // Could be dynamic
    const total = subtotal + shipping

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
                                <BreadcrumbLink href="/cart" className="uppercase text-[10px] tracking-[0.2em] text-primary/60 hover:text-primary transition-colors font-sans font-bold">Bag</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-accent/40" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Checkout</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Secure <span>Checkout</span></h1>
                </div>

                {stockError && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-sans font-bold uppercase tracking-wider">
                        <AlertCircle className="w-5 h-5" />
                        {stockError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Section: Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-accent/20 rounded-[2.5rem] p-6 md:p-10 shadow-lg shadow-accent/5">
                            <CheckoutForm cartItems={cart.items} subtotal={subtotal} shippingCost={shipping} totalAmount={total} />
                        </div>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary items={cart.items} subtotal={subtotal} shipping={shipping} />
                    </div>
                </div>
            </div>
        </div>
    )
}
