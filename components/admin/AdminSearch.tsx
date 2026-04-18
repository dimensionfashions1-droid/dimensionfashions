"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface AdminSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "Search...",
  className = "max-w-sm",
}: AdminSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
      />
    </div>
  )
}
