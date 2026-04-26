
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { CategoryRow } from "@/types"

export function Footer() {
    const [categories, setCategories] = useState<CategoryRow[]>([])

    useEffect(() => {
        const fetchFooterCats = async () => {
            try {
                const res = await fetch('/api/categories?all=true')
                const result = await res.json()
                if (result.data) {
                    // Show latest 5
                    setCategories(result.data.slice(0, 5))
                }
            } catch (error) {
                console.error("Footer category fetch error:", error)
            }
        }
        fetchFooterCats()
    }, [])

    return (
        <footer className="bg-primary text-secondary">

            <div className="py-8 md:py-12">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                        {/* Brand Section */}
                        <div className="lg:col-span-4 space-y-10">
                            <span className="font-heading font-normal text-4xl tracking-tight block text-secondary">
                                DIMENSION
                            </span>
                            <p className="text-secondary/50 text-sm leading-relaxed max-w-xs font-sans tracking-wide">
                                A curated collection of premium women's wear, dedicated to empowering the modern woman with elegance and style.
                            </p>
                        </div>

                        {/* Shop Links */}
                        <div className="lg:col-span-3 space-y-8">
                            <h4 className="font-sans font-medium uppercase tracking-[0.3em] text-[10px] text-secondary/40">Collections</h4>
                            <ul className="space-y-5">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link href={`/products/${cat.slug}`} className="text-sm font-sans text-secondary/70 hover:text-accent transition-colors tracking-wide">
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    ["Dresses", "Tops", "Outerwear", "Bridal Wear", "New Arrivals"].map((item) => (
                                        <li key={item}>
                                            <Link href="/products" className="text-sm font-sans text-secondary/70 hover:text-accent transition-colors tracking-wide">
                                                {item}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>

                        {/* Contact & Support */}
                        <div className="lg:col-span-5 space-y-10">
                            <div className="space-y-4">
                                <h4 className="font-sans font-medium uppercase tracking-[0.3em] text-[10px] text-secondary/40">Connect With Us</h4>
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-accent">Customer Support</p>
                                            <p className="text-sm font-sans text-secondary/70 tracking-wide font-medium">+91 9025783560</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-accent">Email Enquiries</p>
                                            <Link href="mailto:contact@dimensionfashions.com" className="text-sm font-sans text-secondary/70 hover:text-secondary transition-colors tracking-wide block font-medium">
                                                contact@dimensionfashions.com
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-4 border-t border-secondary/5">
                                        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-accent">Shop Address</p>
                                        <p className="text-sm font-sans text-secondary/70 tracking-relaxed font-medium">
                                            N.M Sungam, Valparai main road, Pollachi, Tamil Nadu, 642007, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-12 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-sans text-secondary/30 uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} DIMENSION. PREMIUM WOMEN'S WEAR.
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
