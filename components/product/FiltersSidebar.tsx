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

const categories = [
    { id: "sarees", label: "Sarees" },
    { id: "lehengas", label: "Lehengas" },
    { id: "kurta-sets", label: "Kurta Sets" },
    { id: "dresses", label: "Dresses" },
    { id: "coords", label: "Co-ords" },
    { id: "gowns", label: "Gowns" },
    { id: "tops", label: "Tops" },
    { id: "loungewear", label: "Loungewear" }
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
        setPriceRange([0, 100000])
    }

    const FilterContent = () => (
        <div className="space-y-14">
            {/* Categories */}
            <div className="space-y-8">
                <h3 className="font-heading font-bold text-[14px] uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4 block">Collection</h3>
                <div className="space-y-5 pt-2">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-4 group cursor-pointer">
                            <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={() => handleCategoryChange(category.id)}
                                className="rounded-none w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary/10"
                            />
                            <Label
                                htmlFor={category.id}
                                className="text-[11px] uppercase tracking-[0.15em] text-primary/80 group-hover:text-primary font-bold cursor-pointer transition-colors font-sans"
                            >
                                {category.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-6">
                <h3 className="font-heading font-bold text-[14px] uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4 block">Price Range</h3>
                <div className="space-y-4 pt-4">
                    <Slider
                        defaultValue={[0, 100000]}
                        max={100000}
                        step={1000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="py-4"
                    />
                    <div className="flex items-center justify-between text-[10px] font-bold text-primary px-1 font-sans opacity-60 uppercase tracking-widest">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                    </div>
                </div>
            </div>

            {/* Colors */}
            <div className="space-y-8">
                <h3 className="font-heading font-bold text-[14px] uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4 block">Color Palette</h3>
                <div className="grid grid-cols-2 gap-y-6 pt-2">
                    {["Maroon", "Gold", "Ivory", "Emerald", "RoyalBlue", "Black"].map((color) => (
                        <div key={color} className="flex items-center space-x-4 group cursor-pointer">
                            <Checkbox
                                id={`color-${color}`}
                                checked={selectedColors.includes(color)}
                                onCheckedChange={() => handleColorChange(color)}
                                className="rounded-full w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary/10"
                            />
                            <Label
                                htmlFor={`color-${color}`}
                                className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-primary/80 group-hover:text-primary font-bold cursor-pointer transition-colors font-sans"
                            >
                                <div
                                    className="w-3 h-3 rounded-full border border-primary/10"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                />
                                <span>{color}</span>
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <Button
                className="w-full rounded-full bg-primary text-secondary text-[10px] font-sans font-bold uppercase tracking-[0.25em] py-6 transition-all duration-500 hover:bg-black mt-10"
                onClick={clearAllFilters}
            >
                Clear All Selection
            </Button>
        </div>
    )

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden rounded-none border-primary/20 text-primary hover:bg-primary hover:text-white transition-all px-8">
                        <Filter className="w-4 h-4 mr-2" />
                        Refine
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] border-primary/10 bg-surface overflow-y-auto">
                    <SheetHeader className="text-left pb-8 border-b border-primary/5">
                        <SheetTitle className="font-heading font-normal text-2xl tracking-wide text-primary">Filters</SheetTitle>
                        <SheetDescription className="text-text-secondary/70 font-sans text-xs uppercase tracking-widest pt-1">
                            Refine your search for the perfect look
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-10">
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
