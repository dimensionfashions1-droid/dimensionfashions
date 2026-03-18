"use client";

import { useScrollDirection } from "@/hooks/use-scroll-direction"

export function MarqueeSection() {
    const scrollDirection = useScrollDirection()
    
    return (
        <section className="py-16 bg-primary/5 overflow-hidden border-y border-primary/5">
            <div className="relative flex whitespace-nowrap overflow-hidden">
                <div className="animate-marquee flex gap-12 items-center py-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="font-heading italic text-4xl md:text-6xl text-primary/10 tracking-widest uppercase flex items-center gap-12">
                            Handwoven Heritage
                            <span className="w-2 h-2 rounded-full bg-accent opacity-30" />
                        </span>
                    ))}
                </div>
                <div className="animate-marquee flex gap-12 items-center py-4 absolute top-0 left-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="font-heading italic text-4xl md:text-6xl text-primary/10 tracking-widest uppercase flex items-center gap-12">
                            Handwoven Heritage
                            <span className="w-2 h-2 rounded-full bg-accent opacity-30" />
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
