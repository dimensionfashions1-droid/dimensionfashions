"use client"

import { ProductCard } from "./ProductCard"
import { Product } from "@/types"

interface RelatedProductsProps {
    currentProductId: string
}

// Mock Data
const RELATED_PRODUCTS: Product[] = [
    { id: "2", title: "Zari Weave Lehenga", price: 24999, category: "Lehengas", image: "https://www.sourcesplash.com/i/random?q=lehenga,bridal&w=1200&h=1600" },
    { id: "3", title: "Pastel Kurta Set", price: 4999, category: "Kurta Sets", image: "https://www.sourcesplash.com/i/random?q=kurta-set,indian-fashion&w=1200&h=1600" },
    { id: "4", title: "Floral Summer Dress", price: 2999, category: "Dresses", image: "https://www.sourcesplash.com/i/random?q=women-dress,floral&w=1200&h=1600" },
    { id: "6", title: "Evening Glam Gown", price: 8999, category: "Gowns", image: "https://www.sourcesplash.com/i/random?q=evening-gown,party&w=1200&h=1600" },
]

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    // Filter out current product if strictly needed, but for mock data we just show 4
    const productsToShow = RELATED_PRODUCTS.slice(0, 4)

    return (
        <div className="py-0 border-t border-primary/5">
            <h2 className="font-heading font-normal text-3xl md:text-4xl uppercase tracking-[0.1em] mb-16 text-primary">You May Also <span>Like</span></h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {productsToShow.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
