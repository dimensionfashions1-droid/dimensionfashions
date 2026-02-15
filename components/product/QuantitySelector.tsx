"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
    quantity: number
    onIncrease: () => void
    onDecrease: () => void
}

export function QuantitySelector({ quantity, onIncrease, onDecrease }: QuantitySelectorProps) {
    return (
        <div className="flex items-center border border-neutral-800 rounded-full w-fit">
            <Button
                variant="ghost"
                size="icon"
                onClick={onDecrease}
                disabled={quantity <= 1}
                className="rounded-l-full h-10 w-10 hover:bg-neutral-800 text-white hover:text-white disabled:opacity-30"
            >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-10 text-center font-medium text-sm text-white">{quantity}</span>
            <Button
                variant="ghost"
                size="icon"
                onClick={onIncrease}
                className="rounded-r-full h-10 w-10 hover:bg-neutral-800 text-white hover:text-white"
            >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
            </Button>
        </div>
    )
}
