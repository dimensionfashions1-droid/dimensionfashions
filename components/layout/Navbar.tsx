"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, Instagram, Facebook, Twitter, AlignLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { User as SupabaseUser } from '@supabase/supabase-js'

const CATEGORIES = [
    {
        name: "Sarees",
        href: "/collections/sarees",
        image: "https://images.unsplash.com/photo-1583391733975-6664ea615c0a?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Silk Sarees", href: "/collections/sarees/silk" },
            { name: "Kanjivaram", href: "/collections/sarees/kanjivaram" },
            { name: "Organza", href: "/collections/sarees/organza" },
            { name: "Cotton", href: "/collections/sarees/cotton" },
            { name: "Bridal Sarees", href: "/collections/sarees/bridal" },
        ]
    },
    {
        name: "Lehengas",
        href: "/collections/lehengas",
        image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Bridal Lehengas", href: "/collections/lehengas/bridal" },
            { name: "Bridesmaid Lehengas", href: "/collections/lehengas/bridesmaid" },
            { name: "Printed Lehengas", href: "/collections/lehengas/printed" },
            { name: "Jacket Lehengas", href: "/collections/lehengas/jacket" },
        ]
    },
    {
        name: "Kurta Sets",
        href: "/collections/kurta-sets",
        image: "https://images.unsplash.com/photo-1595777457583-95e059f581eb?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Anarkali Sets", href: "/collections/kurta-sets/anarkali" },
            { name: "Palazzo Sets", href: "/collections/kurta-sets/palazzo" },
            { name: "Sharara Sets", href: "/collections/kurta-sets/sharara" },
            { name: "Straight Kurtas", href: "/collections/kurta-sets/straight" },
        ]
    },
    {
        name: "Dresses",
        href: "/collections/dresses",
        image: "https://images.unsplash.com/photo-1555529771-331e84ae5b86?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Maxi Dresses", href: "/collections/dresses/maxi" },
            { name: "Midi Dresses", href: "/collections/dresses/midi" },
            { name: "Mini Dresses", href: "/collections/dresses/mini" },
            { name: "Wrap Dresses", href: "/collections/dresses/wrap" },
        ]
    },
    {
        name: "Gowns",
        href: "/collections/gowns",
        image: "https://images.unsplash.com/photo-1580828369619-b414fccc41da?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Evening Gowns", href: "/collections/gowns/evening" },
            { name: "Reception Gowns", href: "/collections/gowns/reception" },
            { name: "Indo-Western Gowns", href: "/collections/gowns/indo-western" },
            { name: "Drape Gowns", href: "/collections/gowns/drape" },
        ]
    },
    {
        name: "Tops",
        href: "/collections/tops",
        image: "https://images.unsplash.com/photo-1594917172018-9366eecf46f4?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Crop Tops", href: "/collections/tops/crop" },
            { name: "Tunics", href: "/collections/tops/tunics" },
            { name: "Shirts", href: "/collections/tops/shirts" },
            { name: "Blouses", href: "/collections/tops/blouses" },
        ]
    },
    {
        name: "Co-ords",
        href: "/collections/coords",
        image: "https://images.unsplash.com/photo-1617265882583-b5419d280b2a?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Printed Co-ords", href: "/collections/coords/printed" },
            { name: "Solid Co-ords", href: "/collections/coords/solid" },
            { name: "Embroidered Co-ords", href: "/collections/coords/embroidered" },
            { name: "Lounge Co-ords", href: "/collections/coords/lounge" },
        ]
    },
    {
        name: "Loungewear",
        href: "/collections/loungewear",
        image: "https://images.unsplash.com/photo-1610030469983-98e500b71826?auto=format&fit=crop&q=80&w=400",
        subcategories: [
            { name: "Kaftans", href: "/collections/loungewear/kaftans" },
            { name: "Pyjama Sets", href: "/collections/loungewear/pyjamas" },
            { name: "Nightdresses", href: "/collections/loungewear/nightdresses" },
            { name: "Robes", href: "/collections/loungewear/robes" },
        ]
    }
]

