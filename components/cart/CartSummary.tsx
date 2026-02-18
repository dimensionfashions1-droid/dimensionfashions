"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface CartSummaryProps {
    subtotal: number
    shipping?: number
    discount?: number
}

export function CartSummary({ subtotal, shipping = 0, discount = 0 }: CartSummaryProps) {
    const total = subtotal + shipping - discount

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sticky top-24 space-y-6">
            <h2 className="font-heading font-bold text-xl text-white">Order Summary</h2>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-neutral-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                        <span>Discount</span>
                        <span className="font-medium">-₹{discount.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-neutral-400">
                    <span>Shipping</span>
                    <span className="text-white font-medium">
                        {shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}
                    </span>
                </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="flex justify-between items-end">
                <span className="font-heading font-bold text-lg text-white">Total</span>
                <span className="font-heading font-bold text-2xl text-white">₹{total.toLocaleString()}</span>
            </div>

            <Button className="w-full bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest text-sm h-14 rounded-full" asChild>
                <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>

            <div className="text-center">
                <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors inline-flex items-center gap-2">
                    <ShoppingBag className="h-3 w-3" />
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}
