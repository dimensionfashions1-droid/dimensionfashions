"use client"

import { ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2 } from "lucide-react"

interface Column {
  key: string
  label: string
  className?: string
}

interface AdminDataTableProps<T> {
  columns: Column[]
  data: T[]
  isLoading: boolean
  emptyIcon?: ReactNode
  emptyMessage?: string
  renderRow: (item: T) => ReactNode
  keyExtractor: (item: T) => string
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading,
  emptyIcon,
  emptyMessage = "No data found.",
  renderRow,
  keyExtractor,
}: AdminDataTableProps<T>) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`text-zinc-400 font-medium ${col.className || ""}`}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow className="border-zinc-800">
              <TableCell colSpan={columns.length} className="text-center py-12 text-zinc-500">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Loading...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableCell colSpan={columns.length} className="text-center py-12 text-zinc-500">
                {emptyIcon && <div className="flex justify-center mb-2">{emptyIcon}</div>}
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={keyExtractor(item)} className="border-zinc-800 hover:bg-transparent">
                {renderRow(item)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
