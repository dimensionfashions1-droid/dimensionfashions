"use client"

import * as React from "react"
import Link from "next/link"
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

const CATEGORIES = [
    "Sarees", "Lehengas", "Kurta Sets", "Fusion Wear", "Jewellery", "Designer Spotlight", "Celebrity Closet"
]

export function AzaNavbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100",
            isScrolled ? "shadow-sm" : ""
        )}>
            {/* Level 1: Top Bar */}
            <div className="bg-primary text-secondary">
                <div className="max-w-[1280px] mx-auto text-[10px] md:text-xs font-sans font-bold py-2 px-4 flex justify-between items-center tracking-[0.2em] uppercase">
                    <div className="flex-1 text-left">Free Shipping on orders above ₹2999</div>
                    <div className="flex gap-4 items-center">
                        <Link href="#" className="hover:text-accent transition-colors"><Instagram className="w-3.5 h-3.5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Facebook className="w-3.5 h-3.5" /></Link>
                        <Link href="#" className="hover:text-accent transition-colors"><Twitter className="w-3.5 h-3.5" /></Link>
                    </div>
                </div>
            </div>

            {/* Level 2: Integrated Main Bar */}
            <div className="max-w-[1280px] mx-auto px-4 py-8">
                <div className="grid grid-cols-3 items-center gap-4">
                    {/* Left: All Categories Menu */}
                    <div className="hidden lg:block">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-3 text-[11px] font-sans font-bold text-primary/80 hover:text-primary hover:bg-transparent px-0 uppercase tracking-[0.2em] transition-all group">
                                    <AlignLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    All Categories
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[350px] sm:w-[450px] p-0 border-r-0">
                                <SheetHeader className="p-8 border-b border-gray-50 flex flex-row items-center justify-between">
                                    <SheetTitle className="font-heading text-3xl tracking-tighter">DIMENSIONS</SheetTitle>
                                </SheetHeader>
                                <div className="p-8">
                                    <h3 className="text-[10px] font-sans font-extrabold uppercase tracking-[0.3em] text-gray-400 mb-8">Collections</h3>
                                    <ul className="space-y-6">
                                        {CATEGORIES.map((cat) => (
                                            <li key={cat}>
                                                <Link 
                                                    href="#" 
                                                    className="text-sm font-sans font-bold text-primary hover:text-accent uppercase tracking-[0.2em] flex items-center justify-between group transition-colors"
                                                >
                                                    {cat}
                                                    <ChevronDown className="w-4 h-4 opacity-30 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-16 pt-12 border-t border-gray-50 space-y-6">
                                        <Link href="#" className="text-[10px] font-sans font-bold text-gray-400 hover:text-primary uppercase tracking-[0.2em] block transition-colors">New Arrivals</Link>
                                        <Link href="#" className="text-[10px] font-sans font-bold text-gray-400 hover:text-primary uppercase tracking-[0.2em] block transition-colors">Bestsellers</Link>
                                        <Link href="#" className="text-[10px] font-sans font-bold text-gray-400 hover:text-primary uppercase tracking-[0.2em] block transition-colors">Gift Cards</Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Mobile Menu Toggle (Left) */}
                    <button 
                        className="lg:hidden text-primary"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Center: Logo */}
                    <div className="flex justify-center flex-1">
                        <Link href="/" className="flex-shrink-0">
                            <span className="font-heading font-normal text-3xl md:text-4xl tracking-tighter text-primary">
                                DIMENSIONS
                            </span>
                        </Link>
                    </div>

                    {/* Right: Enhanced Search & Actions */}
                    <div className="flex items-center gap-4 md:gap-8 justify-end">
                        <div className="hidden lg:flex items-center gap-0 relative w-[400px] xl:w-[500px]">
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[140px] h-10 rounded-l-full rounded-r-none border-r-0 border-gray-200 bg-gray-50/50 text-[10px] font-sans font-bold uppercase tracking-widest focus:ring-0">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                    <SelectItem value="all" className="text-[10px] font-sans font-bold uppercase tracking-widest">All</SelectItem>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat.toLowerCase()} className="text-[10px] font-sans font-bold uppercase tracking-widest">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="relative flex-1">
                                <Input 
                                    type="text" 
                                    placeholder="Search for sarees, lehengas..."
                                    className="w-full h-10 pl-10 pr-4 rounded-l-none rounded-r-full border-gray-200 focus-visible:ring-accent/20 focus-visible:border-accent text-[11px] font-sans bg-gray-50/50"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            </div>
                        </div>
                        <Link href="#" className="text-primary hover:text-accent transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
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
                            <li key={cat}>
                                <Link 
                                    href="#" 
                                    className="text-sm font-sans font-bold text-primary uppercase tracking-[0.2em] flex items-center justify-between"
                                >
                                    {cat}
                                    <ChevronDown className="w-4 h-4 opacity-30" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-20 space-y-6 pt-12 border-t border-gray-100">
                        <Link href="#" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors">My Profile</Link>
                        <Link href="#" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors">Track your order</Link>
                        <Link href="#" className="text-xs font-sans font-medium text-gray-500 uppercase tracking-widest block transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
