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
    title: "Royal Maroon Kanjivaram",
    price: 24999,
    category: "Kanjivaram",
    description: "A masterpiece of traditional craftsmanship. This handwoven Kanjivaram silk saree features intricate gold zari work and a rich maroon body. Perfect for weddings and auspicious occasions. Breathable, durable, and exuding timeless grace.",
    images: [
        "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/8437013/pexels-photo-8437013.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/9323985/pexels-photo-9323985.jpeg?auto=compress&cs=tinysrgb&w=1200"
    ],
    image: "https://images.pexels.com/photos/14545235/pexels-photo-14545235.jpeg?auto=compress&cs=tinysrgb&w=1200",
    rating: 4.8,
    inStock: true,
    discount: 5,
    colors: ["Maroon", "Gold", "Ivory"],
    sizes: ["Standard"]
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
        <div className="min-h-screen bg-background pt-32 pb-24 relative">
            <div className="max-w-[1280px] mx-auto px-4">
                <div className="mb-12">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/" className="uppercase text-[10px] tracking-[0.2em] text-primary/40 hover:text-primary transition-colors font-sans font-bold">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-secondary-foreground/20" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/products" className="uppercase text-[10px] tracking-[0.2em] text-primary/40 hover:text-primary transition-colors font-sans font-bold">Products</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-secondary-foreground/20" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="uppercase text-[10px] tracking-[0.2em] font-sans font-bold text-primary">{MOCK_PRODUCT.title}</BreadcrumbPage>
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

                        <div className="mt-16 pt-16 border-t border-primary/5">
                            <h3 className="font-heading font-normal text-2xl tracking-tight mb-8 text-primary">Specifications</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 py-4 border-b border-primary/5">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 font-sans">Material</span>
                                    <span className="text-xs font-bold text-primary font-sans uppercase tracking-widest">100% Pure Handwoven Silk</span>
                                </div>
                                <div className="grid grid-cols-2 py-4 border-b border-primary/5">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 font-sans">Craft</span>
                                    <span className="text-xs font-bold text-primary font-sans uppercase tracking-widest">Kanjivaram Zari Work</span>
                                </div>
                                <div className="grid grid-cols-2 py-4 border-b border-primary/5">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 font-sans">Care</span>
                                    <span className="text-xs font-bold text-primary font-sans uppercase tracking-widest">Dry clean only</span>
                                </div>
                                <div className="grid grid-cols-2 py-4 border-b border-primary/5">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/40 font-sans">Origin</span>
                                    <span className="text-xs font-bold text-primary font-sans uppercase tracking-widest">Made in India</span>
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
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-primary/5 p-6 lg:hidden z-50">
                <Button
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-full uppercase tracking-[0.2em] font-bold text-[10px] shadow-xl transition-all duration-500"
                    onClick={addToCart}
                >
                    <ShoppingBag className="w-4 h-4 mr-3" />
                    Add to Bag - ₹{(MOCK_PRODUCT.price * quantity).toLocaleString()}
                </Button>
            </div>
        </div>
    )
}
