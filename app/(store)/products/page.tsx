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

// Mock Data
const MOCK_PRODUCTS = [
    { id: "1", title: "Oversized Structured Tee", price: 2499, category: "Tops", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop", discount: 0, rating: 4.5, inStock: true },
    { id: "2", title: "Wide Leg Pleated Trousers", price: 3999, category: "Bottoms", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop", discount: 10, rating: 4.8, inStock: true },
    { id: "3", title: "Utility Vest Black", price: 4599, category: "Outerwear", image: "https://images.unsplash.com/photo-1559582930-bb01987cf4dd?q=80&w=1762&auto=format&fit=crop", discount: 0, rating: 4.2, inStock: true },
    { id: "4", title: "Boxy Fit Shirt", price: 2999, category: "Tops", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1888&auto=format&fit=crop", discount: 0, rating: 4.0, inStock: true },
    { id: "5", title: "Tech Cargo Pants", price: 5499, category: "Bottoms", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop", discount: 0, rating: 4.7, inStock: true },
    { id: "6", title: "Minimalist Hoodie", price: 3499, category: "Tops", image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=987&auto=format&fit=crop", discount: 15, rating: 4.6, inStock: true },
    { id: "7", title: "Heavyweight Cotton Tee", price: 1999, category: "Tops", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=987&auto=format&fit=crop", discount: 0, rating: 4.3, inStock: false },
    { id: "8", title: "Puffer Jacket", price: 8999, category: "Outerwear", image: "https://images.unsplash.com/photo-1544022613-e87caebd27ae?q=80&w=2000&auto=format&fit=crop", discount: 0, rating: 4.9, inStock: true },
]

export default function ProductsPage() {
    const [sort, setSort] = useState("featured")
    const [currentPage, setCurrentPage] = useState(1)

    // In a real app, filtering/sorting would happen either on the server or with a more robust client-side hook
    const sortedProducts = [...MOCK_PRODUCTS].sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price
        if (sort === "price-desc") return b.price - a.price
        if (sort === "newest") return parseInt(b.id) - parseInt(a.id)
        return 0 // featured/default
    })

    return (
        <div className="min-h-screen bg-background pt-24 pb-20">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col gap-8  border-b pb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-xs tracking-widest text-neutral-400 hover:text-white transition-colors">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-neutral-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-xs tracking-widest font-bold text-white">Products</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl  md:text-7xl font-heading font-black uppercase tracking-tighter leading-[0.9]">
                                All {"  "}
                                <span className="text-transparent stroke-text-sm md:stroke-text">Collection</span>
                            </h1>

                        </div>
                        <div className="flex items-center gap-4">
                            <FiltersSidebar isMobile />
                            <SortDropdown currentSort={sort} onSortChange={setSort} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar (Desktop) */}
                    <aside className="hidden border-r pt-10 pr-4 lg:block w-64 flex-shrink-0">
                        <FiltersSidebar />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 pt-10">
                        <div className="mb-6 text-sm text-neutral-500">
                            Showing {sortedProducts.length} of {MOCK_PRODUCTS.length} products
                        </div>

                        <ProductGrid products={sortedProducts} />

                        <ProductPagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(MOCK_PRODUCTS.length / 8)} // Mock total pages
                            onPageChange={setCurrentPage}
                        />
                    </main>
                </div>
            </div>
        </div>
    )
}
