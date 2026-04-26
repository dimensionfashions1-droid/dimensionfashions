"use client"

import * as React from "react"
import { Search, Loader2, Package, Layers } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useDebounce } from "use-debounce"
import { cn } from "@/lib/utils"

interface SearchResult {
    id: string
    name: string
    slug: string
    image: string | null
    type: 'product' | 'category'
    price?: number
}

export function SearchInput() {
    const [query, setQuery] = React.useState("")
    const [debouncedQuery] = useDebounce(query, 500)
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const [page, setPage] = React.useState(1)
    const [hasMore, setHasMore] = React.useState(false)
    const [isFetchingMore, setIsFetchingMore] = React.useState(false)
    
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const observerTarget = React.useRef<HTMLDivElement>(null)

    const fetchResults = async (q: string, p: number, append = false) => {
        if (!q) {
            setResults([])
            setIsOpen(false)
            return
        }

        if (p === 1) setIsLoading(true)
        else setIsFetchingMore(true)

        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${p}&limit=6`)
            const data = await res.json()
            
            if (data.data) {
                setResults(prev => append ? [...prev, ...data.data] : data.data)
                setHasMore(data.meta?.hasMore || false)
                setIsOpen(true)
            }
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setIsLoading(false)
            setIsFetchingMore(false)
        }
    }

    React.useEffect(() => {
        setPage(1)
        fetchResults(debouncedQuery, 1)
    }, [debouncedQuery])

    // Infinite scroll observer
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
                    const nextPage = page + 1
                    setPage(nextPage)
                    fetchResults(debouncedQuery, nextPage, true)
                }
            },
            { threshold: 1.0 }
        )

        if (observerTarget.current) {
            observer.current = observer
            observer.observe(observerTarget.current)
        }

        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current)
        }
    }, [hasMore, isFetchingMore, page, debouncedQuery])

    // Close dropdown on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative w-full max-w-[600px]" ref={dropdownRef}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search for sarees, lehengas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setIsOpen(true)}
                    className="w-full h-10 pl-11 pr-4 rounded-full border-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-accent text-xs font-sans bg-gray-50/50 shadow-none placeholder-primary/50 transition-all focus:bg-white focus:shadow-lg focus:shadow-black/5"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 text-accent animate-spin" />
                    ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Results Dropdown */}
            {isOpen && query.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                        {isLoading && results.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                <Loader2 className="w-6 h-6 text-accent animate-spin" />
                                <p className="text-[10px] tracking-widest uppercase font-sans text-primary/40">Searching...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                {results.map((item, index) => (
                                    <Link
                                        key={`${item.type}-${item.id}-${index}`}
                                        href={item.type === 'category' ? `/products/${item.slug}` : `/product/${item.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                                    >
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                    {item.type === 'category' ? <Layers className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-[11px] font-sans font-bold text-primary truncate uppercase tracking-widest group-hover:text-accent transition-colors">
                                                    {item.name}
                                                </h4>
                                                <span className={cn(
                                                    "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                                                    item.type === 'category' ? "bg-accent/10 text-accent" : "bg-primary/5 text-primary/40"
                                                )}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            {item.type === 'product' && (
                                                <p className="text-[10px] font-sans font-bold text-primary/40 mt-0.5 tracking-wider">
                                                    ₹{item.price?.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                                
                                {/* Sentinel for IntersectionObserver */}
                                {hasMore && (
                                    <div ref={observerTarget} className="h-10 flex items-center justify-center">
                                        {isFetchingMore && (
                                            <Loader2 className="w-4 h-4 text-accent animate-spin" />
                                        )}
                                    </div>
                                )}
                            </>
                        ) : !isLoading && debouncedQuery.length >= 2 ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Search className="w-5 h-5 text-gray-300" />
                                </div>
                                <p className="text-sm font-heading text-primary">No results found for "{debouncedQuery}"</p>
                                <p className="text-[10px] uppercase tracking-widest text-primary/40 mt-2">Try checking for typos or use more general terms</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}
