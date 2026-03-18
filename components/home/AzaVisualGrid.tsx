"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const OCCASIONS = [
    { 
        title: "The Heritage Edit", 
        image: "https://images.pexels.com/photos/9323985/pexels-photo-9323985.jpeg?auto=compress&cs=tinysrgb&w=1200", 
        size: "large",
        href: "/collections/heritage"
    },
    { 
        title: "Everyday Grace", 
        image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=800", 
        size: "small",
        href: "/collections/daily"
    },
    { 
        title: "Festive Silk", 
        image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=800", 
        size: "small",
        href: "/collections/festive"
    },
    { 
        title: "Modern Minimal", 
        image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=800", 
        size: "medium",
        href: "/collections/modern"
    },
]

export function AzaVisualGrid() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="flex flex-col items-center mb-16 text-center">
                    <h2 className="font-heading text-4xl md:text-5xl text-primary tracking-tight">
                        Shop By <span className="italic">Collection</span>
                    </h2>
                    <div className="w-12 h-px bg-accent mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
                    {/* Large Featured Card */}
                    <Link 
                        href={OCCASIONS[0].href}
                        className="md:col-span-8 relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-700"
                    >
                        <Image
                            src={OCCASIONS[0].image}
                            alt={OCCASIONS[0].title}
                            fill
                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end">
                            <h3 className="font-heading text-4xl md:text-5xl text-white mb-4">{OCCASIONS[0].title}</h3>
                            <Button 
                                variant="ghost" 
                                suppressHydrationWarning
                                className="h-auto p-0 text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.3em] text-white/80 group-hover:text-white transition-colors border-b border-white/20 pb-2 w-fit rounded-none hover:bg-transparent"
                            >
                                Explore Collection
                            </Button>
                        </div>
                    </Link>

                    {/* Right Column Grid */}
                    <div className="md:col-span-4 grid grid-rows-2 gap-6">
                        {OCCASIONS.slice(1, 3).map((occ) => (
                            <Link 
                                key={occ.title}
                                href={occ.href}
                                className="relative group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-700"
                            >
                                <Image
                                    src={occ.image}
                                    alt={occ.title}
                                    fill
                                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                                    <h3 className="font-heading text-2xl text-white">{occ.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Bottom Medium Card */}
                    <Link 
                        href={OCCASIONS[3].href}
                        className="md:col-span-12 relative h-[300px] group overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-700 mt-6"
                    >
                        <Image
                            src={OCCASIONS[3].image}
                            alt={OCCASIONS[3].title}
                            fill
                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <h3 className="font-heading text-4xl md:text-5xl text-white tracking-widest uppercase">{OCCASIONS[3].title}</h3>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}
