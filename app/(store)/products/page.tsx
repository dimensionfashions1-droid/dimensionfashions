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

import { useState } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import useSWR from "swr"
import { useDebounce } from "use-debounce"
import { ProductRow, Product } from "@/types"

// Frontend-friendly Product interface extending the DB row
interface FilteredProduct extends Omit<ProductRow, 'category_id' | 'subcategory_id'> {
    category?: string
    colors?: string[]
    sizes?: string[]
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [sort, setSort] = useState(searchParams.get("sort") || "featured")
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)

    // Filter State
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        searchParams.get("category") ? [searchParams.get("category") as string] : []
    )
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState([0, 100000])

    const [debouncedPriceRange] = useDebounce(priceRange, 500)
    const searchString = searchParams.get("search")

    // Build URL for SWR
    const queryString = new URLSearchParams()
    queryString.append("page", currentPage.toString())
    queryString.append("limit", "8")
    queryString.append("sort", sort)
    if (searchString) queryString.append("search", searchString)
    if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
        queryString.append("category", selectedCategories[0])
    }
    if (selectedSizes.length > 0) queryString.append("sizes", selectedSizes.join(","))
    if (selectedColors.length > 0) queryString.append("colors", selectedColors.join(","))
    
    // Always include debounced price unless it's exactly 0-100000 (default max breadth)
    if (debouncedPriceRange[0] > 0) queryString.append("minPrice", debouncedPriceRange[0].toString())
    if (debouncedPriceRange[1] < 100000) queryString.append("maxPrice", debouncedPriceRange[1].toString())

    // Fetch via SWR
    const { data: response, error, isLoading } = useSWR(`/api/products?${queryString.toString()}`, fetcher)

    // Compute UI Variables from SWR Data
    const rawProducts = response?.data || []
    const meta = response?.meta

    const products: Product[] = rawProducts.map((p: FilteredProduct) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        category: p.category || '',
        image: p.images?.[0] || '', // grab first array item safely
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

    const totalPages = meta?.totalPages || 1

    const filterProps = {
        selectedCategories,
        setSelectedCategories,
        selectedSizes,
        setSelectedSizes,
        selectedColors,
        setSelectedColors,
        priceRange,
        setPriceRange,
        availableColors: meta?.filters?.colors || [],
        availableSizes: meta?.filters?.sizes || [],
        absoluteMinPrice: meta?.minPrice || 0,
        absoluteMaxPrice: meta?.maxPrice || 100000
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
                    <main className="flex-1 pt-8 min-h-[500px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-[10px] tracking-widest uppercase font-sans text-primary/60">Curating Selection...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-32 text-red-500">
                                <p className="text-sm font-sans">Error loading products. Please try again.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8 text-[11px] text-primary uppercase tracking-[0.2em] font-sans font-bold opacity-80">
                                    Showing {products.length} of {meta?.total || 0} contemporary pieces
                                </div>

                                {products.length > 0 ? (
                                    <>
                                        <ProductGrid products={products} />

                                        {totalPages > 1 && (
                                            <ProductPagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={(page) => {
                                                    setCurrentPage(page)
                                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                                }}
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
                        </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
