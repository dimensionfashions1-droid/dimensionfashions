"use client"

export const dynamic = 'force-dynamic'


import { useState } from "react"
import Link from "next/link"
import useSWR, { mutate } from "swr"
import { ProductRow } from "@/types"
import { TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Package } from "lucide-react"
import {
  AdminPageHeader,
  AdminSearch,
  AdminDataTable,
  AdminPagination,
  AdminDeleteDialog,
  StatusBadge,
} from "@/components/admin"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface AdminProduct {
  id: string
  title: string
  price: number
  originalPrice?: number
  slug: string
  image: string
  category: string
  status: 'draft' | 'published'
  hasVariants: boolean
  inStock: boolean
  stock_count: number
  colors: string[]
  sizes: string[]
}

const columns = [
  { key: "product", label: "Product" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "availability", label: "Availability" },
  { key: "actions", label: "Actions", className: "text-right" },
]

export default function AdminProductsPage() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const queryString = new URLSearchParams()
  queryString.append("page", page.toString())
  queryString.append("limit", "10")
  queryString.append("admin", "true")
  if (search) queryString.append("search", search)

  const { data: response, isLoading } = useSWR(`/api/products?${queryString.toString()}`, fetcher)
  const products: AdminProduct[] = response?.data || []
  const meta = response?.meta

  const handleDelete = async () => {
    if (!deleteSlug) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/products/${deleteSlug}`, { method: "DELETE" })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: result.error || "Failed to delete product.",
        })
        return
      }

      await mutate(`/api/products?${queryString.toString()}`)
      toast({
        title: "Product deleted",
        description: "The product was deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteSlug(null)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products"
        subtitle="Manage your product catalog"
        actionLabel="Add Product"
        actionHref="/admin/products/new"
      />

      <AdminSearch
        value={search}
        onChange={(val) => { setSearch(val); setPage(1) }}
        placeholder="Search products..."
      />

      <AdminDataTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyIcon={<Package className="h-8 w-8 opacity-50" />}
        emptyMessage="No products found."
        keyExtractor={(p) => p.id}
        renderRow={(product) => (
          <>
            <TableCell>
              <div className="flex items-center gap-3">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="h-10 w-10 rounded-lg object-cover bg-zinc-800" />
                ) : (
                   <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                     <Package className="h-5 w-5 text-zinc-600" />
                   </div>
                )}
                <div>
                  <p className="font-medium text-white text-sm">{product.title}</p>
                  <p className="text-xs text-zinc-500">{product.slug}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-zinc-300">₹{product.price.toLocaleString()}</TableCell>
            <TableCell>
              <span className={`text-sm font-medium ${product.stock_count > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {product.stock_count}
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge
                label={product.status === 'published' ? "Published" : "Draft"}
                variant={product.status === 'published' ? "success" : "neutral"}
              />
            </TableCell>
            <TableCell>
              <StatusBadge
                label={product.inStock ? "In Stock" : "Out of Stock"}
                variant={product.inStock ? "success" : "danger"}
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/products/${product.slug}/edit`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                  onClick={() => setDeleteSlug(product.slug)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </>
        )}
      />

      {meta && (
        <AdminPagination meta={meta} page={page} onPageChange={setPage} label="products" />
      )}

      <AdminDeleteDialog
        open={!!deleteSlug}
        onOpenChange={() => setDeleteSlug(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Product"
        description="This action cannot be undone. The product and all its associated attributes will be permanently removed."
      />
    </div>
  )
}
