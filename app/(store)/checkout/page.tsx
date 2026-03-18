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
        productId: "prod-1",
        title: "Regal Kanjivaram Silk",
        price: 24999,
        image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=800",
        quantity: 1,
        size: "Standard",
        color: "Maroon"
    },
    {
        id: "2",
        productId: "prod-2",
        title: "Handwoven Banarasi Zari",
        price: 18999,
        image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=800",
        quantity: 1,
        size: "Standard",
        color: "Royal Blue"
    }
]

export default function CheckoutPage() {
    // Calculate subtotal
    const subtotal = MOCK_CART_ITEMS.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Breadcrumb className="mb-4">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-xs tracking-widest text-neutral-400 hover:text-white transition-colors">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-neutral-600" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/cart" className="uppercase text-xs tracking-widest text-neutral-400 hover:text-white transition-colors">Cart</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-neutral-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-xs tracking-widest font-bold text-white">Checkout</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="font-heading font-bold text-3xl md:text-4xl text-white">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Section: Checkout Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 md:p-8 backdrop-blur-sm">
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
