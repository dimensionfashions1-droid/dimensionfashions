
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FeaturedDrop() {
    return (
        <section className="py-24 md:py-32 bg-background border-t border-border/40 text-text-primary overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Content */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="space-y-4">
                            <span className="text-accent font-sans tracking-[0.3em] font-bold uppercase text-xs">Festive Exclusive</span>
                            <h2 className="text-5xl md:text-7xl font-heading font-normal capitalize leading-[1.1] tracking-wide text-primary">
                                The Bridal<br />
                                <span className="italic">Trousseau</span>
                            </h2>
                        </div>

                        <p className="text-text-secondary text-lg max-w-md leading-relaxed font-sans">
                            Crafted for the modern bride. Heirloom quality silks meet timeless motifs in our most auspicious and powerful collection yet.
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <Button asChild className="rounded-none bg-primary text-secondary hover:bg-primary/90 hover:text-white font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-6 transition-colors">
                                <Link href="/collections/ethereal-bloom">Shop the Collection</Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-none border-primary/20 bg-transparent text-primary hover:bg-primary/5 font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-6 transition-colors">
                                <Link href="/lookbook">View Lookbook</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative h-[600px] w-full max-w-md mx-auto order-1 lg:order-2 group">
                        <div className="relative w-full h-full rounded-t-[1000px] rounded-b-full overflow-hidden border border-primary/20 shadow-md">
                            <Image
                                src="https://images.unsplash.com/photo-1583391733959-b1587d54b815?q=80&w=2000&auto=format&fit=crop"
                                alt="The Bridal Trousseau"
                                fill
                                className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 border-[4px] border-background/30 rounded-t-[1000px] rounded-b-full z-10 m-2 pointer-events-none"></div>
                        </div>
                        {/* Decorative Element */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-accent rounded-full opacity-30 animate-spin-slow pointer-events-none" />
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary rounded-full opacity-5 blur-2xl pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    )
}
