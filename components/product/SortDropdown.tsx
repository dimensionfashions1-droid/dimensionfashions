"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const sortOptions = [
    {
        value: "newest",
        label: "Newest Arrivals",
    },
    {
        value: "bestsellers",
        label: "Best Sellers",
    },
    {
        value: "price-asc",
        label: "Price: Low to High",
    },
    {
        value: "price-desc",
        label: "Price: High to Low",
    },
]

interface SortDropdownProps {
    onSortChange: (value: string) => void
    currentSort: string
}

export function SortDropdown({ onSortChange, currentSort }: SortDropdownProps) {
    return (
        <div className="flex items-center gap-4 group">
            <span className="text-[11px] uppercase tracking-widest font-bold text-primary font-sans hidden sm:block transition-colors group-hover:text-accent">
                Sort by
            </span>
            <Select value={currentSort} onValueChange={onSortChange}>
                <SelectTrigger className="w-[180px] h-10 rounded-full border-gray-100 bg-gray-50/50 px-6 text-primary hover:bg-gray-100/50 transition-all duration-300 uppercase tracking-widest text-[10px] font-bold font-sans shadow-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Newest Arrivals" />
                </SelectTrigger>
                <SelectContent 
                    className="rounded-xl border-gray-100 bg-white shadow-xl p-0 min-w-[200px] overflow-hidden"
                    position="popper"
                    sideOffset={10}
                    align="end"
                >
                    <div className="py-2">
                        {sortOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer py-3 px-6 focus:bg-primary/5 focus:text-primary font-sans text-[10px] uppercase tracking-widest font-bold border-transparent transition-colors duration-200 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary"
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </div>
                </SelectContent>
            </Select>
        </div>
    )
}
