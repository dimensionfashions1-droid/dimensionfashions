"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"

export function HeroCarousel() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: false })
    )

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2000&auto=format&fit=crop",
            title: "Nocturnal\nVision",
            subtitle: "The Midnight Collection",
            link: "/collections/midnight"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=2000&auto=format&fit=crop",
            title: "Sharp\nFocus",
            subtitle: "Tailored Perfection",
            link: "/collections/tailoring"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=2000&auto=format&fit=crop",
            title: "Essential\nForm",
            subtitle: "Core Basics",
            link: "/shop/essentials"
        }
    ]

    return (
        <section className="relative h-[100vh] w-full bg-white overflow-hidden ">
            {/* LEFT SIDEBAR - SOCIALS (OVERLAY) */}
            <div className="absolute left-0 top-0 bottom-0 w-24 flex flex-col items-center justify-center gap-8 z-20 pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-8 bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                    {/* Added glassmorphism pill for visibility since it's overlay */}
                    <Link href="#" className="p-2 hover:bg-black hover:text-white rounded-full transition-colors text-black bg-white/50">
                        <Facebook className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="p-2 hover:bg-black hover:text-white rounded-full transition-colors text-black bg-white/50">
                        <Instagram className="w-5 h-5" />
                    </Link>
                    <Link href="#" className="p-2 hover:bg-black hover:text-white rounded-full transition-colors text-black bg-white/50">
                        <Twitter className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* CENTER - CAROUSEL */}
            <div className="w-full h-full relative group bg-neutral-100">
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    className="w-full h-full"
                    opts={{
                        loop: true,
                        align: "start",
                    }}
                >
                    <CarouselContent className="h-full">
                        {slides.map((slide) => (
                            <CarouselItem key={slide.id} className="relative h-full w-full pl-0">
                                <div className="relative h-full w-full">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Dark overlay for consistent black bg feel */}
                                    <div className="absolute inset-0 bg-black/40" />

                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                                        <h2 className="font-heading font-black text-5xl md:text-8xl text-white drop-shadow-xl uppercase tracking-tighter leading-[0.9] whitespace-pre-line mb-6 animate-fade-in-up mix-blend-difference">
                                            {slide.title}
                                        </h2>
                                        <Button asChild className="rounded-full bg-black text-white hover:bg-neutral-800 font-heading font-bold text-sm md:text-base tracking-widest uppercase px-10 py-8 animate-fade-in-scale shadow-2xl hover:scale-105 transition-transform">
                                            <Link href={slide.link}>Shop Now</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Pagination Dots - BLACK */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300 border border-transparent shadow-sm",
                                    current === index ? "bg-black scale-125" : "bg-black/40 hover:bg-black/60"
                                )}
                                onClick={() => api?.scrollTo(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
