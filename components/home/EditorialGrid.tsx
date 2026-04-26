"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Product } from "@/types"

const GRID_LAYOUTS: Record<number, string[]> = {
    1: ["md:col-span-12 h-[500px]"],
    2: ["md:col-span-8 h-[500px]", "md:col-span-4 h-[500px]"],
    3: ["md:col-span-6 md:row-span-2 h-[500px] md:h-full", "md:col-span-6 h-[240px]", "md:col-span-6 h-[240px]"],
    4: ["md:col-span-4 md:row-span-2 h-[500px] md:h-full", "md:col-span-8 h-[240px] md:h-[300px]", "md:col-span-4 h-[240px] md:h-[276px]", "md:col-span-4 h-[240px] md:h-[276px]"],
    5: ["md:col-span-4 md:row-span-2 h-[500px] md:h-full", "md:col-span-4 h-[240px]", "md:col-span-4 h-[240px]", "md:col-span-4 h-[240px]", "md:col-span-4 h-[240px]"]
};

export function EditorialGrid() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLatest = async () => {
            try {
                const res = await fetch('/api/products?limit=5&sort=newest')
                const data = await res.json()
                if (data.data) {
                    setProducts(data.data)
                }
            } catch (error) {
                console.error("Error fetching editorial products:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchLatest()
    }, [])

    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (products.length === 0) return null

    const layout = GRID_LAYOUTS[products.length] || GRID_LAYOUTS[4]

    return (
        <section className="py-8 md:py-15 bg-accent/10">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col mb-10 text-left space-y-3">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                        Just In
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                        Latest <span>Arrivals</span>
                    </h2>
                </div>

                {/* Asymmetric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:min-h-[600px]">
                    {products.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/product/${item.slug}`}
                            className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-700 ${layout[index]}`}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                unoptimized
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity" />

                            {/* Content - Always Visible */}
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-accent font-sans font-bold uppercase tracking-[0.2em] block mb-2">
                                        {item.category}
                                    </span>
                                    <h3 className={`font-heading ${index === 0 ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"} leading-tight line-clamp-2`}>
                                        {item.title}
                                    </h3>
                                    <p className="text-[12px] font-sans font-bold text-white/80 tracking-widest mt-2">
                                        ₹{item.price.toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>

                            {/* Decorative border on hover */}
                            <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 transition-all duration-700 rounded-2xl pointer-events-none" />
                        </Link>
                    ))}
                </div>

                {/* View More Button */}
                <div className="mt-14 flex justify-center">
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-4 text-primary text-[10px] font-sans font-bold uppercase tracking-[0.3em] transition-all hover:text-accent"
                    >
                        <span className="border-b border-primary/20 pb-1 group-hover:border-accent transition-colors">
                            Explore All Arrivals
                        </span>
                        <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
