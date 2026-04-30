import { ProductCard } from "./ProductCard"
import { Product } from "@/types"

interface ProductGridProps {
    products: Product[]
    isAuthenticated?: boolean
}

export function ProductGrid({ products, isAuthenticated }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-neutral-500">No products found.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-10">
            {products.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    isAuthenticated={isAuthenticated} 
                />
            ))}
        </div>
    )
}
