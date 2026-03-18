"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useScrollDirection } from "@/hooks/use-scroll-direction"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const scrollDirection = useScrollDirection()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const hideOnScroll = isScrolled && scrollDirection === "down"

    const navLinks = [
        { name: "Collections", href: "/collections" },
        { name: "Kanjivaram", href: "/collections/kanjivaram" },
        { name: "Banarasi", href: "/collections/banarasi" },
        { name: "Editorial", href: "/editorial" },
        { name: "Studio", href: "/studio" },
    ]

    return (
        <>
            {/* Announcement Bar */}
            <div className="bg-primary text-secondary text-[10px] font-sans font-medium text-center py-2.5 tracking-[0.3em] uppercase border-b border-primary/10">
                Experience Handwoven Heritage — complimentary shipping on all domestic orders
            </div>

            <nav
                className={cn(
                    "sticky top-0 left-0 right-0 z-50 transition-all duration-500 bg-background/80 backdrop-blur-md",
                    isScrolled ? "h-16 border-b border-primary/5" : "h-24"
                )}
            >
                <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between relative">
                    
                    {/* LEFT: Nav Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-10 flex-1">
                        {navLinks.slice(0, 3).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-sans font-medium tracking-[0.2em] text-primary/60 hover:text-primary transition-colors uppercase relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full opacity-50" />
                            </Link>
                        ))}
                    </div>

                    {/* MOBILE: Menu Trigger */}
                    <button
                        className="lg:hidden text-primary p-2 -ml-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5 stroke-[1.5]" />
                    </button>

                    {/* CENTER: Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="inline-block">
                            <span className={cn(
                                "font-heading font-normal tracking-[0.1em] hover:opacity-70 transition-all duration-500 block text-primary",
                                isScrolled ? "text-2xl" : "text-3xl md:text-4xl"
                            )}>
                                ANTIGRAVITY
                            </span>
                        </Link>
                    </div>

                    {/* RIGHT: Actions & Nav (Desktop) */}
                    <div className="flex items-center justify-end gap-10 flex-1">
                        <div className="hidden lg:flex items-center gap-10">
                            {navLinks.slice(3).map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[11px] font-sans font-medium tracking-[0.2em] text-primary/60 hover:text-primary transition-colors uppercase relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full opacity-50" />
                                </Link>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <button className="text-primary hover:opacity-60 transition-opacity">
                                <Search className="w-4 h-4 stroke-[1.5]" />
                            </button>
                            <Link href="/cart" className="relative text-primary hover:opacity-60 transition-opacity">
                                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full" />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-background transform transition-transform duration-700 ease-in-out lg:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-20">
                        <span className="font-heading font-normal text-2xl tracking-widest text-primary">ANTIGRAVITY</span>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                            <X className="w-6 h-6 stroke-[1]" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="font-heading text-3xl hover:text-accent transition-colors border-b border-primary/5 pb-4"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-8 flex flex-col gap-4">
                        <Link href="/login" className="text-[12px] font-sans font-bold uppercase tracking-[0.2em] text-primary/60">
                            Account
                        </Link>
                        <Link href="/help" className="text-[12px] font-sans font-bold uppercase tracking-[0.2em] text-primary/60">
                            Client Service
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
