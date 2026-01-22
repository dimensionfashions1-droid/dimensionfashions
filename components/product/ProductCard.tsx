import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"

interface ProductCardProps {
    id: string
    title: string
    price: number
    image: string
    category: string
}

export function ProductCard({ id, title, price, image, category }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col gap-3">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay Action */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full p-4 hover:bg-white hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{category}</span>
                <div className="flex justify-between items-start">
                    <Link href={`/product/${id}`} className="group-hover:underline decoration-1 underline-offset-4">
                        <h3 className="font-heading font-semibold text-sm md:text-base leading-tight uppercase tracking-wide">{title}</h3>
                    </Link>
                    <span className="font-mono text-sm">₹{price.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    )
}
