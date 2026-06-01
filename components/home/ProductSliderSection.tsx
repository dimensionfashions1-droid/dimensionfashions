"use client"

import * as React from "react"
import { ProductCard } from "../product/ProductCard"
import { Product } from "@/types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"

import Autoplay from "embla-carousel-autoplay"

interface ProductSliderSectionProps {
    title: string;
    subtitle: string;
    topLabel: string;
    viewAllLink: string;
    viewAllText: string;
    fetchUrl: string;
    isAuthenticated?: boolean;
}

export function ProductSliderSection({ 
    title, 
    subtitle, 
    topLabel,
    viewAllLink, 
    viewAllText, 
    fetchUrl,
    isAuthenticated 
}: ProductSliderSectionProps) {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(fetchUrl);
                if (res.ok) {
                    const json = await res.json();
                    if (json.data) {
                        setProducts(json.data);
                    }
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProducts();
    }, [fetchUrl]);

    if (isLoading) {
        return (
            <section className="py-8 md:py-15 bg-white">
                <div className="max-w-[1280px] mx-auto px-4 flex justify-center py-20">
                    <Loader2 className="w-10 h-10 text-primary/20 animate-spin" />
                </div>
            </section>
        );
    }

    if (products.length === 0) return null;

    return (
        <section className="py-8 md:py-15 bg-white">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-6">
                    <div className="flex flex-col text-left space-y-3">
                        <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                            {topLabel}
                        </span>
                        <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                            {title} <span>{subtitle}</span>
                        </h2>
                    </div>

                    <Link
                        href={viewAllLink}
                        className="group inline-flex items-center gap-4 text-primary text-[10px] font-sans font-bold uppercase tracking-[0.3em] transition-all hover:text-accent"
                    >
                        <span className="border-b border-primary/20 pb-1 group-hover:border-accent transition-colors">
                            {viewAllText}
                        </span>
                        <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4 md:-ml-6">
                        {products.map((product) => (
                            <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                                <ProductCard product={product} isAuthenticated={isAuthenticated} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden lg:block">
                        <CarouselPrevious className="h-10 w-10 rounded-full border-gray-200 -left-5 bg-white/80 backdrop-blur-sm text-primary shadow-sm hover:shadow-lg hover:bg-white hover:border-accent/30 transition-all" />
                        <CarouselNext className="h-10 w-10 rounded-full border-gray-200 -right-5 bg-white/80 backdrop-blur-sm text-primary shadow-sm hover:shadow-lg hover:bg-white hover:border-accent/30 transition-all" />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}
