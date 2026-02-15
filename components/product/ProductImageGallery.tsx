"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
    images: string[]
    title: string
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0])
    const [isZoomed, setIsZoomed] = useState(false)

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div
                className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-neutral-100 cursor-zoom-in"
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
                        "object-cover transition-transform duration-200 ease-out",
                        isZoomed ? "scale-150 origin-[var(--zoom-x)_var(--zoom-y)]" : "scale-100"
                    )}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setMainImage(image)}
                        className={cn(
                            "relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100 transition-all duration-200",
                            mainImage === image ? "ring-2 ring-black ring-offset-2" : "hover:opacity-80 opacity-60"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${title} view ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 25vw, 10vw"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
