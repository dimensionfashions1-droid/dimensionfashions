"use client"

import { useState } from "react"
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
import { CartItem as CartItemType } from "@/types"

// Temporary mock data for cart items
const MOCK_CART_ITEMS: CartItemType[] = [
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

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItemType[]>(MOCK_CART_ITEMS)

    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    // Handler to update quantity
    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ))
    }

    // Handler to remove item
    const handleRemoveItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id))
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 md:py-20">
                <EmptyCart />
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
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Shopping Bag</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="font-heading font-normal text-2xl md:text-4xl text-primary uppercase tracking-[0.05em]">Shopping <span>Bag</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Left Section: Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </div>

                    {/* Right Section: Order Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary subtotal={subtotal} shipping={0} />
                    </div>
                </div>
            </div>
        </div>
    )
}
