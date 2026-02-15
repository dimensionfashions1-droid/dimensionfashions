import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface Product {
    id: string
    title: string
    price: number
    image: string
    category: string
    discount?: number
    rating?: number
    inStock?: boolean
    colors?: string[]
    sizes?: string[]
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const discountedPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : null

    return (
        <div className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:border-neutral-700">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800">
                <Link href={`/product/${product.id}`} className="block h-full w-full">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.discount !== 0 && (
                        <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 px-2 py-1 uppercase text-[10px] tracking-wider font-bold">
                            -{product.discount}%
                        </Badge>
                    )}
                    {!product.inStock && (
                        <Badge className="bg-white text-black border-0 px-2 py-1 uppercase text-[10px] tracking-wider font-bold">
                            Sold Out
                        </Badge>
                    )}
                </div>

                {/* Quick Actions (Hover) */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full bg-black/50 backdrop-blur-md text-white border border-white/10 hover:bg-white hover:text-black hover:border-white transition-colors shadow-lg h-9 w-9"
                    >
                        <Heart className="w-4 h-4" />
                        <span className="sr-only">Add to Wishlist</span>
                    </Button>
                </div>

                {/* Quick Add (Bottom Hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <Button className="w-full rounded-full bg-white text-black hover:bg-neutral-200 font-bold uppercase text-xs tracking-wider shadow-xl py-6 border-0">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Quick Add
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <div className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
                    {product.category}
                </div>
                <h3 className="font-heading font-bold text-lg leading-tight text-white group-hover:text-neutral-300 transition-colors">
                    <Link href={`/product/${product.id}`}>
                        {product.title}
                    </Link>
                </h3>
                <div className="flex items-center gap-2">
                    {discountedPrice ? (
                        <>
                            <span className="font-bold text-white text-lg">₹{discountedPrice.toLocaleString()}</span>
                            <span className="text-sm text-neutral-400 line-through decoration-neutral-400">₹{product.price.toLocaleString()}</span>
                        </>
                    ) : (
                        <span className="font-bold text-white text-lg">₹{product.price.toLocaleString()}</span>
                    )}
                </div>

                {/* Color and Size Swatches */}
                <div className="flex items-center justify-between pt-1">
                    {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-1">
                            {product.colors.slice(0, 4).map((color) => (
                                <div
                                    key={color}
                                    className="w-3 h-3 rounded-full border border-neutral-700"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                            ))}
                            {product.colors.length > 4 && (
                                <span className="text-[10px] text-neutral-500 ml-1">+{product.colors.length - 4}</span>
                            )}
                        </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <div className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                            {product.sizes.length > 3
                                ? `${product.sizes.slice(0, 3).join(", ")} +${product.sizes.length - 3}`
                                : product.sizes.join(", ")
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
