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
import { CheckoutForm } from "@/components/checkout/CheckoutForm"
import { OrderSummary } from "@/components/checkout/OrderSummary"
import { CartItem } from "@/types"

// Temporary mock data for checkout items (should come from same source/context as cart)
const MOCK_CART_ITEMS: CartItem[] = [
    {
        id: "1",
        productId: "1",
        title: "Midnight Bloom Kanjivaram",
        price: 18499,
        image: "https://www.sourcesplash.com/i/random?q=kanjivaram-saree,indian-model&w=1200&h=1600",
        quantity: 1,
        size: "Standard",
        color: "Maroon"
    },
    {
        id: "2",
        productId: "2",
        title: "Zari Weave Lehenga",
        price: 24999,
        image: "https://www.sourcesplash.com/i/random?q=lehenga,indian-wedding,bridal&w=1200&h=1600",
        quantity: 1,
        size: "Standard",
        color: "Gold"
    }
]

export default function CheckoutPage() {
    // Calculate subtotal
    const subtotal = MOCK_CART_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0)

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
                    <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Secure <span className="italic">Checkout</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Section: Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-accent/20 rounded-[2.5rem] p-6 md:p-10 shadow-lg shadow-accent/5">
                            <CheckoutForm />
                        </div>
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary items={MOCK_CART_ITEMS} subtotal={subtotal} shipping={0} />
                    </div>
                </div>
            </div>
        </div>
    )
}
