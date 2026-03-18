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
    { id: "1", title: "Royal Maroon Kanjivaram", price: 24999, category: "Kanjivaram", image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 0, rating: 4.5, inStock: true, colors: ["Maroon", "Gold"], sizes: ["Standard"] },
    { id: "2", title: "Antique Gold Banarasi", price: 28999, category: "Banarasi", image: "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 10, rating: 4.8, inStock: true, colors: ["Red", "Gold"], sizes: ["Standard"] },
    { id: "3", title: "Mint Whisper Soft Silk", price: 8599, category: "Soft Silk", image: "https://images.pexels.com/photos/8437013/pexels-photo-8437013.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 0, rating: 4.2, inStock: true, colors: ["Mint", "Silver"], sizes: ["Standard"] },
    { id: "4", title: "Linen Handblock Heritage", price: 5999, category: "Linen", image: "https://images.pexels.com/photos/9323985/pexels-photo-9323985.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 0, rating: 4.0, inStock: true, colors: ["Beige", "Black"], sizes: ["Standard"] },
    { id: "5", title: "Imperial Mysore Silk", price: 14499, category: "Silk", image: "https://images.pexels.com/photos/10189110/pexels-photo-10189110.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 0, rating: 4.7, inStock: true, colors: ["Purple", "Green"], sizes: ["Standard"] },
    { id: "6", title: "Chanderi Bloom Delight", price: 7499, category: "Chanderi", image: "https://images.pexels.com/photos/10189025/pexels-photo-10189025.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 15, rating: 4.6, inStock: true, colors: ["Peach", "Cream"], sizes: ["Standard"] },
    { id: "7", title: "Earthy Tussar Handloom", price: 11999, category: "Silk", image: "https://images.pexels.com/photos/10189112/pexels-photo-10189112.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 0, rating: 4.3, inStock: false, colors: ["Brown", "Beige"], sizes: ["Standard"] },
    { id: "8", title: "Wedding Vow Pattu", price: 48999, category: "Bridal", image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200", discount: 0, rating: 4.9, inStock: true, colors: ["Gold", "Red"], sizes: ["Standard"] },
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
        <div className="min-h-screen bg-background pt-32 pb-16">
            <div className="max-w-[1280px] mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col gap-8 border-b border-primary/10 pb-8">
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
                            <span className="text-accent uppercase tracking-[0.3em] text-xs font-bold font-sans">Handloom Heritage</span>
                            <h1 className="text-5xl md:text-7xl font-heading font-normal leading-[0.95] tracking-tight text-primary">
                                All <span className="italic">Collections</span>
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
                            Showing {paginatedProducts.length} of {sortedProducts.length} luxury drapes
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
                                <p className="text-xl font-heading italic tracking-wide">No exquisite drapes match your current selection.</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedCategories([])
                                        setSelectedSizes([])
                                        setSelectedColors([])
                                        setPriceRange([0, 100000])
                                    }}
                                    className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest text-xs px-10 py-6"
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
