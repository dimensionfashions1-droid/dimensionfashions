import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-primary text-secondary py-16 md:py-24 border-t border-primary/20">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-1 space-y-6">
                        <span className="font-heading font-normal text-3xl tracking-wide block text-secondary">
                            ANTIGRAVITY
                        </span>
                        <p className="text-secondary/70 text-sm leading-relaxed max-w-xs font-sans">
                            Preserving handwoven heritage. Curating the finest pure silk sarees for the modern Indian woman.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div className="space-y-6">
                        <h4 className="font-sans font-medium uppercase tracking-[0.2em] text-xs text-secondary/50">Collections</h4>
                        <ul className="space-y-4">
                            {["Kanjivaram", "Banarasi", "Soft Silk", "Bridal Wear", "Accessories"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-sans text-secondary/80 hover:text-accent transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-6">
                        <h4 className="font-sans font-medium uppercase tracking-[0.2em] text-xs text-secondary/50">Support</h4>
                        <ul className="space-y-4">
                            {["Contact Us", "Shipping & Returns", "Track Order", "Size Guide", "FAQ"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm font-sans text-secondary/80 hover:text-accent transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-6">
                        <h4 className="font-sans font-medium uppercase tracking-[0.2em] text-xs text-secondary/50">Join the Collective</h4>
                        <p className="text-sm font-sans text-secondary/70">
                            Subscribe to receive exclusive access to new weave drops and private sales.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent border-b border-secondary/30 pb-2 text-sm font-sans w-full focus:outline-none focus:border-accent text-secondary placeholder:text-secondary/50 transition-colors"
                            />
                            <button type="submit" className="text-accent hover:text-secondary uppercase tracking-[0.2em] text-xs font-sans font-bold p-2 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-secondary/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-sans text-secondary/50">
                        &copy; {new Date().getFullYear()} ANTIGRAVITY. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {["Privacy Policy", "Terms of Service"].map((item) => (
                            <Link key={item} href="#" className="text-xs font-sans text-secondary/50 hover:text-accent transition-colors">
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
