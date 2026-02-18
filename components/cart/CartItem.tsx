"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CartItem as CartItemType } from "@/types"

interface CartItemProps {
    item: CartItemType
    onUpdateQuantity: (id: string, quantity: number) => void
    onRemove: (id: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="flex gap-6 p-6 bg-neutral-900 border border-neutral-800 rounded-xl transition-all duration-300 hover:border-neutral-700 group">
            {/* Image */}
            <div className="relative aspect-[3/4] w-28 sm:w-36 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-3">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-white leading-tight">
                            <Link href={`/product/${item.productId}`} className="hover:text-neutral-300 transition-colors">
                                {item.title}
                            </Link>
                        </h3>

                        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                            {item.size && (
                                <div className="flex items-center gap-2">
                                    <span className="font-heading font-bold uppercase text-xs tracking-widest text-neutral-500">Size</span>
                                    <span className="text-white font-medium">{item.size}</span>
                                </div>
                            )}
                            {item.color && (
                                <div className="flex items-center gap-2">
                                    <span className="font-heading font-bold uppercase text-xs tracking-widest text-neutral-500">Color</span>
                                    <span className="text-white font-medium">{item.color}</span>
                                </div>
                            )}
                            {item.variant && (
                                <p className="text-xs">{item.variant}</p>
                            )}
                        </div>
                    </div>
                    <p className="font-bold text-white text-xl">
                        ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                    {/* Quantity Selector - Styled like ProductInfo */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-neutral-900 rounded-full px-1 py-1 border border-neutral-800">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
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
                        className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors h-9 px-3 rounded-full"
                        onClick={() => onRemove(item.id)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">Remove</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
