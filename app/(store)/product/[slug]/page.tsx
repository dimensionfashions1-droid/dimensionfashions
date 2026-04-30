"use client"

import { useState, use, useEffect, useMemo } from "react"
import useSWR from "swr"
import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { ReviewSection } from "@/components/product/ReviewSection"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { Product } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const { toast } = useToast()
    const cart = useCart()
    
    // Auth state
    const [user, setUser] = useState<any>(null)
    const isAuthenticated = !!user

    // Fetch product data
    const { data: response, error, isLoading } = useSWR(`/api/products/${slug}`, fetcher)
    const dbProduct = response?.data

    // States for selection
    const [quantity, setQuantity] = useState(1)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) setUser(data.user)
        })
    }, [])

    // Transform DB product to UI Product type, including variant overrides
    const product = useMemo<Product | null>(() => {
        if (!dbProduct) return null
        
        // 1. Find the active variant based on current selections
        const activeVariant = dbProduct.variants?.find((v: any) => {
            const hasColorAttr = !!dbProduct.attributes?.color
            const hasSizeAttr = !!dbProduct.attributes?.size
            
            const colorMatch = !hasColorAttr || v.options.color?.value === selectedColor
            const sizeMatch = !hasSizeAttr || v.options.size?.value === selectedSize
            
            return colorMatch && sizeMatch
        })

        // 2. Map values, prioritizing variant overrides
        const price = activeVariant?.price !== undefined && activeVariant?.price !== null 
            ? Number(activeVariant.price) 
            : Number(dbProduct.price)
        
        const originalPrice = activeVariant?.original_price !== undefined && activeVariant?.original_price !== null
            ? Number(activeVariant.original_price)
            : (dbProduct.original_price ? Number(dbProduct.original_price) : null)
        
        const images = activeVariant?.images?.length ? activeVariant.images : (dbProduct.images || [])
        const stockCount = activeVariant?.stock_count !== undefined ? activeVariant.stock_count : (dbProduct.stock_count || 0)

        return {
            id: dbProduct.id,
            title: dbProduct.title,
            price: price,
            originalPrice: originalPrice || undefined,
            category: dbProduct.categories?.name || "Collection",
            image: images[0] || "",
            images: images,
            description: dbProduct.description,
            inStock: stockCount > 0,
            rating: dbProduct.computed_rating,
            reviews: dbProduct.reviews_count,
            slug: dbProduct.slug,
            colors: dbProduct.attributes?.color?.values?.map((v: any) => typeof v === 'string' ? v : v.value) || [],
            sizes: dbProduct.attributes?.size?.values?.map((v: any) => typeof v === 'string' ? v : v.value) || [],
        }
    }, [dbProduct, selectedColor, selectedSize])

    // Initialize selections
    useEffect(() => {
        if (product && !selectedColor && product.colors?.length) {
            setSelectedColor(product.colors[0])
        }
        if (product && !selectedSize && product.sizes?.length) {
            setSelectedSize(product.sizes[0])
        }
    }, [product, selectedColor, selectedSize])

    const addToCart = async (attributes: Record<string, string>) => {
        if (!product) return
        
        await cart.addToCart(product, attributes, quantity, isAuthenticated)
        toast({
            title: "Added to Bag",
            description: `${product.title} has been added to your collection.`,
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/20">Curating Details</span>
                </div>
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-heading">Product Not Found</h2>
                    <p className="text-sm text-primary/60 font-sans">The product you are looking for might have been moved or doesn't exist.</p>
                    <Button variant="outline" onClick={() => window.location.href = '/products'} className="rounded-full uppercase tracking-widest text-[10px] font-bold px-8 h-12">
                        Back to Collections
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pt-8 pb-10 relative">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="mb-10">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[9px] tracking-[0.3em] text-primary/30 hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-primary/5" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/products" className="uppercase text-[9px] tracking-[0.3em] text-primary/30 hover:text-primary transition-colors font-sans font-bold">Collections</BreadcrumbLink>
                            </BreadcrumbItem>
                            {dbProduct.categories && (
                                <>
                                    <BreadcrumbSeparator className="text-primary/5" />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={`/products/${dbProduct.categories.slug}`} className="uppercase text-[9px] tracking-[0.3em] text-primary/30 hover:text-primary transition-colors font-sans font-bold">{dbProduct.categories.name}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            )}
                            <BreadcrumbSeparator className="text-primary/5" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[9px] tracking-[0.3em] font-sans font-bold text-primary/60">{product.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-12">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-7 lg:sticky lg:top-24 h-fit">
                        <ProductImageGallery images={product.images || []} title={product.title} />
                    </div>

                    {/* Right Column: Info */}
                    <div className="lg:col-span-5">
                        <ProductInfo
                            product={product}
                            onAddToCart={addToCart}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            selectedColor={selectedColor || undefined}
                            setSelectedColor={(c) => setSelectedColor(c)}
                            selectedSize={selectedSize || undefined}
                            setSelectedSize={(s) => setSelectedSize(s)}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProducts currentProductId={product.id} categorySlug={dbProduct.categories?.slug} isAuthenticated={isAuthenticated} />
            </div>

            {/* Sticky Mobile Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-primary/5 p-5 lg:hidden z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex gap-4 items-center">
                    <div className="shrink-0 bg-gray-50 px-4 py-3 rounded-full border border-primary/5">
                        <span className="text-xs font-bold font-sans">₹{product.price.toLocaleString()}</span>
                    </div>
                    <Button
                        className="flex-1 h-14 bg-primary hover:bg-black text-white rounded-full uppercase tracking-[0.2em] font-bold text-[10px] shadow-xl transition-all duration-500"
                        onClick={() => {
                            const attributes: Record<string, string> = {}
                            if (selectedColor) attributes.color = selectedColor
                            if (selectedSize) attributes.size = selectedSize
                            addToCart(attributes)
                        }}
                        disabled={!product.inStock}
                    >
                        {product.inStock ? `Add to Bag` : 'Out of Stock'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
