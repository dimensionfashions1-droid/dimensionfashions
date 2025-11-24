"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Menu, X, Search, LogIn, ChevronDown, Sparkles } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [wishlistCount] = useState(0)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const categories = [
    { name: "Banarasi", href: "#" },
    { name: "Silk Sarees", href: "#" },
    { name: "Cotton", href: "#" },
    { name: "Designer", href: "#" },
  ]

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gold/20">
      <div className="bg-black text-white text-center py-2 text-xs sm:text-sm font-medium">
        🎉 FREE SHIPPING ALL OVER INDIA | CASH ON DELIVERY AVAILABLE 🚚
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <div className="w-14 h-14 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold via-gold to-gold/80 flex items-center justify-center text-white font-serif font-bold text-xl md:text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-6 h-6 md:w-5 md:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base md:text-lg font-bold text-black">Silkara</span>
              <p className="text-xs text-gray-600 font-light">LUXURY SAREES</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-semibold text-black hover:text-gold transition-colors duration-200 flex items-center gap-1"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="text-sm font-semibold text-black hover:text-gold transition-colors duration-200 flex items-center gap-1">
                Collections
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 border border-gold/20">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="block px-4 py-2 text-sm text-black hover:bg-gold/10 hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="#" className="text-sm font-semibold text-black hover:text-gold transition-colors duration-200">
              About Us
            </Link>
            <Link href="#" className="text-sm font-semibold text-black hover:text-gold transition-colors duration-200">
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-black hover:text-gold">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gold/10 rounded-lg transition-colors text-black hover:text-gold relative">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>

            <CartDrawer />

            <Button className="hidden md:inline-flex bg-gold hover:bg-gold/90 text-black rounded-lg px-6 font-semibold shadow-md hover:shadow-lg transition-all duration-300">
              <LogIn className="w-4 h-4 mr-2" />
              Sign Up
            </Button>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-6 space-y-1 border-t border-gold/20 pt-4">
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-semibold hover:bg-gold/10 hover:text-gold rounded-lg transition-colors"
            >
              Home
            </Link>
            <div>
              <button
                onClick={() => setExpandedMenu(expandedMenu === "collections" ? null : "collections")}
                className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-gold/10 hover:text-gold rounded-lg transition-colors flex items-center justify-between"
              >
                Collections
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandedMenu === "collections" ? "rotate-180" : ""}`}
                />
              </button>
              {expandedMenu === "collections" && (
                <div className="pl-4 space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-4 py-2 text-xs text-gray-600 hover:text-gold"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="#"
              className="block px-4 py-2 text-sm font-semibold hover:bg-gold/10 hover:text-gold rounded-lg transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#"
              className="block px-4 py-2 text-sm font-semibold hover:bg-gold/10 hover:text-gold rounded-lg transition-colors"
            >
              Contact
            </Link>
            <div className="px-4 pt-2">
              <Button className="w-full bg-gold hover:bg-gold/90 text-black rounded-lg font-semibold">Sign Up</Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
