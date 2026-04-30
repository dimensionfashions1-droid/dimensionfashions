"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/types"

interface OrderSummaryProps {
    items: CartItem[]
    subtotal: number
    shipping?: number
    discount?: number
}

export function OrderSummary({ items, subtotal, shipping = 0, discount = 0 }: OrderSummaryProps) {
    const total = subtotal + shipping - discount

    return (
        <div className="bg-accent/10 border border-accent/5 rounded-[2.5rem] p-8 md:p-10 sticky top-28 space-y-8 shadow-sm shadow-accent/5">
            <h2 className="font-heading font-medium text-2xl text-primary uppercase tracking-[0.1em]">Order Summary</h2>

            {/* Scrollable list of items if many */}
            {/* Scrollable list of items if many */}
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-5 items-start">
                        <div className="relative h-20 w-16 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-primary/5">
                            <Image
                                src={item.image || '/placeholder.jpg'}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-primary text-secondary text-[9px] border-0 font-bold shadow-md">
                                {item.quantity}
                            </Badge>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1 py-1">
                            <p className="text-[11px] font-sans font-bold text-primary uppercase tracking-widest truncate leading-tight">{item.title}</p>
                            <div className="flex flex-wrap gap-3 text-[9px] uppercase tracking-[0.1em] text-primary/40 font-bold font-sans">
                                {item.selectedAttributes?.size && (
                                    <span>{item.selectedAttributes.size}</span>
                                )}
                                {item.selectedAttributes?.color && (
                                    <span>
                                        {item.selectedAttributes.size ? "• " : ""}
                                        {item.selectedAttributes.color}
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="text-[11px] font-sans font-bold text-primary py-1 tracking-widest">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                ))}
            </div>

            <Separator className="bg-primary/10" />

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
                {shipping !== 0 && (
                    <div className="flex justify-between text-primary/50">
                        <span>Shipping</span>
                        <span className="text-primary uppercase">
                            ₹{shipping.toLocaleString("en-IN")}
                        </span>
                    </div>
                )}
            </div>

            <Separator className="bg-primary/10" />

            <div className="flex justify-between items-end pt-2">
                <span className="font-heading font-semibold text-[16px] text-primary/90 uppercase tracking-[0.2em]">Total Amount</span>
                <span className="font-sans font-semibold text-xl text-accent tracking-tighter">₹{total.toLocaleString("en-IN")}</span>
            </div>
        </div>
    )
}
