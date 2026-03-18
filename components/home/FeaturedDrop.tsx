import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export function FeaturedDrop() {
    return (
        <section className="py-24 md:py-40 bg-background relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/[0.02] -z-10" />
            
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 lg:gap-32 items-center">
                    
                    {/* Visual */}
                    <div className="lg:col-span-6 relative aspect-[3/4] w-full max-w-lg mx-auto lg:mx-0 group">
                        <div className="relative w-full h-full overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=1600"
                                alt="The Bridal Trousseau"
                                fill
                                className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                        
                        {/* Asymmetrical Frame Overlay */}
                        <div className="absolute -top-10 -right-10 w-full h-full border border-primary/5 -z-10 hidden md:block" />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-6 space-y-12">
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <span className="text-accent font-sans tracking-[0.5em] font-bold uppercase text-[10px] md:text-xs">
                                    Limited Occasion
                                </span>
                                <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-heading font-normal leading-[0.85] tracking-tighter text-primary">
                                    The <br />
                                    <span className="italic block pl-12 md:pl-24">Trousseau</span>
                                </h2>
                            </div>

                            <p className="font-sans text-primary/60 text-base md:text-lg max-w-md leading-relaxed tracking-wide pt-4">
                                Handwoven in the temple towns of Tamil Nadu, each piece in this drop is a testament to the unyielding spirit of Indian weaves.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center pt-6">
                            <Link 
                                href="/collections/ethereal-bloom"
                                className="inline-block bg-primary text-secondary text-[11px] font-sans font-bold uppercase tracking-[0.3em] px-10 py-5 transition-all duration-500 hover:opacity-90 shadow-xl"
                            >
                                Shop the Drop
                            </Link>
                            <Link 
                                href="/lookbook"
                                className="group inline-flex items-center gap-4 text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-primary"
                            >
                                Exploring the Lookbook
                                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
