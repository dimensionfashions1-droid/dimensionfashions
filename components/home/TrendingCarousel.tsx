"use client"

import { Product } from "@/types"
import { ProductCard } from "../product/ProductCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface TrendingCarouselProps {
    title: string
    products: Product[]
    isAuthenticated?: boolean
}

export function TrendingCarousel({ title, products, isAuthenticated }: TrendingCarouselProps) {
    return (
        <section className="py-24 md:py-40 bg-primary/5">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-6">
                        <span className="text-primary/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-sans font-bold block">
                            The Trending Edit
                        </span>
                        <h2 className="font-heading font-normal text-4xl md:text-6xl text-primary tracking-tight">
                            {title}
                        </h2>
                    </div>
                    <Link 
                        href="/collections/all"
                        className="group flex items-center gap-4 text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-primary"
                    >
                        View All
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-8">
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="pl-8 md:basis-1/2 lg:basis-1/4">
                                <ProductCard product={product} isAuthenticated={isAuthenticated} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-4 mt-12 md:hidden">
                        <CarouselPrevious className="relative h-12 w-12 rounded-none border-primary/10 bg-background text-primary" />
                        <CarouselNext className="relative h-12 w-12 rounded-none border-primary/10 bg-background text-primary" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
