"use client"

import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

const CATEGORIES = [
    { title: "Sarees", image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/sarees" },
    { title: "Lehengas", image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/lehengas" },
    { title: "Kurta Sets", image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/kurtas" },
    { title: "Fusion Wear", image: "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/fusion" },
    { title: "Jewellery", image: "https://images.pexels.com/photos/10189028/pexels-photo-10189028.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/jewellery" },
    { title: "Gowns", image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/gowns" },
    { title: "Anarkalis", image: "https://images.pexels.com/photos/8437013/pexels-photo-8437013.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/anarkalis" },
    { title: "New In", image: "https://images.pexels.com/photos/9323985/pexels-photo-9323985.jpeg?auto=compress&cs=tinysrgb&w=400", href: "/products/new" },
]

export function AzaCategoryCircles() {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="flex flex-col items-center mb-10 text-center">
                    <h2 className="font-heading text-3xl md:text-4xl text-primary tracking-tight">
                        Shop By <span className="italic">Category</span>
                    </h2>
                    <div className="w-12 h-px bg-accent mt-4" />
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        dragFree: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 md:-ml-8">
                        {CATEGORIES.map((cat) => (
                            <CarouselItem key={cat.title} className="pl-4 md:pl-8 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/8">
                                <Link href={cat.href} className="group flex flex-col items-center gap-4">
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-md group-hover:scale-105 group-hover:border-accent/30">
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>
                                    <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
                                        {cat.title}
                                    </span>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}
