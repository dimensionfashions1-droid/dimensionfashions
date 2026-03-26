"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-10">
            <div className="h-32 w-32 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 relative">
                <ShoppingBag className="h-12 w-12 text-primary/20" />
                <div className="absolute inset-0 bg-accent/5 rounded-full animate-ping opacity-20" />
            </div>

            <div className="space-y-4">
                <h2 className="font-heading font-normal text-3xl text-primary uppercase tracking-widest">Your Bag is <span className="italic">Empty</span></h2>
                <p className="text-primary/60 max-w-sm mx-auto font-sans font-medium text-sm leading-relaxed tracking-wide">
                    The prompt for elegance awaits within our curated collections. Discover pieces that speak your style.
                </p>
            </div>

            <Button className="bg-primary text-secondary hover:bg-black font-sans font-bold uppercase tracking-[0.25em] text-[10px] h-14 px-12 rounded-full transition-all duration-500 shadow-xl shadow-primary/5" asChild>
                <Link href="/products">
                    Start Shopping
                </Link>
            </Button>
        </div>
    )
}
