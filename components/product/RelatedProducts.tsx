"use client"

import { Product, ProductCard } from "./ProductCard"

interface RelatedProductsProps {
    currentProductId: string
}

// Mock Data
const RELATED_PRODUCTS: Product[] = [
    { id: "2", title: "Royal Kanjivaram Silk", price: 12999, category: "Kanjivaram", image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=800", discount: 10, rating: 4.8, inStock: true },
    { id: "3", title: "Handwoven Banarasi Zari", price: 15499, category: "Banarasi", image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=800", discount: 0, rating: 4.2, inStock: true },
    { id: "4", title: "Soft Silk Pastel Edit", price: 8999, category: "Soft Silk", image: "https://images.pexels.com/photos/10189113/pexels-photo-10189113.jpeg?auto=compress&cs=tinysrgb&w=800", discount: 0, rating: 4.0, inStock: true },
    { id: "6", title: "Linen Cotton Handloom", price: 4599, category: "Cotton & Linen", image: "https://images.pexels.com/photos/10189106/pexels-photo-10189106.jpeg?auto=compress&cs=tinysrgb&w=800", discount: 15, rating: 4.6, inStock: true },
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
