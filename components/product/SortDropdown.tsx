"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const sortOptions = [
    {
        value: "featured",
        label: "Featured",
    },
    {
        value: "newest",
        label: "Newest Arrivals",
    },
    {
        value: "price-asc",
        label: "Price: Low to High",
    },
    {
        value: "price-desc",
        label: "Price: High to Low",
    },
    {
        value: "best-selling",
        label: "Best Selling",
    },
]

interface SortDropdownProps {
    onSortChange: (value: string) => void
    currentSort: string
}

export function SortDropdown({ onSortChange, currentSort }: SortDropdownProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between rounded-none border-primary/20 text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-[0.2em] text-[10px] font-bold h-11 px-6 font-sans"
                >
                    {currentSort
                        ? sortOptions.find((option) => option.value === currentSort)?.label
                        : "Sort by..."}
                    <ChevronDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 rounded-none border-primary/10 bg-surface shadow-2xl">
                <Command className="bg-transparent">
                    <CommandList>
                        <CommandGroup>
                            {sortOptions.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onSortChange(currentValue === currentSort ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer py-3 aria-selected:bg-primary/5 aria-selected:text-primary font-sans text-xs uppercase tracking-widest"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-3 w-3 text-accent",
                                            currentSort === option.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
