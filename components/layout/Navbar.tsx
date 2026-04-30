"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, Heart, Menu, X, ChevronDown, Instagram, Facebook, Twitter, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { CategoryRow, SubcategoryRow } from "@/types"
import { SearchInput } from "./SearchInput"

import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

interface Category extends CategoryRow {
    subcategories: SubcategoryRow[]
}

export function Navbar({ user }: { user?: SupabaseUser | null }) {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false)
    const [expandedMobileCat, setExpandedMobileCat] = React.useState<string | null>(null)
    const [categories, setCategories] = React.useState<Category[]>([])
    const [activeMegaCategory, setActiveMegaCategory] = React.useState<Category | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [isMounted, setIsMounted] = React.useState(false)

    const cart = useCart()
    const wishlist = useWishlist()

    React.useEffect(() => {
        setIsMounted(true)
    }, [])

    const toggleMobileSubcat = (e: React.MouseEvent, catId: string) => {
        e.preventDefault()
        e.stopPropagation()
        setExpandedMobileCat(expandedMobileCat === catId ? null : catId)
    }

    const closeMegaMenu = () => {
        setIsMegaMenuOpen(false)
    }

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories?all=true&includeSubcategories=true')
                const result = await response.json()
                if (result.data) {
                    setCategories(result.data)
                    if (result.data.length > 0) {
                        setActiveMegaCategory(result.data[0])
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()

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
                            DIMENSION
                        </span>
                    </Link>

                    {/* Mobile Actions & Menu Toggle */}
                    <div className="lg:hidden flex items-center gap-4 ml-auto">
                        <Link href="/wishlist" className="text-primary hover:text-accent transition-colors">
                            <Heart className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="text-primary hover:text-accent transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {isMounted ? cart.getTotalItems() : 0}
                            </span>
                        </Link>
                        <button
                            className="text-primary p-1"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Center: Wide Search Bar */}
                    <div className="hidden lg:flex flex-1 justify-center px-8">
                        <SearchInput />
                    </div>

                    {/* Right: Action Icons */}
                    <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
                        {user ? (
                            <Link href="/profile" className="text-primary hover:text-accent transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                        ) : (
                            <div className="flex items-center gap-5 text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
                                <Link href="/login" className="hover:text-accent transition-colors">Log In</Link>
                                <span className="opacity-30">|</span>
                                <Link href="/register" className="hover:text-accent transition-colors">Register</Link>
                            </div>
                        )}
                        <Link href="/wishlist" className="text-primary hover:text-accent transition-colors">
                            <Heart className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="text-primary hover:text-accent transition-colors relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                                {isMounted ? cart.getTotalItems() : 0}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tier 3: Navigation Bar (Desktop only) */}
            <div className="bg-primary hidden lg:block border-t border-gray-100">
                <div className="max-w-[1280px] mx-auto px-4">
                    <nav className="flex items-center justify-center gap-8 py-3">
                        {/* Burger Menu / Mega Menu */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsMegaMenuOpen(true)}
                            onMouseLeave={() => setIsMegaMenuOpen(false)}
                        >
                            <button
                                className="flex items-center gap-2 text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap"
                                suppressHydrationWarning
                            >
                                <Menu className="w-4 h-4 text-white" />
                                All Categories
                            </button>
                            {/* Mega Menu Dropdown */}
                            {isMegaMenuOpen && categories.length > 0 && activeMegaCategory && (
                                <div className={cn(
                                    "absolute top-full left-0 pt-3 z-[100]",
                                    activeMegaCategory.subcategories.length > 0 ? "w-[800px]" : "w-auto"
                                )}>
                                    <div className="flex bg-white shadow-2xl border border-gray-100 w-full transition-all duration-300 overflow-hidden shadow-black/5 rounded-b-lg">
                                        {/* Left Sidebar */}
                                        <div className="w-[220px] shrink-0 bg-gray-50/80 p-6 border-r border-gray-100">
                                            <ul className="space-y-1">
                                                {categories.map((cat) => (
                                                    <li key={`nav_mega_cat_${cat.id}`}>
                                                        <Link
                                                            href={`/products/${cat.slug}`}
                                                            onMouseEnter={() => setActiveMegaCategory(cat)}
                                                            onClick={closeMegaMenu}
                                                            className={cn(
                                                                "w-full text-left py-3 pr-4 pl-3.5 text-[10px] font-sans font-bold uppercase tracking-widest transition-all rounded-none block border-l-2",
                                                                activeMegaCategory.id === cat.id
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

                                        {/* Subcategories - only show if category has subcategories */}
                                        {activeMegaCategory.subcategories.length > 0 && (
                                            <div className="flex-1 p-8 space-y-6 bg-white">
                                                <h3 className="text-xl font-heading text-primary border-b border-gray-100 pb-3 block">
                                                    {activeMegaCategory.name}
                                                </h3>
                                                <ul className="space-y-4">
                                                    {activeMegaCategory.subcategories.map((sub) => (
                                                        <li key={`nav_sub_${sub.id}`}>
                                                            <Link 
                                                                href={`/products/${activeMegaCategory.slug}/${sub.slug}`}
                                                                onClick={closeMegaMenu}
                                                                className="text-[11px] font-sans font-bold text-primary/60 hover:text-accent uppercase tracking-[0.15em] transition-colors block"
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Category Image */}
                                        <div className="w-[240px] shrink-0 p-8 flex flex-col items-center justify-center space-y-4 bg-white">
                                            <Link 
                                                href={`/products/${activeMegaCategory.slug}`} 
                                                onClick={closeMegaMenu}
                                                className="block relative aspect-[3/4] w-full rounded-sm overflow-hidden group/img bg-gray-50"
                                            >
                                                {activeMegaCategory.image_url ? (
                                                    <Image
                                                        src={activeMegaCategory.image_url}
                                                        alt={activeMegaCategory.name}
                                                        fill
                                                        className="object-cover group-hover/img:scale-105 transition-transform duration-700"
                                                        sizes="240px"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
                                                )}
                                                <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 transition-colors duration-500" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {categories.slice(0, 4).map((cat) => (
                            <Link
                                key={`nav_main_cat_${cat.id}`}
                                href={`/products/${cat.slug}`}
                                className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        <div className="h-4 w-px bg-white mx-2" />

                        <Link href="/products?sort=bestsellers" className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Best Sellers</Link>
                        <Link href="/products?sort=newest" className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Latest Arrivals</Link>
                        <Link href="/contact" className="text-[11px] font-sans font-bold text-white hover:text-accent uppercase tracking-[0.15em] transition-colors whitespace-nowrap">Contact Us</Link>
                    </nav>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-0 z-[100] bg-black/60 transition-opacity duration-500 lg:hidden",
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div className={cn(
                    "absolute top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white flex flex-col transition-transform duration-500",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Fixed Header in Sidebar */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                        <span className="font-heading text-2xl tracking-tighter text-primary">DIMENSION</span>
                        <button onClick={() => setMobileMenuOpen(false)}>
                            <X className="w-6 h-6 text-primary" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="mb-8">
                            <SearchInput />
                        </div>

                        <ul className="space-y-6">
                            {categories.map((cat) => (
                                <li key={`nav_mobile_cat_${cat.id}`} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={`/products/${cat.slug}`}
                                            className="text-[11px] font-sans font-bold text-primary uppercase tracking-[0.2em]"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                        {cat.subcategories && cat.subcategories.length > 0 && (
                                            <button
                                                onClick={(e) => toggleMobileSubcat(e, cat.id)}
                                                className="p-2 -mr-2 transition-transform duration-300"
                                                style={{ transform: expandedMobileCat === cat.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                            >
                                                <ChevronDown className="w-4 h-4 text-primary/40" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile Subcategories */}
                                    {cat.subcategories && cat.subcategories.length > 0 && expandedMobileCat === cat.id && (
                                        <ul className="pl-4 space-y-4 border-l border-gray-100 mt-2">
                                            {cat.subcategories.map((sub) => (
                                                <li key={`nav_mobile_sub_${sub.id}`}>
                                                    <Link
                                                        href={`/products/${cat.slug}/${sub.slug}`}
                                                        className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-[0.15em] block"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-12 space-y-6 pt-12 border-t border-gray-100 pb-12">
                            <Link href="/products?sort=bestsellers" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-widest block transition-colors hover:text-accent">Best Sellers</Link>
                            <Link href="/products?sort=newest" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-widest block transition-colors hover:text-accent">Latest Arrivals</Link>
                            {user ? (
                                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-widest block transition-colors hover:text-accent">My Profile</Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-widest block transition-colors hover:text-accent">Log In</Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-widest block transition-colors hover:text-accent">Register</Link>
                                </>
                            )}
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-sans font-bold text-primary/60 uppercase tracking-widest block transition-colors hover:text-accent">Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
