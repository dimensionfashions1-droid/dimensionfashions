"use client"

import useSWR from "swr"
import { ProductCard } from "./ProductCard"
import { Product, ProductRow } from "@/types"

interface RelatedProductsProps {
    currentProductId: string
    categorySlug?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function RelatedProducts({ currentProductId, categorySlug }: RelatedProductsProps) {
    // Fetch products from the same category
    const { data: response, isLoading } = useSWR(
        categorySlug ? `/api/products?category=${categorySlug}&limit=5` : null,
        fetcher
    )

    if (isLoading || !response?.data) {
        return <div className="h-40 flex items-center justify-center opacity-20">Loading Recommendations...</div>
    }

    // Filter out current product and map to UI Product interface
    const products: Product[] = response.data
        .filter((p: any) => p.id !== currentProductId)
        .slice(0, 4)
        .map((p: any) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            category: p.category || 'Collection',
            image: p.images?.[0] || '',
            slug: p.slug,
            rating: p.rating,
            discount: p.discount,
        }))

    if (products.length === 0) return null

    return (
        <div className="py-20 border-t border-primary/5">
            <h2 className="font-heading font-normal text-3xl md:text-4xl uppercase tracking-[0.1em] mb-16 text-primary">You May Also <span>Like</span></h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}
