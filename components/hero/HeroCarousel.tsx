"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"

export function HeroCarousel() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: false })
    )

    React.useEffect(() => {
        if (!api) return
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    const slides = [
        {
            id: 1,
            image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1600",
            title: "The Silk\nAnthology",
            subtitle: "Exquisite Handwoven Kanjivarams",
            link: "/collections/kanjivaram",
            tag: "New Arrivals"
        },
        {
            id: 2,
            image: "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=1600",
            title: "Midnight\nOrganza",
            subtitle: "Sheer Sophistication & Grace",
            link: "/collections/organza",
            tag: "Contemporary"
        },
        {
            id: 3,
            image: "https://images.pexels.com/photos/8437013/pexels-photo-8437013.jpeg?auto=compress&cs=tinysrgb&w=1600",
            title: "Heritage\nBanaras",
            subtitle: "Timeless Craftsmanship",
            link: "/collections/banarasi",
            tag: "Classic"
        }
    ]

    return (
        <section className="relative w-full bg-background pt-32 pb-12">
            <div className="max-w-[1280px] mx-auto px-4">
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2rem] shadow-2xl"
                    opts={{ loop: true }}
                >
                    <CarouselContent className="h-full ml-0">
                        {slides.map((slide) => (
                            <CarouselItem key={slide.id} className="relative h-[400px] md:h-[500px] w-full pl-0">
                                <div className="relative h-full w-full">
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Moodier Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                                    
                                    <div className="absolute inset-0 z-10 flex flex-col items-start justify-center text-left px-12 md:px-20">
                                        <div className="max-w-2xl space-y-6">
                                            <div className="flex flex-col items-start gap-2">
                                                <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                                                    {slide.tag}
                                                </span>
                                            </div>
                                            <h2 className="font-heading font-normal text-4xl md:text-6xl text-white leading-tight tracking-tight">
                                                {slide.title}
                                            </h2>
                                            <div className="pt-4">
                                                <Link 
                                                    href={slide.link}
                                                    className="group inline-flex items-center gap-4 text-white text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.3em] bg-white/10 hover:bg-white hover:text-primary backdrop-blur-md px-6 py-3 border border-white/20 transition-all duration-500 rounded-full"
                                                >
                                                    Shop Collection
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Indicators */}
                    <div className="absolute bottom-10 left-10 flex items-center gap-4 z-30">
                        {Array.from({ length: count }).map((_, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                suppressHydrationWarning
                                className={cn(
                                    "p-0 h-[2px] w-12 rounded-none transition-all duration-1000 hover:bg-transparent",
                                    current === index ? "bg-white" : "bg-white/20"
                                )}
                                onClick={() => api?.scrollTo(index)}
                            />
                        ))}
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
