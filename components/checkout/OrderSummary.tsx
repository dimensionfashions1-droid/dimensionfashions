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
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 sticky top-24 space-y-6">
            <h2 className="font-heading font-bold text-xl text-white">Order Summary</h2>

            {/* Scrollable list of items if many */}
            {/* Scrollable list of items if many */}
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start group">
                        <div className="relative h-20 w-16 flex-shrink-0 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                            />
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-white text-black text-[10px] border-0 font-bold">
                                {item.quantity}
                            </Badge>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-bold text-white truncate leading-tight">{item.title}</p>
                            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                                {item.size && <span>Size: <span className="text-neutral-300">{item.size}</span></span>}
                                {item.color && <span>Color: <span className="text-neutral-300">{item.color}</span></span>}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <Separator className="bg-neutral-800" />

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
        </div>
    )
}
