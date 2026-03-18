"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface Product {
    id: string
    title: string
    price: number
    category: string
    image: string
    colors?: string[]
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group space-y-6">
            <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-primary/5 rounded-[1.5rem] shadow-sm group-hover:shadow-xl transition-all duration-700">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                />
                
                {/* Subtle Hover Reveal */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Badge/Tag */}
                <div className="absolute top-5 left-5">
                    <span className="bg-white/90 backdrop-blur-md text-[8px] uppercase tracking-[0.3em] font-sans font-extrabold px-3 py-1.5 text-primary shadow-sm border border-black/5 rounded-full">
                        {product.category}
                    </span>
                </div>
            </Link>

            <div className="space-y-3 text-center">
                <h3 className="font-heading font-normal text-xl text-primary tracking-tight transition-colors group-hover:text-accent">
                    {product.title}
                </h3>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-primary/40">
                        Pure Silk Handwoven
                    </p>
                    <p className="text-[12px] font-sans font-bold text-primary tracking-widest mt-1">
                        ₹{product.price.toLocaleString("en-IN")}
                    </p>
                </div>
            </div>
        </div>
    )
}
