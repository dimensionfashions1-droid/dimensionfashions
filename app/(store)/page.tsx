import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/product/ProductList"
import { HeroCarousel } from "@/components/hero/HeroCarousel"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
    // Mock Data - CLOTHES ONLY
    const features = [
        { id: "1", title: "Oversized Structured Tee", price: 2499, category: "Tops", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop" },
        { id: "2", title: "Wide Leg Pleated Trousers", price: 3999, category: "Bottoms", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop" },
        { id: "3", title: "Utility Vest Black", price: 4599, category: "Outerwear", image: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=1762&auto=format&fit=crop" },
        { id: "4", title: "Boxy Fit Shirt", price: 2999, category: "Tops", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop" },
    ]

    return (
        <>
            <HeroCarousel />

            {/* Introduction / Statement - BLACK BACKGROUND */}
            <section className="py-20 md:py-32 border-b border-border/40 bg-background text-foreground">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <p className="font-heading font-medium text-2xl md:text-5xl leading-snug uppercase tracking-tight">
                        "Clothing is the physical manifestation of your <span className="text-muted-foreground line-through decoration-1">personality</span> dimensions."
                    </p>
                </div>
            </section>

            {/* Trending / New Arrivals Grid - WHITE BACKGROUND */}
            <div className="bg-neutral-50 text-black">
                <ProductList title="Latest Drops" products={features} />
            </div>

            {/* Lookbook / Editorial Section - BLACK BACKGROUND */}
            <section className="py-0 border-t border-border/40">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-[600px] md:h-screen w-full bg-neutral-900">
                        <Image
                            src="https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=1887&auto=format&fit=crop"
                            alt="Editorial"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                    {/* BLACK CARD */}
                    <div className="flex flex-col justify-center p-8 md:p-24 space-y-8 bg-background text-foreground relative">
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest absolute top-8 left-8">001 — THE MONOCHROME EDIT</span>

                        <h2 className="font-heading font-bold text-5xl md:text-7xl uppercase leading-[0.9] tracking-tighter text-foreground">
                            Silent<br />Noise
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                            A collection defined by strict palettes and fluid silhouettes. We stripped away the unnecessary to reveal the essential structure of modern menswear.
                        </p>

                        <Link href="/collections/monochrome" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:underline underline-offset-4 text-foreground">
                            View Lookbook <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CLOTHING Categories Navigation - WHITE BACKGROUND */}
            <section className="py-24 border-t border-neutral-200 bg-neutral-50 text-black">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col space-y-4">
                        {["Tops", "Bottoms", "Outerwear", "Sets"].map((cat, i) => (
                            <Link key={cat} href={`/shop/${cat.toLowerCase()}`} className="group flex items-baseline justify-between border-b border-neutral-200 pb-4 hover:border-black transition-colors">
                                <span className="font-heading font-black text-4xl md:text-8xl w-full uppercase tracking-tighter text-transparent stroke-text group-hover:text-black transition-all duration-300">
                                    {cat}
                                </span>
                                <span className="font-mono text-sm text-neutral-500 group-hover:text-black">0{i + 1}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
