
import Link from "next/link"
import Image from "next/image"

const CATEGORIES = [
    { title: "Kanjivaram", href: "/collections/kanjivaram", count: "01", image: "https://images.unsplash.com/photo-1596455113045-3129ba0ec15f?q=80&w=800&auto=format&fit=crop" },
    { title: "Banarasi", href: "/collections/banarasi", count: "02", image: "https://images.unsplash.com/photo-1589467380922-38e9ab51cbff?q=80&w=800&auto=format&fit=crop" },
    { title: "Soft Silk", href: "/collections/soft-silk", count: "03", image: "https://images.unsplash.com/photo-1616086772718-4775d73489fe?q=80&w=800&auto=format&fit=crop" },
    { title: "Cotton & Linen", href: "/collections/cotton-linen", count: "04", image: "https://images.unsplash.com/photo-1601248476481-8073b9e43670?q=80&w=800&auto=format&fit=crop" },
]

export function CategorySection() {
    return (
        <section className="py-24 bg-background text-text-primary px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold">Discover</span>
                    <h2 className="font-heading text-4xl md:text-5xl font-normal tracking-wide text-primary">Shop by Weave</h2>
                    <div className="w-24 h-px bg-accent mx-auto mt-6"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="group flex flex-col items-center gap-6"
                        >
                            <div className="relative w-full aspect-[3/4] rounded-t-full overflow-hidden border border-border/50 bg-secondary shadow-sm">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 border-[4px] border-background/20 rounded-t-full z-10 m-2 pointer-events-none"></div>
                            </div>
                            <div className="text-center space-y-2">
                                <span className="font-heading font-normal text-xl md:text-2xl text-text-primary group-hover:text-primary transition-colors tracking-wide">
                                    {cat.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
