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
        productId: "prod-1",
        title: "Oversized Heavyweight T-Shirt",
        price: 1499,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
        quantity: 1,
        size: "L",
        color: "Black"
    },
    {
        id: "2",
        productId: "prod-2",
        title: "Tactical Cargo Pants",
        price: 2999,
        image: "https://images.unsplash.com/photo-1517445312882-fa99b53d13ee?q=80&w=1780&auto=format&fit=crop",
        quantity: 2,
        size: "32",
        color: "Olive"
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
                                <BreadcrumbPage className="uppercase text-xs tracking-widest font-bold text-white">Cart</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="font-heading font-bold text-3xl md:text-4xl text-white">Shopping Cart</h1>
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
