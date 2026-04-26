"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { BannerRow } from "@/types"
import { Loader2 } from "lucide-react"

export function HeroCarousel() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)
    const [banners, setBanners] = React.useState<BannerRow[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const plugin = React.useRef(
        Autoplay({ delay: 6000, stopOnInteraction: false })
    )

    React.useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await fetch('/api/banners')
                const data = await res.json()
                if (data.data) {
                    setBanners(data.data)
                }
            } catch (error) {
                console.error("Error fetching banners:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBanners()
    }, [])

    React.useEffect(() => {
        if (!api) return
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    if (isLoading) {
        return (
            <section className="relative w-full bg-background py-8 md:py-10">
                <div className="max-w-[1280px] mx-auto px-4">
                    <div className="w-full h-[400px] md:h-[500px] rounded-[2rem] bg-gray-50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>
                </div>
            </section>
        )
    }

    if (banners.length === 0) return null

    return (
        <section className="relative w-full bg-background py-8 md:py-10">
            <div className="max-w-[1280px] mx-auto px-4">
                <Carousel
                    setApi={setApi}
                    plugins={[plugin.current]}
                    className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-[2rem] shadow-2xl"
                    opts={{ loop: true }}
                >
                    <CarouselContent className="h-full ml-0">
                        {banners.map((slide) => (
                            <CarouselItem key={slide.id} className="relative h-[400px] md:h-[500px] w-full pl-0">
                                <div className="relative h-full w-full">
                                    <Image
                                        src={slide.image_url}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority
                                        unoptimized
                                    />
                                    {/* Moodier Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                                    <div className="absolute inset-0 z-10 flex flex-col items-start justify-center text-left px-12 md:px-20">
                                        <div className="max-w-2xl space-y-6">
                                            <div className="flex flex-col items-start gap-2">
                                                <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-sans font-bold">
                                                    {slide.subtitle}
                                                </span>
                                            </div>
                                            <h2 className="font-heading font-normal text-4xl md:text-6xl text-white leading-tight tracking-tight">
                                                {slide.title}
                                            </h2>
                                            <div className="pt-4">
                                                <Link
                                                    href={slide.link_url || '#'}
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
                    {count > 1 && (
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
                    )}
                </Carousel>
            </div>
        </section>
    )
}
