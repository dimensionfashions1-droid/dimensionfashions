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

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent h-20",
                    isScrolled ? "bg-background/80 backdrop-blur-md border-border" : "bg-transparent"
                )}
            >
                <div className="container mx-auto px-4 md:px-8 h-full flex items-center justify-between relative">

                    {/* LEFT: Mobile Menu & Desktop Nav */}
                    <div className="flex items-center">
                        {/* Mobile Trigger */}
                        <button
                            className="md:hidden text-foreground mr-4"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Desktop Links - Hides on Scroll Down */}
                        <div className={cn(
                            "hidden md:flex items-center gap-8 transition-all duration-500",
                            hideOnScroll ? "opacity-0 -translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
                        )}>
                            {["New Arrivals", "Tops", "Bottoms", "Outerwear"].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                                    className="text-xs font-bold tracking-[0.2em] hover:text-muted-foreground transition-colors uppercase relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-foreground transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CENTER: Logo - Always Visible */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="z-50">
                            <span className={cn(
                                "font-heading font-black tracking-widest hover:opacity-80 transition-all duration-500 block whitespace-nowrap",
                                hideOnScroll ? "text-2xl" : "text-3xl"
                            )}>
                                DIMENSIONS
                            </span>
                        </Link>
                    </div>

                    {/* RIGHT: Actions - Hides on Scroll Down */}
                    <div className={cn(
                        "flex items-center gap-4 md:gap-6 transition-all duration-500",
                        hideOnScroll ? "opacity-0 translate-x-4 pointer-events-none" : "opacity-100 translate-x-0"
                    )}>
                        <button className="text-foreground hover:text-muted-foreground transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/cart" className="relative text-foreground hover:text-muted-foreground transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-foreground rounded-full" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[60] bg-background transform transition-transform duration-500 ease-in-out md:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-12">
                        <span className="font-heading font-bold text-xl tracking-tighter">DIMENSIONS</span>
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-6 text-2xl font-heading font-medium">
                        {["New Arrivals", "Apparel", "Accessories", "Collections", "About", "Contact"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase().replace(" ", "-")}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-muted-foreground transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-border pt-6">
                        <Link href="/login" className="text-lg font-medium">
                            Account
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
