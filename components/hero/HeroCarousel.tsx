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
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2000&auto=format&fit=crop",
            title: "Bridal\nHeritage",
            subtitle: "The Kanjivaram Edit",
            link: "/collections/kanjivaram"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1583391733959-b1587d54b815?q=80&w=2000&auto=format&fit=crop",
            title: "Festive\nGrander",
            subtitle: "Pure Banarasi Silks",
            link: "/collections/banarasi"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1589467380922-38e9ab51cbff?q=80&w=2000&auto=format&fit=crop",
            title: "Everyday\nElegance",
            subtitle: "Soft Silks & Linens",
            link: "/shop/soft-silk"
        }
    ]

    return (
        <section className="relative h-[90vh] md:h-screen w-full bg-background overflow-hidden ">
            {/* LEFT SIDEBAR - SOCIALS (OVERLAY) */}
            <div className="hidden lg:flex absolute left-0 top-0 bottom-0 w-24 flex-col items-center justify-center gap-8 z-20 pointer-events-none">
                <div className="pointer-events-auto flex flex-col gap-8 bg-background/40 backdrop-blur-md p-4 rounded-full border border-primary/20">
                    <Link href="#" className="p-2 hover:bg-primary hover:text-white rounded-full transition-colors text-primary bg-background/80 shadow-sm">
                        <Facebook className="w-5 h-5 stroke-1" />
                    </Link>
                    <Link href="#" className="p-2 hover:bg-primary hover:text-white rounded-full transition-colors text-primary bg-background/80 shadow-sm">
                        <Instagram className="w-5 h-5 stroke-1" />
                    </Link>
                    <Link href="#" className="p-2 hover:bg-primary hover:text-white rounded-full transition-colors text-primary bg-background/80 shadow-sm">
                        <Twitter className="w-5 h-5 stroke-1" />
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
                                    <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                                        <div className="border border-white/30 p-8 md:p-16 backdrop-blur-sm bg-black/10 flex flex-col items-center">
                                            <p className="text-secondary uppercase tracking-[0.4em] text-xs md:text-sm mb-6 font-sans font-medium animate-fade-in-up">
                                                {slide.subtitle}
                                            </p>
                                            <h2 className="font-heading font-normal text-5xl md:text-7xl lg:text-8xl text-secondary drop-shadow-2xl capitalize tracking-wide leading-[1.1] whitespace-pre-line mb-10 animate-fade-in-up">
                                                {slide.title}
                                            </h2>
                                            <Button asChild className="rounded-none border-border bg-background text-primary hover:bg-primary hover:text-white hover:border-primary font-sans font-medium text-xs md:text-sm tracking-[0.2em] uppercase px-10 py-6 animate-fade-in-scale transition-all duration-300">
                                                <Link href={slide.link}>Explore Collection</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-30">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "w-16 md:w-24 h-[1px] transition-all duration-500",
                                    current === index ? "bg-accent scale-y-[2]" : "bg-white/40 hover:bg-white/80"
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
