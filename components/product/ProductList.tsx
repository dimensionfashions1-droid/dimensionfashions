import { ProductCard } from "./ProductCard"
import { Product } from "@/types"

interface ProductListProps {
    title: string
    products: Product[]
}

export function ProductList({ title, products, className }: ProductListProps & { className?: string }) {
    return (
        <section className={`py-24 md:py-40 bg-background ${className}`}>
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="space-y-6 max-w-2xl">
                        <span className="text-primary/40 uppercase tracking-[0.4em] text-[10px] md:text-xs font-sans font-bold block">
                            Curated Selection
                        </span>
                        <h2 className="font-heading font-normal text-4xl md:text-6xl text-primary tracking-tight">
                            {title}
                        </h2>
                    </div>
                    <div className="pb-2">
                        <button className="text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all duration-300">
                            View All Masterpieces
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
