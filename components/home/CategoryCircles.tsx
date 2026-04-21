"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel"
import { CategoryRow } from "@/types"

export function CategoryCircles() {
    const [categories, setCategories] = React.useState<CategoryRow[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories?all=true')
                const result = await response.json()
                if (result.data) {
                    setCategories(result.data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (loading) {
        return (
            <section className="py-8 md:py-15 bg-accent/10">
                <div className="max-w-[1280px] mx-auto px-4">
                    <div className="flex flex-col mb-10 text-left space-y-3">
                        <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                        <div className="h-10 w-64 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
                                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-200 animate-pulse" />
                                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (categories.length === 0) return null

    return (
        <section className="py-8 md:py-15 bg-accent/10 ">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col mb-10 text-left space-y-3">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                        Explore Collections
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                        Shop By <span className="">Category</span>
                    </h2>
                </div>

                {/* Category Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-3 md:-ml-4">
                        {categories.map((cat) => (
                            <CarouselItem
                                key={`circle_${cat.id}`}
                                className="pl-3 md:pl-4 basis-1/4 md:basis-[12.5%]"
                            >
                                <Link href={`/products?category=${cat.slug}`} className="group flex flex-col items-center gap-3">
                                    <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-100 transition-all duration-500 group-hover:shadow-lg group-hover:scale-105 group-hover:border-accent/30 bg-white">
                                        {cat.image_url ? (
                                            <Image
                                                src={cat.image_url}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-primary/50 group-hover:text-primary transition-colors duration-300 text-center">
                                        {cat.name}
                                    </span>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-3 md:-left-5 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-accent/30 shadow-sm" />
                    <CarouselNext className="-right-3 md:-right-5 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-accent/30 shadow-sm" />
                </Carousel>
            </div>
        </section>
    )
}
