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
                    className="w-[200px] justify-between rounded-full border-neutral-800 text-white hover:bg-white hover:text-black transition-colors"
                >
                    {currentSort
                        ? sortOptions.find((option) => option.value === currentSort)?.label
                        : "Sort by..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
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
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
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
