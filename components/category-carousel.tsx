"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface CategoryCarouselProps {
  categories: Category[]
}

export function CategoryCarousel({ categories }: CategoryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative py-8">
      {/* Navigation Buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[rgb(218_184_105)] text-black hover:bg-[rgb(208_174_95)] transition-all shadow-lg -translate-x-6"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-[rgb(218_184_105)] text-black hover:bg-[rgb(208_174_95)] transition-all shadow-lg translate-x-6"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel */}
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide px-16">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`#category-${category.slug}`}
            className="flex-shrink-0 w-72 group cursor-pointer"
            style={{
              animation: `fade-in-up 0.6s ease-out ${index * 0.1}s backwards`,
            }}
          >
            <div className="relative h-64 rounded-xl overflow-hidden border border-[rgb(218_184_105)]/20 hover:border-[rgb(218_184_105)]/50 transition-all duration-300">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                <h3 className="text-2xl font-serif font-bold text-center">{category.name}</h3>
                <p className="text-sm text-center opacity-90 px-4 font-sans">{category.description}</p>
                <Button
                  size="sm"
                  className="mt-2 bg-[rgb(218_184_105)] hover:bg-[rgb(208_174_95)] text-black font-semibold font-sans"
                >
                  Shop Now
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
