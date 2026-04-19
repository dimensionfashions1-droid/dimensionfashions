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
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border-zinc-800 bg-zinc-950/80 pl-10 text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60"
      />
    </div>
  )
}
