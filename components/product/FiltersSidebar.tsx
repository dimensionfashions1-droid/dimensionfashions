"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Filter } from "lucide-react"

// Mock Data for Categories
const categories = [
    { id: "all", label: "All Products" },
    { id: "tops", label: "Tops" },
    { id: "bottoms", label: "Bottoms" },
    { id: "outerwear", label: "Outerwear" },
    { id: "accessories", label: "Accessories" },
]

interface FiltersSidebarProps {
    className?: string
    isMobile?: boolean
    selectedCategories: string[]
    setSelectedCategories: (categories: string[]) => void
    selectedSizes: string[]
    setSelectedSizes: (sizes: string[]) => void
    selectedColors: string[]
    setSelectedColors: (colors: string[]) => void
    priceRange: number[]
    setPriceRange: (range: number[]) => void
}

export function FiltersSidebar({
    className,
    isMobile = false,
    selectedCategories,
    setSelectedCategories,
    selectedSizes,
    setSelectedSizes,
    selectedColors,
    setSelectedColors,
    priceRange,
    setPriceRange
}: FiltersSidebarProps) {

    const handleCategoryChange = (categoryId: string) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
        } else {
            setSelectedCategories([...selectedCategories, categoryId])
        }
    }

    const handleSizeChange = (size: string) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size))
        } else {
            setSelectedSizes([...selectedSizes, size])
        }
    }

    const handleColorChange = (color: string) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color))
        } else {
            setSelectedColors([...selectedColors, color])
        }
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedSizes([])
        setSelectedColors([])
        setPriceRange([0, 10000])
    }

    const FilterContent = () => (
        <div className="space-y-12 ">
            {/* Categories */}
            <div className="space-y-6">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-b border-white/20 pb-2 inline-block">Categories</h3>
                <div className="space-y-4 pt-2">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => handleCategoryChange(category.id)}
                                className="rounded-full w-5 h-5 data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white border-neutral-700"
                            />
                            <Label
                                htmlFor={category.id}
                                className="text-base text-neutral-400 group-hover:text-white font-medium leading-none cursor-pointer transition-colors"
                            >
                                {category.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-b border-white/20 pb-2 inline-block">Price</h3>
                    <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
                        ₹{priceRange[0]} - ₹{priceRange[1]}
                    </span>
                </div>
                <Slider
                    defaultValue={[0, 10000]}
                    max={10000}
                    step={100}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                />
            </div>

            {/* Size */}
            <div className="space-y-6">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-b border-white/20 pb-2 inline-block">Size</h3>
                <div className="grid grid-cols-3 gap-2 pt-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                        <div key={size} className="relative group">
                            <Checkbox
                                id={`size-${size}`}
                                className="peer sr-only"
                                checked={selectedSizes.includes(size)}
                                onCheckedChange={() => handleSizeChange(size)}
                            />
                            <Label
                                htmlFor={`size-${size}`}
                                className="flex items-center justify-center w-full h-10 border border-neutral-800 rounded-lg text-neutral-400 font-medium cursor-pointer hover:border-white hover:text-white peer-data-[state=checked]:bg-white peer-data-[state=checked]:text-black peer-data-[state=checked]:border-white transition-all"
                            >
                                {size}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-6">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-b border-white/20 pb-2 inline-block">Color</h3>
                <div className="space-y-3 pt-2">
                    {["Black", "White", "Navy", "Beige", "Olive", "Grey"].map((color) => (
                        <div key={color} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox
                                id={`color-${color}`}
                                checked={selectedColors.includes(color)}
                                onCheckedChange={() => handleColorChange(color)}
                                className="rounded-full w-5 h-5 data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white border-neutral-700"
                            />
                            <Label
                                htmlFor={`color-${color}`}
                                className="flex items-center justify-between w-full text-base text-neutral-400 group-hover:text-white font-medium leading-none cursor-pointer transition-colors"
                            >
                                <span>{color}</span>
                                <div
                                    className="w-3 h-3 rounded-full border border-neutral-800"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div className="space-y-6">
                <h3 className="font-heading font-bold text-sm uppercase tracking-widest text-white border-b border-white/20 pb-2 inline-block">Rating</h3>
                <div className="space-y-4 pt-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3 group cursor-pointer">
                            <Checkbox id={`rating-${rating}`} className="rounded-full w-5 h-5 data-[state=checked]:bg-white data-[state=checked]:text-black data-[state=checked]:border-white border-neutral-700" />
                            <Label
                                htmlFor={`rating-${rating}`}
                                className="text-base font-medium leading-none cursor-pointer flex items-center group-hover:text-white text-neutral-400 transition-colors"
                            >
                                {Array.from({ length: rating }).map((_, i) => (
                                    <span key={i} className="text-white">★</span>
                                ))}
                                {Array.from({ length: 5 - rating }).map((_, i) => (
                                    <span key={i} className="text-neutral-800">★</span>
                                ))}
                                <span className="ml-3 text-neutral-500 text-xs uppercase tracking-widest font-bold translate-y-[1px]">& Up</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <Button
                variant="outline"
                className="w-full rounded-full border-neutral-800 text-neutral-400 hover:bg-white hover:text-black hover:border-white uppercase tracking-widest text-xs font-bold py-7 transition-all duration-300 mt-8"
                onClick={clearAllFilters}
            >
                Clear All Filters
            </Button>
        </div>
    )

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden rounded-full border-neutral-800 text-white hover:bg-white hover:text-black">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] border-neutral-800 bg-[#050505] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="font-heading font-bold uppercase tracking-wide text-white">Filters</SheetTitle>
                        <SheetDescription className="text-neutral-400">
                            Refine your search to find the perfect piece.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6">
                        <FilterContent />
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <div className={className}>
            <FilterContent />
        </div>
    )
}
