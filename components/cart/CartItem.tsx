"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CartItem as CartItemType } from "@/types"

interface CartItemProps {
    item: CartItemType
    onUpdateQuantity: (id: string, quantity: number) => void
    onRemove: (id: string) => void
    isOutOfStock?: boolean
}

export function CartItem({ item, onUpdateQuantity, onRemove, isOutOfStock }: CartItemProps) {
    return (
        <div className={cn(
            "flex gap-6 p-6 bg-white border rounded-2xl transition-all duration-300 group relative",
            isOutOfStock 
                ? "border-red-100 bg-red-50/30 opacity-70" 
                : "border-primary/5 hover:border-accent/20"
        )}>
            {isOutOfStock && (
                <div className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[7px] font-sans font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm shadow-lg">
                    Unavailable
                </div>
            )}
            {/* Image */}
            <div className="relative aspect-[3/4] w-28 sm:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-primary/5">
                <Image
                    src={item.image || '/placeholder.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-3">
                        <h3 className="font-heading font-normal text-lg sm:text-xl text-primary tracking-tight leading-tight">
                            <Link href={`/product/${item.slug || item.productId}`} className="hover:text-accent transition-colors">
                                {item.title}
                            </Link>
                        </h3>

                        <div className="flex flex-wrap gap-6 text-sm">
                            {item.selectedAttributes && Object.entries(item.selectedAttributes).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-1">
                                    <span className="font-sans font-bold uppercase text-[9px] tracking-[0.2em] text-primary/40">{key}</span>
                                    <span className="text-primary font-sans font-bold text-xs uppercase tracking-wider">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="font-sans font-bold text-primary text-lg tracking-widest">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                    {/* Quantity Selector - Styled like ProductInfo */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white rounded-full px-1 py-1 border border-primary/10">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-primary/5 text-primary"
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-xs font-bold font-sans text-primary">{item.quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-primary/5 text-primary"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary/40 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 h-9 px-4 rounded-full group/remove"
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5 mr-2 group-hover/remove:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-sans">Remove</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
