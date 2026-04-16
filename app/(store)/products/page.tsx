"use client"

import { FiltersSidebar } from "@/components/product/FiltersSidebar"
import { ProductGrid } from "@/components/product/ProductGrid"
import { SortDropdown } from "@/components/product/SortDropdown"
import { ProductPagination } from "@/components/product/Pagination"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

import { useEffect, useState, useCallback, useMemo } from "react"
import { ProductRow, Product } from "@/types"

// Frontend-friendly Product interface extending the DB row
interface FilteredProduct extends Omit<ProductRow, 'category_id' | 'subcategory_id'> {
    category?: string
    colors?: string[]
    sizes?: string[]
}

export default function ProductsPage() {
    const [sort, setSort] = useState("featured")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter State
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState([0, 10000])

    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchProducts = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
                params.append("category", selectedCategories[0]) // Sending first for MVP
            }
            if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString())
            if (priceRange[1] < 100000) params.append("maxPrice", priceRange[1].toString())
            if (selectedSizes.length > 0) params.append("sizes", selectedSizes.join(","))
            if (selectedColors.length > 0) params.append("colors", selectedColors.join(","))

            const res = await fetch(`/api/products?${params.toString()}`)
            if (!res.ok) throw new Error("Failed to fetch products")
            const json = await res.json()
            
            // Map the API FilteredProduct to the standard Product interface
            const mappedProducts: Product[] = (json.data || []).map((p: FilteredProduct) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                category: p.category || '',
                image: p.images?.[0] || '', // take first image
                colors: p.colors || [],
                discount: p.discount || 0,
                rating: p.rating || 0,
                reviews: p.reviews_count || 0,
                inStock: p.is_in_stock ?? true,
                description: p.description || '',
                sizes: p.sizes || [],
                featured: p.is_featured || false,
                slug: p.slug,
                originalPrice: p.original_price,
            }))

            setProducts(mappedProducts)
        } catch (error) {
            console.error("Error loading products:", error)
        } finally {
            setIsLoading(false)
        }
    }, [selectedCategories, priceRange, selectedSizes, selectedColors])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Sorting must be applied client-side because our API only returns standard DB order currently
    const sortedProducts = useMemo(() => {
        return [...products].sort((a, b) => {
            if (sort === "price-asc") return a.price - b.price
            if (sort === "price-desc") return b.price - a.price
            // "newest" roughly fallback
            if (sort === "newest") return b.id.localeCompare(a.id)
            return 0 // featured/default
        })
    }, [products, sort])

    // Pagination Logic
    const PRODUCTS_PER_PAGE = 8
    const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    )

    const filterProps = {
        selectedCategories,
        setSelectedCategories,
        selectedSizes,
        setSelectedSizes,
        selectedColors,
        setSelectedColors,
        priceRange,
        setPriceRange
    }

    return (
        <div className="min-h-screen bg-white pt-8 pb-8">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-primary/30 pb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[10px] tracking-[0.2em] text-primary/60 hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-accent/40" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <span className="text-accent uppercase tracking-[0.4em] text-[12px] font-bold font-sans">Explore our Products</span>

                        </div>
                        <div className="flex items-center gap-6">
                            <FiltersSidebar isMobile {...filterProps} />
                            <SortDropdown currentSort={sort} onSortChange={setSort} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar (Desktop) */}
                    <aside className="hidden border-r border-primary/30 pt-8 pr-10 lg:block w-72 flex-shrink-0">
                        <FiltersSidebar {...filterProps} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 pt-8">
                        <div className="mb-8 text-[11px] text-primary uppercase tracking-[0.2em] font-sans font-bold opacity-80">
                            Showing {paginatedProducts.length} of {sortedProducts.length} contemporary pieces
                        </div>

                        {sortedProducts.length > 0 ? (
                            <>
                                <ProductGrid products={paginatedProducts} />

                                {totalPages > 1 && (
                                    <ProductPagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-text-secondary space-y-8">
                                <p className="text-xl font-heading tracking-wide">No exquisite pieces match your current selection.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedCategories([])
                                        setSelectedSizes([])
                                        setSelectedColors([])
                                        setPriceRange([0, 100000])
                                    }}
                                    className="inline-flex items-center justify-center bg-primary text-secondary text-[10px] font-sans font-bold uppercase tracking-[0.25em] px-10 py-4 flex-shrink-0 h-12 rounded-full transition-all duration-500 hover:bg-black"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
