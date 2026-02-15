import { ProductCard, Product } from "./ProductCard"

interface ProductListProps {
    title: string
    products: Product[]
}

export function ProductList({ title, products, className }: ProductListProps & { className?: string }) {
    return (
        <section className={` ${className}`}>
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-end justify-between mb-12">
                    <h2 className="font-heading font-bold text-3xl md:text-5xl uppercase tracking-tighter">
                        {title}
                    </h2>
                    <span className="hidden md:block text-muted-foreground text-sm font-mono">
                        [{products.length} ITEMS]
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