export function Navbar({ user }: { user?: SupabaseUser | null }) {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const [activeMegaCategory, setActiveMegaCategory] = React.useState(CATEGORIES[0])

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ",
            isScrolled ? "shadow-sm" : ""
        )}>
            {/* Level 1: Top Bar */}
            <div className="bg-primary text-secondary">
                <div className="max-w-[1280px] mx-auto text-[8px] md:text-[10px] font-sans  py-2 px-4 flex justify-between items-center tracking-[0.2em] uppercase">
                    <div className="flex-1 text-left">Fast Shipping and secure payment</div>
                    <div className="flex gap-4 items-center">
                        <Link href="#" className="hover:text-accent transition-colors"><Instagram className="w-3.5 h-3.5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Facebook className="w-3.5 h-3.5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Twitter className="w-3.5 h-3.5" /></Link>
                    </div>
                </div>
            </div>

            {/* Tier 2: Main Header Bar */}
            <div className="max-w-[1280px] mx-auto px-4 py-4">
                <div className="flex items-center gap-6">
                    {/* Left: Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="font-heading font-normal text-3xl md:text-4xl tracking-tighter text-primary">
                            DIMENSIONS
                        </span>
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-primary ml-auto mr-2"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Center: Wide Search Bar */}
                    <div className="hidden lg:flex flex-1 justify-center px-8">
                        <div className="flex items-center gap-0 relative w-full max-w-[600px]">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[120px] h-10 rounded-l-full rounded-r-none border-r-0 border-gray-200 bg-gray-50/50 text-[10px] font-sans font-bold uppercase tracking-widest focus:ring-0 focus:ring-offset-0 shadow-none">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                    <SelectItem value="all" className="text-[10px] font-sans font-bold uppercase tracking-widest">All</SelectItem>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name.toLowerCase()} className="text-[10px] font-sans font-bold uppercase tracking-widest">
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Search for sarees, lehengas..."
                                    className="w-full h-9 pl-10 pr-4 rounded-l-none rounded-r-full border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent text-[8px] font-sans bg-gray-50/50 shadow-none placeholder-primary/50"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Action Icons */}
                    <div className="flex items-center gap-5 flex-shrink-0">
                        {user ? (
                            <Link href="/profile" className="text-primary hover:text-accent transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                        ) : (
                            <div className="hidden sm:flex items-center gap-5 text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
                                <Link href="/login" className="hover:text-accent transition-colors">Log In</Link>
                                <span className="opacity-30">|</span>
                                <Link href="/register" className="hover:text-accent transition-colors">Register</Link>
                            </div>
                        )}
                        <Link href="#" className="hidden sm:block text-primary hover:text-accent transition-colors">
                            <Heart className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="text-primary hover:text-accent transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">0</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tier 3: Navigation Bar (Desktop only) */}
            <div className="bg-primary hidden lg:block border-t border-gray-100">
                <div className="max-w-[1280px] mx-auto px-4">
                    <nav className="flex items-center justify-center gap-8 py-3">
                        {/* Burger Menu / Mega Menu */}
                        <div className="group relative">
                            <button
                                className="flex items-center gap-2 text-[11px] font-sans font-bold text-white hover:text-primary uppercase tracking-[0.15em] transition-colors whitespace-nowrap"
                                suppressHydrationWarning
                            >
                                <Menu className="w-4 h-4 text-white" />
                                All Categories
                            </button>
                            {/* Mega Menu Dropdown */}
                            <div className="absolute top-full left-0 pt-3 hidden group-hover:block w-[800px] z-[100]">
                                <div className="flex bg-white shadow-2xl border border-gray-100 min-h-[400px] w-full transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 overflow-hidden shadow-black/5 rounded-b-lg">
                                    {/* Left Sidebar */}
                                    <div className="w-[30%] bg-gray-50/80 p-6 border-r border-gray-100">
                                        <ul className="space-y-1">
                                            {CATEGORIES.map((cat) => (
                                                <li key={cat.name}>
                                                    <Link
                                                        href={cat.href}
                                                        onMouseEnter={() => setActiveMegaCategory(cat)}
                                                        className={cn(
                                                            "w-full text-left py-3 pr-4 pl-3.5 text-[10px] font-sans font-bold uppercase tracking-widest transition-all rounded-none block border-l-2",
                                                            activeMegaCategory.name === cat.name
                                                                ? "bg-accent/10 rounded-r-sm text-primary border-accent shadow-sm"
                                                                : "border-transparent text-primary/70 hover:bg-white/50 hover:text-primary"
                                                        )}
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Right Split Section */}
                                    <div className="w-[70%] p-8 flex gap-8 bg-white">
                                        {/* Subcategories */}
                                        <div className="flex-1 space-y-6">
                                            <h3 className="text-xl font-heading text-primary border-b border-gray-100 pb-3 block">
                                                {activeMegaCategory.name}
                                            </h3>
                                            <ul className="space-y-4">
                                                {activeMegaCategory.subcategories.map((sub) => (
                                                    <li key={sub.name}>
                                                        <Link href={sub.href} className="text-[11px] font-sans font-bold text-primary/60 hover:text-accent uppercase tracking-[0.15em] transition-colors block">
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Category Image */}
                                        <div className="w-[240px] flex flex-col items-center justify-center space-y-4">
                                            <Link href={activeMegaCategory.href} className="block relative aspect-[3/4] w-full rounded-sm overflow-hidden group/img bg-gray-50">
                                                <Image
                                                    src={activeMegaCategory.image}
                                                    alt={activeMegaCategory.name}
                                                    fill
                                                    className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                                    sizes="240px"
                                                />
                                                <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 transition-colors duration-500" />
                                            </Link>
                                            <Link href={activeMegaCategory.href} className="text-[9px] font-sans font-bold tracking-[0.2em] text-accent uppercase border-b border-accent/30 p-1 hover:border-accent transition-colors block text-center">
                                                Explore {activeMegaCategory.name}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {CATEGORIES.slice(0, 4).map((cat) => (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        <div className="h-4 w-px bg-white mx-2" />

                        <Link href="#" className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Best Sellers</Link>
                        <Link href="#" className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Latest Arrivals</Link>
                        <Link href="#" className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Contact Us</Link>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-0 z-[100] bg-black/60 transition-opacity duration-500 lg:hidden",
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div className={cn(
                    "absolute top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white p-8 transition-transform duration-500",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex justify-between items-center mb-12">
                        <span className="font-heading text-2xl tracking-tighter">DIMENSIONS</span>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="w-6 h-6 text-primary" />
                        </button>
                    </div>

                    <ul className="space-y-8">
                        {CATEGORIES.map((cat) => (
                            <li key={cat.name}>
                                <Link
                                    href={cat.href}
                                    className="text-sm font-sans font-bold text-primary uppercase tracking-[0.2em] flex items-center justify-between"
                                >
                                    {cat.name}
                                    <ChevronDown className="w-4 h-4 opacity-30" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-20 space-y-6 pt-12 border-t border-gray-100">
                        {user ? (
                            <Link href="/profile" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors hover:text-accent">My Profile</Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors hover:text-accent">Log In</Link>
                                <Link href="/register" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors hover:text-accent">Register</Link>
                            </>
                        )}
                        <Link href="#" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors hover:text-accent">Track your order</Link>
                        <Link href="#" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
