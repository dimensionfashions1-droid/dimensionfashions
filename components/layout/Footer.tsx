
import Link from "next/link"

export function Footer() {


    return (
        <footer className="bg-primary text-secondary">

            <div className="py-8 md:py-12">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                        {/* Brand Section */}
                        <div className="lg:col-span-4 space-y-10">
                            <span className="font-heading font-normal text-4xl tracking-tight block text-secondary">
                                DIMENSIONS
                            </span>
                            <p className="text-secondary/50 text-sm leading-relaxed max-w-xs font-sans tracking-wide">
                                A curated collection of premium women's wear, dedicated to empowering the modern woman with elegance and style.
                            </p>
                        </div>

                        {/* Shop Links */}
                        <div className="lg:col-span-3 space-y-8">
                            <h4 className="font-sans font-medium uppercase tracking-[0.3em] text-[10px] text-secondary/40">Collections</h4>
                            <ul className="space-y-5">
                                {["Dresses", "Tops", "Outerwear", "Bridal Wear", "New Arrivals"].map((item) => (
                                    <li key={item}>
                                        <Link href="#" className="text-sm font-sans text-secondary/70 hover:text-accent transition-colors tracking-wide">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="lg:col-span-5 space-y-10">
                            <div className="space-y-4">
                                <h4 className="font-sans font-medium uppercase tracking-[0.3em] text-[10px] text-secondary/40">The Collective</h4>
                                <p className="text-base font-heading text-secondary tracking-wide">
                                    Receive exclusive access to new arrivals and private collection previews.
                                </p>
                            </div>
                            <form className="flex gap-4 border-b border-secondary/20 pb-4 focus-within:border-secondary transition-colors group">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="bg-transparent text-sm font-sans w-full focus:outline-none text-secondary placeholder:text-secondary/30 transition-colors tracking-widest uppercase"
                                    suppressHydrationWarning={true}
                                />
                                <button
                                    type="submit"
                                    className="text-accent hover:text-secondary uppercase tracking-[0.2em] text-[10px] font-sans font-bold transition-colors"
                                    suppressHydrationWarning={true}
                                >
                                    JOIN
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-12 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="text-[10px] font-sans text-secondary/30 uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} DIMENSIONS. PREMIUM WOMEN'S WEAR.
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
