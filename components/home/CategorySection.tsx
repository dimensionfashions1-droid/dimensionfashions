
import Link from "next/link"

const CATEGORIES = [
    { title: "Tops", href: "/shop/tops", count: "01" },
    { title: "Bottoms", href: "/shop/bottoms", count: "02" },
    { title: "Outerwear", href: "/shop/outerwear", count: "03" },
    { title: "Accessories", href: "/shop/accessories", count: "04" },
    { title: "Footwear", href: "/shop/footwear", count: "05" },
    { title: "New Arrivals", href: "/shop/new-arrivals", count: "06" },
]

export function CategorySection() {
    return (
        <section className="py-20  bg-background text-foreground">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.title}
                            href={cat.href}
                            className="group flex items-baseline justify-between border-b border-border/40 pb-4 hover:border-primary transition-colors"
                        >
                            <span className="font-heading font-black text-4xl md:text-6xl lg:text-7xl w-full uppercase tracking-tighter text-transparent stroke-text group-hover:text-foreground transition-all duration-300">
                                {cat.title}
                            </span>
                            <span className="font-mono text-sm text-muted-foreground group-hover:text-foreground">
                                {cat.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
