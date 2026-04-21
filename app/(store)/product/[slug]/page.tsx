"use client"

import { useState, use, useEffect } from "react"
import useSWR from "swr"
import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { ReviewSection } from "@/components/product/ReviewSection"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import { Product } from "@/types"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)

    // Fetch product data
    const { data: response, isLoading, error } = useSWR(`/api/products/${slug}`, fetcher)

    // State
    const [quantity, setQuantity] = useState(1)
    const [selectedColor, setSelectedColor] = useState<string | undefined>()
    const [selectedSize, setSelectedSize] = useState<string | undefined>()

    // Initialize selections
    useEffect(() => {
        if (response?.data) {
            const p = response.data
            const firstColor = p.attributes?.color?.values[0]?.value
            const firstSize = p.attributes?.size?.values[0]?.value
            if (firstColor && !selectedColor) setSelectedColor(firstColor)
            if (firstSize && !selectedSize) setSelectedSize(firstSize)
        }
    }, [response, selectedColor, selectedSize])

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/40 font-sans">Curating Experience...</p>
            </div>
        )
    }

    if (error || !response?.data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white px-4 text-center">
                <h2 className="font-heading text-3xl">This piece seems to have drifted away.</h2>
                <p className="text-primary/60 max-w-md">We couldn't find the product you're looking for. It may have been relocated or removed from our collection.</p>
                <BreadcrumbLink href="/products">
                    <Button className="rounded-full px-8 py-6 bg-primary text-secondary uppercase tracking-widest text-xs font-bold">Return to Collection</Button>
                </BreadcrumbLink>
            </div>
        )
    }

    const dbProduct = response.data

    // ── Variant Selection Logic ──────────────────────────────────────
    // 1. Find the active variant based on selectedColor and selectedSize
    const activeVariant = dbProduct.variants?.find((v: any) => {
        const colorMatch = !selectedColor || v.options.color === selectedColor
        const sizeMatch = !selectedSize || v.options.size === selectedSize
        return colorMatch && sizeMatch
    })

    // 2. Map values, prioritizing variant overrides
    const displayPrice = activeVariant?.price || dbProduct.price
    const displayOriginalPrice = activeVariant?.original_price || dbProduct.original_price
    const displayStockCount = activeVariant ? activeVariant.stock_count : dbProduct.stock_count
    const displayInStock = displayStockCount > 0

    // Map DB structure to Frontend Product interface
    const product: Product = {
        id: dbProduct.id,
        title: dbProduct.title,
        price: displayPrice,
        originalPrice: displayOriginalPrice,
        discount: dbProduct.discount,
        category: dbProduct.categories?.name || 'Collection',
        description: dbProduct.description,
        images: activeVariant?.images?.length ? activeVariant.images : (dbProduct.images || []),
        image: activeVariant?.images?.[0] || dbProduct.images?.[0] || '',
        rating: dbProduct.computed_rating || 0,
        inStock: displayInStock,
        colors: dbProduct.attributes?.color?.values.map((v: any) => v.value) || [],
        sizes: dbProduct.attributes?.size?.values.map((v: any) => v.value) || [],
        slug: dbProduct.slug
    }

    const addToCart = () => {
        console.log(`Added to cart:`, {
            productId: product.id,
            variantId: activeVariant?.id,
            quantity,
            color: selectedColor,
            size: selectedSize
        })
        // TODO: Implement actual cart logic with global state or API
    }

    return (
        <div className="min-h-screen bg-white pt-12 pb-24 relative">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="mb-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[10px] tracking-[0.2em] text-primary/40 hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-primary/10" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/products" className="uppercase text-[10px] tracking-[0.2em] text-primary/40 hover:text-primary transition-colors font-sans font-bold">Products</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-primary/10" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-sans font-bold text-primary">{product.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
                    {/* Left Column: Gallery */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <ProductImageGallery images={product.images || []} title={product.title} />
                    </div>

                    {/* Right Column: Info */}
                    <div>
                        <ProductInfo
                            product={product}
                            onAddToCart={addToCart}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            selectedColor={selectedColor || product.colors?.[0]}
                            setSelectedColor={setSelectedColor}
                            selectedSize={selectedSize || product.sizes?.[0]}
                            setSelectedSize={setSelectedSize}
                        />

                        {/* Technical Details from Attributes */}
                        <div className="mt-16 pt-16 border-t border-primary/5">
                            <h3 className="font-heading font-normal text-2xl tracking-tight mb-8 text-primary uppercase tracking-[0.1em]">Details & <span className="px-1">Care</span></h3>
                            <div className="space-y-4">
                                {Object.entries(dbProduct.attributes || {}).map(([key, attr]: [string, any]) => {
                                    if (['color', 'size'].includes(key.toLowerCase())) return null;
                                    return (
                                        <div key={key} className="grid grid-cols-2 py-5 border-b border-primary/5 items-center">
                                            <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-primary/40 font-sans">{attr.name}</span>
                                            <span className="text-[10px] font-bold text-primary font-sans uppercase tracking-[0.15em]">
                                                {attr.values.map((v: any) => typeof v === 'string' ? v : v.value).join(', ')}
                                            </span>
                                        </div>
                                    )
                                })}
                                {!dbProduct.attributes && (
                                    <p className="text-[10px] text-primary/40 uppercase tracking-widest italic">No technical specifications provided for this piece.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <ReviewSection />

                {/* Related Products */}
                <RelatedProducts currentProductId={product.id} categorySlug={dbProduct.categories?.slug} />
            </div>

            {/* Sticky Mobile Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-primary/5 p-6 lg:hidden z-50">
                <Button
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-full uppercase tracking-[0.2em] font-bold text-[10px] shadow-xl transition-all duration-500"
                    onClick={addToCart}
                    disabled={!product.inStock}
                >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    {product.inStock ? `Add to Bag - ₹${(product.price * quantity).toLocaleString()}` : 'Out of Stock'}
                </Button>
            </div>
        </div>
    )
}
