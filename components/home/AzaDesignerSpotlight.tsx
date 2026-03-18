"use client"

import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const DESIGNERS = [
    { 
        name: "Sabyasachi Mukherjee", 
        label: "Sabyasachi", 
        image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=800",
        specialty: "Heritage Handloom"
    },
    { 
        name: "Manish Malhotra", 
        label: "Manish Malhotra", 
        image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=800",
        specialty: "Modern Silhouette"
    },
    { 
        name: "Anita Dongre", 
        label: "Anita Dongre", 
        image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=800",
        specialty: "Sustainable Craft"
    },
    { 
        name: "Sanjay Garg", 
        label: "Raw Mango", 
        image: "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800",
        specialty: "Contemporary Silk"
    },
]

export function AzaDesignerSpotlight() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl text-primary tracking-tight">
                        Designer <span className="italic">Spotlight</span>
                    </h2>
                    <div className="w-12 h-px bg-accent mt-4" />
                </div>

                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-6 md:-ml-8">
                        {DESIGNERS.map((designer) => (
                            <CarouselItem key={designer.name} className="pl-6 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3">
                                <Link href="#" className="group block relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-700 aspect-[3/4]">
                                    <Image
                                        src={designer.image}
                                        alt={designer.name}
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                            <span className="text-secondary/60 text-[10px] uppercase tracking-widest font-sans font-bold">
                                                {designer.label}
                                            </span>
                                            <h3 className="font-heading text-3xl text-white">{designer.name}</h3>
                                            <p className="text-secondary/40 text-[10px] uppercase tracking-[0.2em] pt-2 border-t border-white/10 w-fit">
                                                {designer.specialty}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden lg:block">
                        <CarouselPrevious suppressHydrationWarning className="h-10 w-10 rounded-full border-gray-100 bg-white text-primary shadow-md hover:shadow-lg transition-all" />
                        <CarouselNext suppressHydrationWarning className="h-10 w-10 rounded-full border-gray-100 bg-white text-primary shadow-md hover:shadow-lg transition-all" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
