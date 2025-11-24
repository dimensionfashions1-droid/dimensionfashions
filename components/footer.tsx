"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pattern-grid">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="border-b border-border py-12 mb-12">
          <div className="max-w-md">
            <h3 className="text-3xl font-serif font-bold text-foreground mb-3">Subscribe</h3>
            <p className="text-muted-foreground mb-6 font-sans">
              Stay updated with our latest collections and exclusive offers
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-[rgb(218_184_105)] focus:border-[rgb(218_184_105)] font-sans"
              />
              <button className="px-6 py-3 bg-[rgb(218_184_105)] text-black rounded-lg hover:bg-[rgb(208_174_95)] transition-colors font-semibold font-sans">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h4 className="text-lg font-serif font-bold text-foreground mb-4">Silkara</h4>
            <p className="text-muted-foreground text-sm leading-relaxed font-sans">
              Luxury sarees crafted with tradition and contemporary design. Experience timeless elegance.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h5 className="font-semibold text-foreground mb-4 font-sans uppercase text-sm tracking-wide">Shop</h5>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Silk Sarees
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Cotton Sarees
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Designer Sarees
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Bridal Sarees
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="font-semibold text-foreground mb-4 font-sans uppercase text-sm tracking-wide">Company</h5>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold text-foreground mb-4 font-sans uppercase text-sm tracking-wide">Legal</h5>
            <ul className="space-y-3 text-sm font-sans">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-[rgb(218_184_105)] transition-colors duration-300"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6 pb-8">
          <p className="text-muted-foreground text-sm font-sans">© 2025 Silkara. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-full hover:bg-muted transition-all text-foreground hover:text-[rgb(218_184_105)]"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-muted transition-all text-foreground hover:text-[rgb(218_184_105)]"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-muted transition-all text-foreground hover:text-[rgb(218_184_105)]"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 rounded-full hover:bg-muted transition-all text-foreground hover:text-[rgb(218_184_105)]"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
