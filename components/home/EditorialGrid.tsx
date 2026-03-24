"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
const LATEST_ARRIVALS = [
    {
        title: "Midnight Silk Kanjivaram",
        tag: "Sarees",
        image: "https://www.sourcesplash.com/i/random?q=indian-model&w=1200&h=800",
        href: "/product/midnight-silk",
        className: "md:col-span-4 md:row-span-2 h-[500px] md:h-full"
    },
    {
        title: "Crimson Bridal Velvet",
        tag: "Lehengas",
        image: "https://www.sourcesplash.com/i/random?q=lehenga&w=1200&h=400",
        href: "/product/crimson-velvet",
        className: "md:col-span-8 h-[240px] md:h-[300px]"
    },
    {
        title: "Pastel Kurta Set",
        tag: "Kurta Sets",
        image: "https://www.sourcesplash.com/i/random?q=kurti,woman&w=600&h=400",
        href: "/product/pastel-kurta",
        className: "md:col-span-4 h-[240px] md:h-[276px]"
    },
    {
        title: "Emerald Drape Gown",
        tag: "Gowns",
        image: "https://www.sourcesplash.com/i/random?q=gowns,&w=600&h=400",
        href: "/product/emerald-gown",
        className: "md:col-span-4 h-[240px] md:h-[276px]"
    }
];
export function EditorialGrid() {
    return (
        <section className="py-8 md:py-15 bg-accent/10">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col mb-10 text-left space-y-3">
                    <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                        Just In
                    </span>
                    <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                        Latest <span className="italic">Arrivals</span>
                    </h2>
                </div>

                {/* Asymmetric Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
                    {LATEST_ARRIVALS.map((item, index) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-700 ${item.className}`}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity" />

                            {/* Content - Always Visible */}
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-accent font-sans font-bold uppercase tracking-[0.2em] block mb-2">
                                        {item.tag}
                                    </span>
                                    <h3 className={`font-heading ${index === 0 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"} leading-tight`}>
                                        {item.title}
                                    </h3>
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
                        href="/products/new"
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
