"use client"

import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WishlistEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center space-y-8 animate-in fade-in duration-700">
            <div className="relative">
                <div className="h-24 w-24 rounded-full bg-accent/5 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-accent/40" />
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white border border-accent/10 flex items-center justify-center shadow-sm">
                    <ShoppingBag className="h-4 w-4 text-accent" />
                </div>
            </div>
            
            <div className="space-y-3 max-w-xs">
                <h2 className="font-heading font-normal text-2xl text-primary uppercase tracking-wide">Your Wishlist is <span className="text-accent">Empty</span></h2>
                <p className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 leading-relaxed px-4">
                    Save your favorite pieces to find them easily later and stay updated on their availability.
                </p>
            </div>

            <Button className="bg-primary text-secondary hover:bg-black font-sans font-bold uppercase tracking-[0.25em] text-[10px] h-14 px-10 rounded-full transition-all duration-500 shadow-xl shadow-primary/10" asChild>
                <Link href="/products">
                    Continue Shopping
                </Link>
            </Button>
        </div>
    )
}
