"use client"

import { useState } from "react"
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

// Mock Data
const MOCK_PRODUCTS = [
    { id: "1", title: "Midnight Bloom Kanjivaram", price: 18499, category: "Sarees", image: "https://www.sourcesplash.com/i/random?q=kanjivaram-saree,indian-model&w=1200&h=1600", discount: 0, rating: 4.8, inStock: true, colors: ["Maroon", "Gold"], sizes: ["Standard"] },
    { id: "2", title: "Zari Weave Lehenga", price: 24999, category: "Lehengas", image: "https://www.sourcesplash.com/i/random?q=lehenga,indian-wedding,bridal&w=1200&h=1600", discount: 10, rating: 4.9, inStock: true, colors: ["Maroon", "Gold"], sizes: ["S", "M", "L"] },
    { id: "3", title: "Pastel Kurta Set", price: 4999, category: "Kurta Sets", image: "https://www.sourcesplash.com/i/random?q=kurti,set,indian-fashion&w=1200&h=1600", discount: 0, rating: 4.5, inStock: true, colors: ["Ivory", "Emerald"], sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "4", title: "Floral Summer Dress", price: 2999, category: "Dresses", image: "https://www.sourcesplash.com/i/random?q=women-dress,floral,fashion&w=1200&h=1600", discount: 0, rating: 4.2, inStock: true, colors: ["Ivory", "RoyalBlue"], sizes: ["S", "M", "L"] },
    { id: "5", title: "Chic Co-ord Set", price: 3999, category: "Co-ords", image: "https://www.sourcesplash.com/i/random?q=co-ord,set,women-fashion&w=1200&h=1600", discount: 0, rating: 4.7, inStock: true, colors: ["Black", "Ivory"], sizes: ["S", "M", "L"] },
    { id: "6", title: "Evening Glam Gown", price: 8999, category: "Gowns", image: "https://www.sourcesplash.com/i/random?q=evening-gown,party,model&w=1200&h=1600", discount: 15, rating: 4.6, inStock: true, colors: ["Emerald", "Black"], sizes: ["S", "M", "L"] },
    { id: "7", title: "Minimal Cotton Top", price: 1499, category: "Tops", image: "https://www.sourcesplash.com/i/random?q=women-top,minimal,fashion&w=1200&h=1600", discount: 0, rating: 4.3, inStock: false, colors: ["Ivory", "Black"], sizes: ["XS", "S", "M", "L"] },
    { id: "8", title: "Soft Lounge Set", price: 1999, category: "Loungewear", image: "https://www.sourcesplash.com/i/random?q=loungewear,women,homewear&w=1200&h=1600", discount: 0, rating: 4.9, inStock: true, colors: ["RoyalBlue", "Ivory"], sizes: ["S", "M", "L", "XL"] },
]

export default function ProductsPage() {
    const [sort, setSort] = useState("featured")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter State
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState([0, 10000])

    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        // Category Filter
        if (selectedCategories.length > 0 && !selectedCategories.includes("all") && !selectedCategories.includes(product.category.toLowerCase())) {
            return false
        }

        // Price Filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
            return false
        }

        // Size Filter
        if (selectedSizes.length > 0) {
            const hasSize = product.sizes?.some(size => selectedSizes.includes(size))
            if (!hasSize) return false
        }

        // Color Filter
        if (selectedColors.length > 0) {
            const hasColor = product.colors?.some(color => selectedColors.includes(color))
            if (!hasColor) return false
        }

        return true
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price
        if (sort === "price-desc") return b.price - a.price
        if (sort === "newest") return parseInt(b.id) - parseInt(a.id)
        return 0 // featured/default
    })

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
                <div className="flex flex-col gap-8 border-b border-primary/10 pb-16 pt-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[10px] tracking-[0.2em] text-text-secondary hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-accent/40" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-4">
                            <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold font-sans">Explore Dimensions</span>
                            <h1 className="text-5xl md:text-7xl font-heading font-normal leading-[0.95] tracking-tight text-primary">
                                The <span className="italic">Collection</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <FiltersSidebar isMobile {...filterProps} />
                            <SortDropdown currentSort={sort} onSortChange={setSort} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar (Desktop) */}
                    <aside className="hidden border-r border-primary/10 pt-8 pr-10 lg:block w-72 flex-shrink-0">
                        <FiltersSidebar {...filterProps} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 pt-8">
                        <div className="mb-8 text-[11px] text-text-secondary uppercase tracking-[0.2em] font-sans font-bold opacity-60">
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
                                <p className="text-xl font-heading italic tracking-wide">No exquisite pieces match your current selection.</p>
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
