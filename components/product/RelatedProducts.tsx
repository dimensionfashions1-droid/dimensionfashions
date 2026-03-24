"use client"

import { Product, ProductCard } from "./ProductCard"

interface RelatedProductsProps {
    currentProductId: string
}

// Mock Data
const RELATED_PRODUCTS: Product[] = [
    { id: "2", title: "Royal Kanjivaram Silk", price: 12999, category: "Kanjivaram", image: "https://images.unsplash.com/photo-1595777457583-95e059f581eb?auto=format&fit=crop&q=80&w=800" },
    { id: "3", title: "Handwoven Banarasi Zari", price: 15499, category: "Banarasi", image: "https://images.unsplash.com/photo-1610030469983-98e500b71826?auto=format&fit=crop&q=80&w=800" },
    { id: "4", title: "Soft Silk Pastel Edit", price: 8999, category: "Soft Silk", image: "https://images.unsplash.com/photo-1555529771-331e84ae5b86?auto=format&fit=crop&q=80&w=800" },
    { id: "6", title: "Linen Cotton Handloom", price: 4599, category: "Cotton & Linen", image: "https://images.unsplash.com/photo-1594917172018-9366eecf46f4?auto=format&fit=crop&q=80&w=800" },
]

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    // Filter out current product if strictly needed, but for mock data we just show 4
    const productsToShow = RELATED_PRODUCTS.slice(0, 4)

    return (
        <div className="py-20 border-t border-border">
            <h2 className="font-heading font-normal text-3xl uppercase tracking-wide mb-12 text-primary">You May Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
                {productsToShow.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
