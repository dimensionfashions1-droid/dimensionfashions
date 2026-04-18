"use client"

import { Button } from "@/components/ui/button"

interface PaginationMeta {
  page: number
  totalPages: number
  total: number
}

interface AdminPaginationProps {
  meta: PaginationMeta
  page: number
  onPageChange: (page: number) => void
  label?: string
}

export function AdminPagination({
  meta,
  page,
  onPageChange,
  label = "items",
}: AdminPaginationProps) {
  if (meta.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-sm text-zinc-500">
        Page {meta.page} of {meta.totalPages} ({meta.total} {label})
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= meta.totalPages}
          onClick={() => onPageChange(page + 1)}
          className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
