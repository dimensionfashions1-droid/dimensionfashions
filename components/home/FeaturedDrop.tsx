
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FeaturedDrop() {
    return (
        <section className="py-20 bg-background text-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Content */}
                    <div className="space-y-8 order-2 lg:order-1">
                        <div className="space-y-2">
                            <span className="text-neutral-500 font-mono tracking-widest uppercase text-sm">Exclusive Drop</span>
                            <h2 className="text-5xl md:text-7xl font-heading font-black uppercase leading-tight tracking-tight">
                                Cyber<br />
                                <span className="text-transparent stroke-text">Construct</span>
                            </h2>
                        </div>

                        <p className="text-neutral-400 text-lg max-w-md leading-relaxed">
                            Engineered for the urban nomad. Technical fabrics meet avant-garde silhouettes in our most advanced collection yet.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button asChild className="rounded-full bg-white text-black hover:bg-neutral-200 px-8 py-6 font-bold uppercase tracking-wide">
                                <Link href="/collections/cyber">
                                    Shop Collection
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="rounded-full border-neutral-700 hover:bg-neutral-900 hover:text-white px-8 py-6 font-bold uppercase tracking-wide text-white">
                                <Link href="/lookbook/cyber">
                                    View Lookbook
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative h-[600px] w-full order-1 lg:order-2 group">
                        <Image
                            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=2000&auto=format&fit=crop"
                            alt="Cyber Construct"
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                        />
                        {/* Border Frame */}
                        <div className="absolute inset-4 border border-white/10 z-20 pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    )
}
