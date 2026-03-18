"use client";

import Link from "next/link"
import { ShieldCheck, Truck, Star } from "lucide-react"
import { useEffect, useState } from "react"

export function Footer() {
    const [year, setYear] = useState<number | null>(null)

    useEffect(() => {
        setYear(new Date().getFullYear())
    }, [])

    const pillars = [
        { icon: <ShieldCheck className="w-5 h-5" />, title: "100% Purity", desc: "Silk Mark Certified Weaves" },
        { icon: <Truck className="w-5 h-5" />, title: "Pan India Delivery", desc: "Express Shipping across Cities" },
        { icon: <Star className="w-5 h-5" />, title: "Expert Curation", desc: "Hand-selected Masterpieces" }
    ]

    return (
        <footer className="bg-primary text-secondary">
            {/* Trust Pillars Bar */}
            <div className="border-y border-secondary/5 py-16 bg-primary">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        {pillars.map((pillar) => (
                            <div key={pillar.title} className="flex flex-col md:flex-row items-center gap-6 group">
                                <div className="p-4 border border-secondary/10 group-hover:border-accent transition-colors">
                                    {pillar.icon}
                                </div>
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="font-sans font-bold uppercase tracking-[0.2em] text-[10px] text-secondary">
                                        {pillar.title}
                                    </h4>
                                    <p className="text-[10px] font-sans text-secondary/40 uppercase tracking-widest">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-24 md:py-32">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                        {/* Brand Section */}
                        <div className="lg:col-span-4 space-y-10">
                            <span className="font-heading font-normal text-4xl tracking-tight block text-secondary">
                                ANTIGRAVITY
                            </span>
                            <p className="text-secondary/50 text-sm leading-relaxed max-w-xs font-sans tracking-wide">
                                Dedicated to the preservation of India's handwoven heritage. We curate the world's most exquisite pure silk sarees for the discerning modern woman.
                            </p>
                        </div>

                        {/* Shop Links */}
                        <div className="lg:col-span-3 space-y-8">
                            <h4 className="font-sans font-medium uppercase tracking-[0.3em] text-[10px] text-secondary/40">Collections</h4>
                            <ul className="space-y-5">
                                {["Kanjivaram", "Banarasi", "Soft Silk", "Bridal Wear", "Limited Drops"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm font-sans text-secondary/70 hover:text-accent transition-colors tracking-wide">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="lg:col-span-5 space-y-10">
                            <div className="space-y-4">
                                <h4 className="font-sans font-medium uppercase tracking-[0.3em] text-[10px] text-secondary/40">The Collective</h4>
                                <p className="text-base font-heading text-secondary italic tracking-wide">
                                    Receive exclusive access to new weave drops and private collection pre-views.
                                </p>
                            </div>
                            <form className="flex gap-4 border-b border-secondary/20 pb-4 focus-within:border-secondary transition-colors group">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="bg-transparent text-sm font-sans w-full focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors tracking-widest uppercase"
                                    suppressHydrationWarning={true}
                                />
                                <button 
                                    type="submit" 
                                    className="text-accent hover:text-secondary uppercase tracking-[0.2em] text-[10px] font-sans font-bold transition-colors"
                                    suppressHydrationWarning={true}
                                >
                                    JOIN
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-12 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-sans text-secondary/30 uppercase tracking-[0.2em]">
                            &copy; {year || new Date().getFullYear()} ANTIGRAVITY. A TRIBUTE TO HANDWOVEN RADIANCE.
                        </p>
                        <div className="flex gap-10">
                            {["Privacy", "Terms", "Shipping"].map((item) => (
                                <Link key={item} href="#" className="text-[10px] font-sans text-secondary/30 hover:text-accent transition-colors uppercase tracking-[0.2em]">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
