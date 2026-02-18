"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="h-24 w-24 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
                <ShoppingBag className="h-10 w-10 text-neutral-500" />
            </div>

            <div className="space-y-2">
                <h2 className="font-heading font-bold text-2xl text-white">Your cart is empty</h2>
                <p className="text-neutral-400 max-w-sm mx-auto">
                    Looks like you haven't added anything to your cart yet. Explore our collection to find something you love.
                </p>
            </div>

            <Button className="bg-white text-black hover:bg-neutral-200 font-bold uppercase tracking-widest text-sm h-14 px-10 rounded-full" asChild>
                <Link href="/products">
                    Start Shopping
                </Link>
            </Button>
        </div>
    )
}
