import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function FeaturedDrop() {
    return (
        <section className="py-8 md:py-15 bg-white relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.02] -z-10" />

            <div className="max-w-[1280px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-center">

                    {/* Visual */}
                    <div className="lg:col-span-6 relative aspect-[3/4] w-full max-w-lg mx-auto lg:mx-0 group">
                        <div className="relative w-full h-full overflow-hidden shadow-2xl">
                            <Image
                                src="https://www.sourcesplash.com/i/random?q=indian-dress&w=800&h=1200"
                                alt="Contemporary Dresses Collection"
                                fill
                                className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/5" />
                        </div>

                        {/* Asymmetrical Frame Overlay */}
                        <div className="absolute -top-10 -right-10 w-full h-full border border-primary/5 -z-10 hidden md:block" />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-6 space-y-12">
                        <div className="space-y-8">
                            <div className="flex flex-col text-left space-y-3">
                                <span className="text-[10px] text-accent uppercase tracking-[0.4em] font-sans font-bold">
                                    The Summer Edit
                                </span>
                                <h2 className="font-heading font-normal text-3xl md:text-4xl text-primary tracking-tight">
                                    Contemporary <span>Dresses</span>
                                </h2>
                            </div>

                            <p className="font-sans text-primary/60 text-sm md:text-base max-w-md leading-relaxed tracking-wide pt-2">
                                Step into effortless grace with our meticulously crafted dresses. Designed with flowing silhouettes, premium fabrics, and modern cuts for the contemporary wardrobe. From breezy daytime midis to elegant evening maxis, find your perfect fit.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center pt-6">
                            <Link
                                href="/collections/dresses"
                                className="inline-flex items-center justify-center bg-primary text-secondary text-[10px] font-sans font-bold uppercase tracking-[0.25em] px-10 py-4 rounded-full transition-all duration-500 hover:bg-black"
                            >
                                Shop Dresses
                            </Link>
                            <Link
                                href="/lookbook"
                                className="group inline-flex items-center gap-4 text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-primary transition-all hover:text-accent"
                            >
                                <span className="border-b border-primary/20 pb-1 group-hover:border-accent transition-colors">
                                    Explore Lookbook
                                </span>
                                <ArrowRight className="w-4 h-4 translate-x-0 transition-transform duration-500 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
