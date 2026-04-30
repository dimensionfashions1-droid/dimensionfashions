"use client"

import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CartSummaryProps {
    subtotal: number
    shipping?: number
    discount?: number
    disabled?: boolean
}

export function CartSummary({ subtotal, shipping = 0, discount = 0, disabled = false }: CartSummaryProps) {
    const total = subtotal + shipping - discount

    return (
        <div className="bg-accent/10 border border-accent/5 rounded-[2.5rem] p-8 md:p-10 sticky top-28 space-y-8 shadow-sm shadow-accent/5">
            <h2 className="font-heading font-medium text-2xl text-primary uppercase tracking-[0.1em]">Order Summary</h2>

            <div className="space-y-5 text-[12px] font-sans font-bold uppercase tracking-[0.2em]">
                <div className="flex justify-between text-primary/50">
                    <span>Subtotal</span>
                    <span className="text-primary text-[14px]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-accent">
                        <span>Discount</span>
                        <span className="">-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                )}
                {shipping !== 0 && (<div className="flex justify-between text-primary/50">
                    <span>Shipping</span>
                    <span className="text-primary uppercase">
                        ₹{shipping.toLocaleString("en-IN")}
                    </span>
                </div>)}
            </div>

            <Separator className="bg-primary/10" />

            <div className="flex justify-between items-end pt-2">
                <span className="font-heading font-semibold text-[16px] text-primary/90 uppercase tracking-[0.2em]">Total Amount</span>
                <span className="font-sans font-semibold text-xl text-accent tracking-tighter">₹{total.toLocaleString("en-IN")}</span>
            </div>

            <Button 
                className={cn(
                    "w-full font-sans font-bold uppercase tracking-[0.3em] text-[12px] h-14 rounded-full transition-all duration-500 shadow-lg",
                    disabled 
                        ? "bg-primary/20 text-primary/40 cursor-not-allowed shadow-none" 
                        : "bg-accent text-white hover:bg-accent/90 shadow-accent/20"
                )} 
                asChild={!disabled}
                disabled={disabled}
            >
                {disabled ? (
                    <span className="flex items-center gap-2">
                         Checkout Restricted
                    </span>
                ) : (
                    <Link href="/checkout">
                        Checkout Now
                        <ArrowRight className="ml-3 h-3.5 w-3.5" />
                    </Link>
                )}
            </Button>

            <div className="text-center">
                <Link href="/products" className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-accent transition-all duration-300 inline-flex items-center gap-2 group/shopping">
                    <ShoppingBag className="h-3.5 w-3.5 group-hover/shopping:scale-110 transition-transform" />
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}
