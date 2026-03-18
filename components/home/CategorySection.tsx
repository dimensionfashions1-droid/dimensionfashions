
import Link from "next/link"
import Image from "next/image"

const CATEGORIES = [
    { 
        title: "Kanjivaram", 
        href: "/collections/kanjivaram", 
        image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=800",
        tag: "Timeless"
    },
    { 
        title: "Banarasi", 
        href: "/collections/banarasi", 
        image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=800",
        tag: "Regal"
    },
    { 
        title: "Soft Silk", 
        href: "/collections/soft-silk", 
        image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=800",
        tag: "Fluid"
    },
    { 
        title: "Linen", 
        href: "/collections/cotton-linen", 
        image: "https://images.pexels.com/photos/10189113/pexels-photo-10189113.jpeg?auto=compress&cs=tinysrgb&w=800",
        tag: "Earthy"
    },
    { 
        title: "Fusion", 
        href: "/collections/fusion", 
        image: "https://images.pexels.com/photos/10189028/pexels-photo-10189028.jpeg?auto=compress&cs=tinysrgb&w=800",
        tag: "Modern"
    }
]

export function CategorySection() {
    return (
        <section className="py-24 md:py-40 bg-background overflow-hidden">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-6">
                        <span className="text-primary/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-sans font-bold block">
                            The Weave Studio
                        </span>
                        <h2 className="font-heading text-4xl md:text-6xl font-normal tracking-tight text-primary leading-none">
                            Shop by <span className="italic">Craft</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="group flex flex-col gap-6"
                        >
                            <div className="relative aspect-[3/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-[1200ms] shadow-lg">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                                />
                                <div className="absolute top-6 right-6">
                                    <span className="bg-white/90 backdrop-blur-sm text-[8px] uppercase tracking-[0.3em] font-sans font-bold px-3 py-1 text-primary">
                                        {cat.tag}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="font-heading font-normal text-2xl text-primary tracking-tight transition-colors group-hover:text-accent">
                                    {cat.title}
                                </h3>
                                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/30 border-b border-primary/5 pb-1 transition-all group-hover:border-accent">
                                    Explore Piece
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
