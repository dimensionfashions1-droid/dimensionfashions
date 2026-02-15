"use client"

import { useState } from "react"

import { ProductImageGallery } from "@/components/product/ProductImageGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { ReviewSection } from "@/components/product/ReviewSection"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { useParams } from "next/navigation"

// Mock Data (In a real app, this would be fetched based on params.id)
const MOCK_PRODUCT = {
    id: "1",
    title: "Oversized Structured Tee",
    price: 2499,
    category: "Tops",
    description: "Engineered for the modern urban landscape. This piece combines functional utility with avant-garde aesthetics. Crafted from premium heavyweight cotton for durability and comfort. Features reinforced stitching and a relaxed fit.",
    images: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=987&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?q=80&w=1920&auto=format&fit=crop"
    ],
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
    rating: 4.5,
    inStock: true,
    discount: 0,
    colors: ["Black", "White", "Beige"],
    sizes: ["S", "M", "L", "XL"]
}

export default function ProductPage() {
    const params = useParams<{ id: string }>()
    const id = params.id

    // State
    const [quantity, setQuantity] = useState(1)
    const [selectedColor, setSelectedColor] = useState<string | undefined>(MOCK_PRODUCT.colors?.[0])
    const [selectedSize, setSelectedSize] = useState<string | undefined>(MOCK_PRODUCT.sizes?.[0])

    const addToCart = () => {
        console.log(`Added to cart:`, {
            productId: id,
            quantity,
            color: selectedColor,
            size: selectedSize
        })
        // Implement actual cart logic here
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-24 relative">
            <div className="container mx-auto px-4 md:px-8">
                {/* Breadcrumb */}
                <div className="mb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-xs tracking-widest text-neutral-400 hover:text-white transition-colors">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-neutral-600" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/products" className="uppercase text-xs tracking-widest text-neutral-400 hover:text-white transition-colors">Products</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-neutral-600" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-xs tracking-widest font-bold text-white">{MOCK_PRODUCT.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
                    {/* Left Column: Gallery */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <ProductImageGallery images={MOCK_PRODUCT.images} title={MOCK_PRODUCT.title} />
                    </div>

                    {/* Right Column: Info */}
                    <div>
                        <ProductInfo
                            product={MOCK_PRODUCT}
                            onAddToCart={addToCart}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                        />

                        <div className="mt-12 pt-12 border-t border-neutral-800">
                            <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-6 text-white">Specifications</h3>
                            <div className="space-y-4 text-sm text-neutral-400">
                                <div className="grid grid-cols-2 py-2 border-b border-neutral-800">
                                    <span className="font-medium text-white">Material</span>
                                    <span>100% Heavyweight Cotton</span>
                                </div>
                                <div className="grid grid-cols-2 py-2 border-b border-neutral-800">
                                    <span className="font-medium text-white">Fit</span>
                                    <span>Oversized / Relaxed</span>
                                </div>
                                <div className="grid grid-cols-2 py-2 border-b border-neutral-800">
                                    <span className="font-medium text-white">Care</span>
                                    <span>Machine wash cold, tumble dry low</span>
                                </div>
                                <div className="grid grid-cols-2 py-2 border-b border-neutral-800">
                                    <span className="font-medium text-white">Origin</span>
                                    <span>Made in India</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews */}
                <ReviewSection />

                {/* Related Products */}
                <RelatedProducts currentProductId={id} />
            </div>

            {/* Sticky Mobile Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 lg:hidden z-50">
                <Button
                    className="w-full h-12 bg-white hover:bg-neutral-200 text-black rounded-full uppercase tracking-widest font-bold text-sm shadow-lg"
                    onClick={addToCart}
                >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add to Cart - ₹{(MOCK_PRODUCT.price * quantity).toLocaleString()}
                </Button>
            </div>
        </div>
    )
}
