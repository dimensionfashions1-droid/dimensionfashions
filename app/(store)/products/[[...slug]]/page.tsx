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

import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation"
import useSWR from "swr"
import { useDebounce } from "use-debounce"
import { ProductRow, Product } from "@/types"
import { createClient } from "@/lib/supabase/client"

// Frontend-friendly Product interface extending the DB row
interface FilteredProduct {
    id: string
    title: string
    price: number
    originalPrice?: number
    category?: string
    image?: string
    colors?: string[]
    sizes?: string[]
    hasVariants?: boolean
    inStock?: boolean
    slug: string
    rating?: number
    reviews_count?: number
    description?: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const params = useParams()

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkUser = async () => {
            try {
                const supabase = createClient()
                const { data } = await supabase.auth.getUser()
                setIsAuthenticated(!!data?.user)
            } catch (err) {
                console.error("Auth check failed:", err)
            }
        }
        checkUser()
    }, [])

    // Extract category and subcategory from slug: /products/[[...slug]]
    const slug = params.slug as string[] | undefined
    const categoryFromUrl = slug?.[0] || null
    const subcategoryFromUrl = slug?.[1] || null

    const [sort, setSort] = useState(searchParams.get("sort") || "newest")
    
    // Sync sort with URL
    useEffect(() => {
        const urlSort = searchParams.get("sort")
        if (urlSort && urlSort !== sort) {
            setSort(urlSort)
        }
    }, [searchParams])

    const [currentPage, setCurrentPage] = useState(1)

    // Sync currentPage with URL searchParams
    useEffect(() => {
        const page = Number(searchParams.get("page")) || 1
        setCurrentPage(page)
    }, [searchParams])

    // Filter State
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categoryFromUrl ? [categoryFromUrl] : []
    )
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
        subcategoryFromUrl ? [subcategoryFromUrl] : []
    )

    // Sync state if URL changes (e.g. back button or direct link)
    useEffect(() => {
        if (categoryFromUrl) {
            setSelectedCategories([categoryFromUrl])
        } else {
            setSelectedCategories([])
        }

        if (subcategoryFromUrl) {
            setSelectedSubcategories([subcategoryFromUrl])
        } else {
            setSelectedSubcategories([])
        }
        // Reset to page 1 when category changes via URL
        setCurrentPage(1)
    }, [categoryFromUrl, subcategoryFromUrl])

    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({})
    const [priceRange, setPriceRange] = useState([0, 100000])

    const [debouncedPriceRange] = useDebounce(priceRange, 500)
    const searchString = searchParams.get("search")

    // Reset to page 1 when filters or sort change
    useEffect(() => {
        // Only reset if we are not already on page 1
        // and this wasn't triggered by a searchParams change that ALREADY has a page
        const urlPage = Number(searchParams.get("page")) || 1
        if (urlPage === 1 && currentPage !== 1) {
            // This means we probably just cleared filters or changed something that led us back to page 1
            setCurrentPage(1)
        }
    }, [debouncedPriceRange, sort, selectedAttributes, searchString])


    // Build URL for SWR
    const queryString = new URLSearchParams()
    queryString.append("page", currentPage.toString())
    queryString.append("limit", "12")
    queryString.append("sort", sort)
    if (searchString) queryString.append("search", searchString)
    if (selectedCategories.length > 0 && !selectedCategories.includes("all")) {
        queryString.append("category", selectedCategories[0])
    }
    if (selectedSubcategories.length > 0) {
        queryString.append("subcategory", selectedSubcategories[0])
    }

    // Add dynamic attributes to query string
    Object.entries(selectedAttributes).forEach(([slug, values]) => {
        if (values.length > 0) {
            queryString.append(slug, values.join(","))
        }
    })

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
        image: p.image || '', // API now returns 'image' directly
        colors: p.colors || [],
        rating: p.rating || 0,
        reviews: p.reviews_count || 0,
        inStock: p.inStock ?? true,
        description: p.description || '',
        sizes: p.sizes || [],
        slug: p.slug,
        originalPrice: p.originalPrice,
        hasVariants: p.hasVariants
    }))

    const totalPages = meta?.totalPages || 1

    const filterProps = {
        selectedCategories,
        setSelectedCategories: (categories: string[]) => {
            // When category changes in sidebar, navigate to new dynamic path
            const newCat = categories[0]
            if (newCat && newCat !== "all") {
                router.push(`/products/${newCat}`)
            } else {
                router.push(`/products`)
            }
        },
        selectedAttributes,
        setSelectedAttributes,
        priceRange,
        setPriceRange,
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
                                <BreadcrumbLink href="/products" className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">Products</BreadcrumbLink>
                            </BreadcrumbItem>
                            {categoryFromUrl && (
                                <>
                                    <BreadcrumbSeparator className="text-accent/40" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/products/${categoryFromUrl}`} className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">{categoryFromUrl}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            {subcategoryFromUrl && (
                                <>
                                    <BreadcrumbSeparator className="text-accent/40" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-bold text-primary font-sans">{subcategoryFromUrl}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                        <div className="space-y-2">
                            <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold font-sans">Explore our collections</span>
                            <h1 className="font-heading text-4xl md:text-5xl text-primary capitalize tracking-tight">
                                {subcategoryFromUrl || categoryFromUrl || "All Collections"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="lg:hidden">
                                <FiltersSidebar isMobile {...filterProps} />
                            </div>
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
                                    Showing {products.length} of {meta?.total || 0} exquisite pieces
                                </div>

                                {products.length > 0 ? (
                                    <>
                                        <ProductGrid products={products} isAuthenticated={isAuthenticated} />

                                        {totalPages > 1 && (
                                            <ProductPagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={(page) => {
                                                    const params = new URLSearchParams(searchParams.toString())
                                                    params.set("page", page.toString())
                                                    router.push(`${pathname}?${params.toString()}`, { scroll: false })
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
                                                setSelectedAttributes({})
                                                setPriceRange([0, 100000])
                                            }}
                                            className="inline-flex items-center justify-center bg-primary text-primary text-[10px] font-sans font-bold uppercase tracking-[0.25em] px-10 py-4 flex-shrink-0 h-12 rounded-full transition-all duration-500 hover:bg-black"
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
