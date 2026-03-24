"use client"

import Image from "next/image"
import Link from "next/link"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel"

const CATEGORIES = [
    {
        title: "Sarees",
        image: "https://www.sourcesplash.com/i/random?q=saree&w=400&h=600",
        href: "/products/sarees",
    },
    {
        title: "Lehengas",
        image: "https://www.sourcesplash.com/i/random?q=lehenga&w=400&h=600",
        href: "/products/lehengas",
    },
    {
        title: "Kurta Sets",
        image: "https://www.sourcesplash.com/i/random?q=kurti&w=400&h=600",
        href: "/products/kurtas",
    },
    {
        title: "Dresses",
        image: "https://www.sourcesplash.com/i/random?q=pyjamas&w=400&h=600",
        href: "/products/dresses",
    },
    {
        title: "Co-ords",
        image: "https://www.sourcesplash.com/i/random?q=trousers&w=400&h=600",
        href: "/products/coords",
    },
    {
        title: "Gowns",
        image: "https://www.sourcesplash.com/i/random?q=gown&w=400&h=600",
        href: "/products/gowns",
    },
    {
        title: "Tops",
        image: "https://www.sourcesplash.com/i/random?q=indian-girl-in-kurti,&w=400&h=600",
        href: "/products/tops",
    },
    {
        title: "Loungewear",
        image: "https://www.sourcesplash.com/i/random?q=woman-in-bed&w=400&h=600",
        href: "/products/loungewear",
    },
];

export function CategoryCircles() {
    return (
        <section className="py-8 md:py-15 bg-accent/10 ">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col mb-10 text-left space-y-3">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                        Explore Collections
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                        Shop By <span className="italic">Category</span>
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
                        {CATEGORIES.map((cat) => (
                            <CarouselItem
                                key={cat.title}
                                className="pl-3 md:pl-4 basis-1/4 md:basis-[12.5%]"
                            >
                                <Link href={cat.href} className="group flex flex-col items-center gap-3">
                                    <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border border-gray-100 transition-all duration-500 group-hover:shadow-lg group-hover:scale-105 group-hover:border-accent/30">
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            className="object-cover transition-all duration-700"
                                        />
                                    </div>
                                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-primary/50 group-hover:text-primary transition-colors duration-300">
                                        {cat.title}
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
