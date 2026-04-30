"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
    images: string[]
    title: string
}

export function ProductImageGallery({ images = [], title }: ProductImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || '')
    const [isZoomed, setIsZoomed] = useState(false)

    // Sync main image when variant changes images
    useEffect(() => {
        if (images.length > 0) {
            setMainImage(images[0])
        }
    }, [images])

    if (!images.length) {
        return (
            <div className="aspect-[3/4] w-full rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <span className="text-primary/20 text-xs font-sans uppercase tracking-widest font-bold">Image coming soon</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnails - Left side on desktop */}
            <div className="order-2 md:order-1 flex md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setMainImage(image)}
                        className={cn(
                            "relative aspect-[3/4] w-16 md:w-20 lg:w-24 overflow-hidden rounded-xl bg-gray-50 transition-all duration-300 border shrink-0",
                            mainImage === image 
                                ? "border-primary shadow-sm" 
                                : "border-transparent opacity-60 hover:opacity-100"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${title} view ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 64px, 96px"
                            unoptimized
                        />
                    </button>
                ))}
            </div>

            {/* Main Image - Right side on desktop */}
            <div className="order-1 md:order-2 flex-1">
                <div
                    className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-50 cursor-crosshair border border-gray-50"
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={(e) => {
                        if (!isZoomed) return;
                        const el = e.currentTarget;
                        const { left, top, width, height } = el.getBoundingClientRect();
                        const x = ((e.clientX - left) / width) * 100;
                        const y = ((e.clientY - top) / height) * 100;
                        el.style.setProperty('--zoom-x', `${x}%`);
                        el.style.setProperty('--zoom-y', `${y}%`);
                    }}
                    style={{
                        // @ts-ignore
                        '--zoom-x': '50%',
                        '--zoom-y': '50%'
                    }}
                >
                    <Image
                        src={mainImage}
                        alt={title}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 ease-out",
                            isZoomed ? "scale-150 origin-[var(--zoom-x)_var(--zoom-y)]" : "scale-100"
                        )}
                        sizes="(max-width: 768px) 100vw, 800px"
                        priority
                        unoptimized
                    />
                </div>
            </div>
        </div>
    )
}
