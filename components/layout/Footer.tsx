import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-card text-card-foreground pt-20 pb-10 ">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    <div className="md:col-span-2">
                        <h2 className="font-heading font-bold text-4xl md:text-5xl tracking-tighter mb-6">
                            DIMENSIONS
                        </h2>
                        <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
                            Redefining modern menswear with minimal, confident, and premium designs for today's generation.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6 uppercase tracking-widest">Shop</h3>
                        <ul className="flex flex-col gap-4 text-muted-foreground">
                            {["New Arrivals", "Best Sellers", "Apparel", "Accessories", "Sale"].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="hover:text-foreground transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6 uppercase tracking-widest">Support</h3>
                        <ul className="flex flex-col gap-4 text-muted-foreground">
                            {["Contact Us", "Shipping & Returns", "Size Guide", "FAQ", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-foreground transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 text-muted-foreground text-sm">
                    <p>© {new Date().getFullYear()} DIMENSIONS. All rights reserved.</p>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-foreground">Instagram</Link>
                        <Link href="#" className="hover:text-foreground">Twitter</Link>
                        <Link href="#" className="hover:text-foreground">LinkedIn</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
