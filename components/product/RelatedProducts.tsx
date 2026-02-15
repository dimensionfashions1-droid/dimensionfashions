"use client"

import { Product, ProductCard } from "./ProductCard"

interface RelatedProductsProps {
    currentProductId: string
}

// Mock Data
const RELATED_PRODUCTS: Product[] = [
    { id: "2", title: "Wide Leg Pleated Trousers", price: 3999, category: "Bottoms", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop", discount: 10, rating: 4.8, inStock: true },
    { id: "3", title: "Utility Vest Black", price: 4599, category: "Outerwear", image: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=1762&auto=format&fit=crop", discount: 0, rating: 4.2, inStock: true },
    { id: "4", title: "Boxy Fit Shirt", price: 2999, category: "Tops", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop", discount: 0, rating: 4.0, inStock: true },
    { id: "6", title: "Minimalist Hoodie", price: 3499, category: "Tops", image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=987&auto=format&fit=crop", discount: 15, rating: 4.6, inStock: true },
]

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
    // Filter out current product if strictly needed, but for mock data we just show 4
    const productsToShow = RELATED_PRODUCTS.slice(0, 4)

    return (
        <div className="py-20 border-t border-neutral-800">
            <h2 className="font-heading font-bold text-3xl uppercase tracking-tight mb-12 text-white">You May Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
                {productsToShow.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
