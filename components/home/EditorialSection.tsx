
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function EditorialSection() {
    return (
        <section className="py-24 md:py-40 bg-background overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
                    
                    {/* LEFT: Text Content */}
                    <div className="lg:col-span-5 space-y-12 order-2 lg:order-1">
                        <div className="space-y-6">
                            <span className="text-primary/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-sans font-bold block">
                                The Masterpiece
                            </span>
                            <h2 className="font-heading font-normal text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-primary tracking-tighter">
                                Heirloom <br />
                                <span className="italic text-accent">Kanjivaram</span>
                            </h2>
                        </div>
                        
                        <p className="font-sans text-primary/60 text-base md:text-lg max-w-md leading-relaxed tracking-wide">
                            Each silk thread is dipped in liquid silver and gold, meticulously handwoven over sixty days to create a drape that transcends generations.
                        </p>

                        <div className="pt-6">
                            <Link 
                                href="/collections/kanjivaram"
                                className="group inline-flex items-center gap-4 text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-primary"
                            >
                                View Detailed Craftsmanship
                                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: Visual Image (Asymmetrical) */}
                    <div className="lg:col-span-7 relative order-1 lg:order-2">
                        <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] w-full max-w-2xl mx-auto lg:ml-auto">
                            <div className="absolute inset-0 bg-primary/5 -m-4 -z-10" />
                            <div className="relative w-full h-full overflow-hidden grayscale-[0.2] hover:grayscale-0 transition-all duration-1000">
                                <Image
                                    src="/images/editorial.jpg"
                                    alt="Editorial Saree Craftsmanship"
                                    fill
                                    className="object-cover transform transition-transform duration-[2000ms] hover:scale-110"
                                />
                            </div>
                            
                            {/* Decorative Text Overlay */}
                            <div className="absolute -bottom-8 -left-8 lg:-left-16 bg-background p-8 md:p-12 border border-primary/5 hidden md:block">
                                <span className="font-heading italic text-4xl text-primary opacity-20 block leading-none">60 Days</span>
                                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-primary/40 block mt-2">To weave one legacy</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
