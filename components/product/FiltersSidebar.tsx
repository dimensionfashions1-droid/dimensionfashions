"use client"

import { useEffect, useState } from "react"
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
import { cn } from "@/lib/utils"

interface FetchedCategory {
    id: string
    name: string
    slug: string
}

interface FetchedAttributeOption {
    id: string
    value: string
    hex_code?: string
}

interface FetchedAttribute {
    id: string
    name: string
    slug: string
    is_filterable: boolean
    options: FetchedAttributeOption[]
}

interface FiltersSidebarProps {
    className?: string
    isMobile?: boolean
    selectedCategories: string[]
    setSelectedCategories: (categories: string[]) => void
    selectedAttributes: Record<string, string[]>
    setSelectedAttributes: (attributes: Record<string, string[]>) => void
    priceRange: number[]
    setPriceRange: (range: number[]) => void
}

export function FiltersSidebar({
    className,
    isMobile = false,
    selectedCategories,
    setSelectedCategories,
    selectedAttributes,
    setSelectedAttributes,
    priceRange,
    setPriceRange
}: FiltersSidebarProps) {
    const [categories, setCategories] = useState<FetchedCategory[]>([])
    const [filterableAttributes, setFilterableAttributes] = useState<FetchedAttribute[]>([])

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, attrRes] = await Promise.all([
                    fetch('/api/categories?all=true'),
                    fetch('/api/attributes')
                ])

                if (catRes.ok) {
                    const catData = await catRes.json()
                    setCategories(catData.data || [])
                }

                if (attrRes.ok) {
                    const attrData = await attrRes.json()
                    const attrs: FetchedAttribute[] = attrData.data || []
                    // Only show attributes marked as filterable
                    setFilterableAttributes(attrs.filter(a => a.is_filterable))
                }
            } catch (error) {
                console.error("Failed to fetch filters:", error)
            }
        }
        
        fetchFilters()
    }, [])

    const handleCategoryChange = (categorySlug: string) => {
        setSelectedCategories([categorySlug])
    }

    const handleAttributeToggle = (attrSlug: string, value: string) => {
        const currentSelected = selectedAttributes[attrSlug] || []
        let newSelected: string[]

        if (currentSelected.includes(value)) {
            newSelected = currentSelected.filter(v => v !== value)
        } else {
            newSelected = [...currentSelected, value]
        }

        setSelectedAttributes({
            ...selectedAttributes,
            [attrSlug]: newSelected
        })
    }

    const clearAllFilters = () => {
        setSelectedCategories([])
        setSelectedAttributes({})
        setPriceRange([0, 100000])
    }

    const FilterContent = () => (
        <div className="space-y-14">
            {/* Categories */}
            <div className="space-y-8">
                <h3 className="font-heading font-bold text-[14px] uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4 block">Collection</h3>
                <div className="space-y-4 pt-2">
                    <button
                        onClick={() => setSelectedCategories([])}
                        className={cn(
                            "w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300",
                            selectedCategories.length === 0 || selectedCategories.includes('all')
                                ? "text-accent translate-x-1" 
                                : "text-primary/40 hover:text-primary"
                        )}
                    >
                        All Collections
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.slug)}
                            className={cn(
                                "w-full text-left text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300",
                                selectedCategories.includes(category.slug)
                                    ? "text-accent translate-x-1" 
                                    : "text-primary/40 hover:text-primary"
                            )}
                        >
                            {category.name}
                        </button>
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

            {/* Dynamic Attributes (Colors, Sizes, etc.) */}
            {filterableAttributes.map((attr) => (
                <div key={attr.id} className="space-y-8">
                    <h3 className="font-heading font-bold text-[14px] uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4 block">
                        {attr.slug === 'color' ? 'Color Palette' : attr.name}
                    </h3>
                    <div className={cn(
                        "pt-2",
                        attr.slug === 'color' ? "grid grid-cols-2 gap-y-6" : "space-y-5"
                    )}>
                        {attr.options.map((option) => {
                            const isChecked = (selectedAttributes[attr.slug] || []).includes(option.value);

                            return (
                                <div key={option.id} className="flex items-center space-x-4 group cursor-pointer">
                                    <Checkbox
                                        id={`${attr.slug}-${option.value}`}
                                        checked={isChecked}
                                        onCheckedChange={() => handleAttributeToggle(attr.slug, option.value)}
                                        className={cn(
                                            attr.slug === 'color' ? "rounded-full" : "rounded-none",
                                            "w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:text-white border-primary/10"
                                        )}
                                    />
                                    <Label
                                        htmlFor={`${attr.slug}-${option.value}`}
                                        className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-primary/80 group-hover:text-primary font-bold cursor-pointer transition-colors font-sans"
                                    >
                                        {attr.slug === 'color' && (
                                            <div
                                                className="w-3 h-3 rounded-full border border-primary/10"
                                                style={{ backgroundColor: option.hex_code || option.value.toLowerCase() }}
                                            />
                                        )}
                                        <span>{option.value}</span>
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

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
                    <Button 
                        variant="outline" 
                        size="icon"
                        className="lg:hidden rounded-full border-primary/10 text-primary hover:bg-primary hover:text-white transition-all w-12 h-12 shadow-sm bg-white"
                    >
                        <Filter className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] border-none bg-white p-0 overflow-y-auto">
                    <SheetHeader className="text-left p-8 border-b border-gray-100 bg-gray-50/50">
                        <SheetTitle className="font-heading font-normal text-2xl tracking-wide text-primary">Filters</SheetTitle>
                        <SheetDescription className="text-primary/50 font-sans text-[10px] uppercase tracking-[0.2em] pt-1">
                            Curate your selection
                        </SheetDescription>
                    </SheetHeader>
                    <div className="p-8 pb-20">
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
