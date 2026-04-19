"use client"

export const dynamic = 'force-dynamic'


import { useEffect, useMemo, useState } from "react"
import useSWR, { mutate } from "swr"
import { useDebounce } from "use-debounce"
import { CategoryRow, SubcategoryRow } from "@/types"
import { TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AdminDataTable,
  AdminDeleteDialog,
  AdminPageHeader,
  AdminPagination,
  AdminSearch,
} from "@/components/admin"
import { AdminImageUploader } from "@/components/admin/AdminImageUploader"
import { FolderTree, Pencil, Plus, Tags, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PaginationMeta {
  total: number
  page: number
  totalPages: number
}

interface CategoryResponse {
  data: CategoryRow[]
  meta?: PaginationMeta
}

interface SubcategoryWithCategory extends SubcategoryRow {
  categories?: {
    name: string
    slug: string
  } | null
}

interface SubcategoryResponse {
  data: SubcategoryWithCategory[]
  meta?: PaginationMeta
}

const categoryColumns = [
  { key: "image", label: "Image" },
  { key: "category", label: "Category" },
  { key: "slug", label: "Slug" },
  { key: "actions", label: "Actions", className: "text-right" },
]

const subcategoryColumns = [
  { key: "image", label: "Image" },
  { key: "subcategory", label: "Subcategory" },
  { key: "parent", label: "Parent Category" },
  { key: "slug", label: "Slug" },
  { key: "actions", label: "Actions", className: "text-right" },
]

export default function AdminCategoriesPage() {
  const { toast } = useToast()
  const [categorySearch, setCategorySearch] = useState("")
  const [subcategorySearch, setSubcategorySearch] = useState("")
  const [categoryPage, setCategoryPage] = useState(1)
  const [subcategoryPage, setSubcategoryPage] = useState(1)

  const [debouncedCategorySearch] = useDebounce(categorySearch, 300)
  const [debouncedSubcategorySearch] = useDebounce(subcategorySearch, 300)

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryWithCategory | null>(null)
  const [categoryDeleteId, setCategoryDeleteId] = useState<string | null>(null)
  const [subcategoryDeleteId, setSubcategoryDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeletingCategory, setIsDeletingCategory] = useState(false)
  const [isDeletingSubcategory, setIsDeletingSubcategory] = useState(false)

  const [categoryName, setCategoryName] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [categoryImageUrl, setCategoryImageUrl] = useState("")

  const [subcategoryCategoryId, setSubcategoryCategoryId] = useState("")
  const [subcategoryName, setSubcategoryName] = useState("")
  const [subcategorySlug, setSubcategorySlug] = useState("")
  const [subcategoryImageUrl, setSubcategoryImageUrl] = useState("")

  useEffect(() => {
    setCategoryPage(1)
  }, [debouncedCategorySearch])

  useEffect(() => {
    setSubcategoryPage(1)
  }, [debouncedSubcategorySearch])

  const categoryQueryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set("page", categoryPage.toString())
    params.set("limit", "10")
    if (debouncedCategorySearch.trim()) {
      params.set("search", debouncedCategorySearch.trim())
    }
    return params.toString()
  }, [categoryPage, debouncedCategorySearch])

  const subcategoryQueryString = useMemo(() => {
    const params = new URLSearchParams()
    params.set("page", subcategoryPage.toString())
    params.set("limit", "10")
    if (debouncedSubcategorySearch.trim()) {
      params.set("search", debouncedSubcategorySearch.trim())
    }
    return params.toString()
  }, [subcategoryPage, debouncedSubcategorySearch])

  const categoriesKey = `/api/categories?${categoryQueryString}`
  const subcategoriesKey = `/api/subcategories?${subcategoryQueryString}`

  const { data: categoryResponse, isLoading: isLoadingCategories } = useSWR<CategoryResponse>(categoriesKey, fetcher)
  const { data: subcategoryResponse, isLoading: isLoadingSubcategories } = useSWR<SubcategoryResponse>(subcategoriesKey, fetcher)
  const { data: categoryOptionsResponse } = useSWR<CategoryResponse>("/api/categories?all=true", fetcher)

  const categories = categoryResponse?.data || []
  const categoryMeta = categoryResponse?.meta
  const subcategories = subcategoryResponse?.data || []
  const subcategoryMeta = subcategoryResponse?.meta
  const categoryOptions = categoryOptionsResponse?.data || []

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryName("")
    setCategorySlug("")
    setCategoryImageUrl("")
  }

  const resetSubcategoryForm = () => {
    setEditingSubcategory(null)
    setSubcategoryCategoryId(categoryOptions[0]?.id || "")
    setSubcategoryName("")
    setSubcategorySlug("")
    setSubcategoryImageUrl("")
  }

  const openCreateCategory = () => {
    resetCategoryForm()
    setCategoryDialogOpen(true)
  }

  const openEditCategory = (category: CategoryRow) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setCategorySlug(category.slug)
    setCategoryImageUrl(category.image_url || "")
    setCategoryDialogOpen(true)
  }

  const openCreateSubcategory = () => {
    resetSubcategoryForm()
    setSubcategoryDialogOpen(true)
  }

  const openEditSubcategory = (subcategory: SubcategoryWithCategory) => {
    setEditingSubcategory(subcategory)
    setSubcategoryCategoryId(subcategory.category_id)
    setSubcategoryName(subcategory.name)
    setSubcategorySlug(subcategory.slug)
    setSubcategoryImageUrl(subcategory.image_url || "")
    setSubcategoryDialogOpen(true)
  }

  const handleCategorySubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: categoryName.trim(),
        slug: categorySlug.trim(),
        image_url: categoryImageUrl || null,
      }

      const response = await fetch(
        editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories",
        {
          method: editingCategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = result.error || "Failed to save category"
        toast({
          variant: "destructive",
          title: message.includes("already exists")
            ? "Duplicate category"
            : editingCategory
              ? "Category update failed"
              : "Category create failed",
          description: message,
        })
        return
      }

      await Promise.all([
        mutate(categoriesKey),
        mutate("/api/categories?all=true"),
      ])

      setCategoryDialogOpen(false)
      resetCategoryForm()
    } catch (error) {
      console.error("Failed to save category:", error)
      const message = error instanceof Error ? error.message : "Please try again."
      toast({
        variant: "destructive",
        title:
          message.includes("already exists")
            ? "Duplicate category"
            : editingCategory
              ? "Category update failed"
              : "Category create failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubcategorySubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        category_id: subcategoryCategoryId,
        name: subcategoryName.trim(),
        slug: subcategorySlug.trim(),
        image_url: subcategoryImageUrl || null,
      }

      const response = await fetch(
        editingSubcategory ? `/api/subcategories/${editingSubcategory.id}` : "/api/subcategories",
        {
          method: editingSubcategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = result.error || "Failed to save subcategory"
        toast({
          variant: "destructive",
          title: message.includes("already exists")
            ? "Duplicate subcategory"
            : editingSubcategory
              ? "Subcategory update failed"
              : "Subcategory create failed",
          description: message,
        })
        return
      }

      await Promise.all([
        mutate(subcategoriesKey),
        mutate("/api/categories?all=true"),
      ])

      setSubcategoryDialogOpen(false)
      resetSubcategoryForm()
    } catch (error) {
      console.error("Failed to save subcategory:", error)
      const message = error instanceof Error ? error.message : "Please try again."
      toast({
        variant: "destructive",
        title:
          message.includes("already exists")
            ? "Duplicate subcategory"
            : editingSubcategory
              ? "Subcategory update failed"
              : "Subcategory create failed",
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCategoryDelete = async () => {
    if (!categoryDeleteId) return

    setIsDeletingCategory(true)
    try {
      const response = await fetch(`/api/categories/${categoryDeleteId}`, { method: "DELETE" })
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Failed to delete category",
        })
        return
      }

      await Promise.all([
        mutate(categoriesKey),
        mutate(subcategoriesKey),
        mutate("/api/categories?all=true"),
      ])

      toast({
        title: "Category deleted",
        description: "The category was deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete category:", error)
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsDeletingCategory(false)
      setCategoryDeleteId(null)
    }
  }

  const handleSubcategoryDelete = async () => {
    if (!subcategoryDeleteId) return

    setIsDeletingSubcategory(true)
    try {
      const response = await fetch(`/api/subcategories/${subcategoryDeleteId}`, { method: "DELETE" })
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "Failed to delete subcategory",
        })
        return
      }

      await Promise.all([
        mutate(subcategoriesKey),
        mutate("/api/categories?all=true"),
      ])

      toast({
        title: "Subcategory deleted",
        description: "The subcategory was deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete subcategory:", error)
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsDeletingSubcategory(false)
      setSubcategoryDeleteId(null)
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Categories"
        subtitle="Manage categories and subcategories with searchable server-side tables"
      />

      <section className="space-y-4 rounded-[28px] bg-zinc-950/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearch
            value={categorySearch}
            onChange={setCategorySearch}
            placeholder="Search categories..."
          />
          <Button onClick={openCreateCategory} className="h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <AdminDataTable
          columns={categoryColumns}
          data={categories}
          isLoading={isLoadingCategories}
          emptyIcon={<Tags className="h-8 w-8 opacity-50" />}
          emptyMessage="No categories found."
          keyExtractor={(category) => category.id}
          renderRow={(category) => (
            <>
              <TableCell>
                {category.image_url ? (
                  <img src={category.image_url} alt={category.name} className="h-12 w-12 rounded-lg object-cover bg-zinc-800" />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                    <Tags className="h-4 w-4" />
                  </div>
                )}
              </TableCell>
              <TableCell className="text-white font-medium text-sm">{category.name}</TableCell>
              <TableCell className="text-zinc-400 text-sm">/{category.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditCategory(category)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategoryDeleteId(category.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </>
          )}
        />

        {categoryMeta && (
          <AdminPagination meta={categoryMeta} page={categoryPage} onPageChange={setCategoryPage} label="categories" />
        )}
      </section>

      <section className="space-y-4 rounded-[28px] bg-zinc-950/70 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AdminSearch
            value={subcategorySearch}
            onChange={setSubcategorySearch}
            placeholder="Search subcategories..."
          />
          <Button
            onClick={openCreateSubcategory}
            disabled={categoryOptions.length === 0}
            className="h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 gap-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Subcategory
          </Button>
        </div>

        <AdminDataTable
          columns={subcategoryColumns}
          data={subcategories}
          isLoading={isLoadingSubcategories}
          emptyIcon={<FolderTree className="h-8 w-8 opacity-50" />}
          emptyMessage="No subcategories found."
          keyExtractor={(subcategory) => subcategory.id}
          renderRow={(subcategory) => (
            <>
              <TableCell>
                {subcategory.image_url ? (
                  <img src={subcategory.image_url} alt={subcategory.name} className="h-12 w-12 rounded-lg object-cover bg-zinc-800" />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500">
                    <FolderTree className="h-4 w-4" />
                  </div>
                )}
              </TableCell>
              <TableCell className="text-white font-medium text-sm">{subcategory.name}</TableCell>
              <TableCell className="text-zinc-300 text-sm">{subcategory.categories?.name || "Unassigned"}</TableCell>
              <TableCell className="text-zinc-400 text-sm">/{subcategory.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditSubcategory(subcategory)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSubcategoryDeleteId(subcategory.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </>
          )}
        />

        {subcategoryMeta && (
          <AdminPagination
            meta={subcategoryMeta}
            page={subcategoryPage}
            onPageChange={setSubcategoryPage}
            label="subcategories"
          />
        )}
      </section>

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-xl rounded-[28px] border border-zinc-800 bg-zinc-950/95 p-7 text-white shadow-2xl shadow-black/50 backdrop-blur-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight">{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-zinc-400">
              Upload an image and save the category details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-zinc-200">Category Image</Label>
              <AdminImageUploader value={categoryImageUrl} onChange={setCategoryImageUrl} folder="categories" />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-zinc-200">Name</Label>
              <Input
                value={categoryName}
                onChange={(event) => {
                  setCategoryName(event.target.value)
                  if (!editingCategory) {
                    setCategorySlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                }}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60"
                placeholder="e.g., Sarees"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-zinc-200">Slug</Label>
              <Input
                value={categorySlug}
                onChange={(event) => setCategorySlug(event.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60"
                placeholder="sarees"
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
              disabled={isSubmitting}
              className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCategorySubmit}
              disabled={isSubmitting || !categoryName.trim() || !categorySlug.trim()}
              className="h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent className="max-w-xl rounded-[28px] border border-zinc-800 bg-zinc-950/95 p-7 text-white shadow-2xl shadow-black/50 backdrop-blur-xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight">{editingSubcategory ? "Edit Subcategory" : "New Subcategory"}</DialogTitle>
            <DialogDescription className="text-sm leading-6 text-zinc-400">
              Link the subcategory to a parent category and upload its image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-zinc-200">Subcategory Image</Label>
              <AdminImageUploader value={subcategoryImageUrl} onChange={setSubcategoryImageUrl} folder="subcategories" />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-zinc-200">Parent Category</Label>
              <Select
                value={subcategoryCategoryId}
                onValueChange={setSubcategoryCategoryId}
              >
                <SelectTrigger className="h-11 w-full rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
                  {categoryOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="rounded-lg focus:bg-zinc-900 focus:text-white">
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-zinc-200">Name</Label>
              <Input
                value={subcategoryName}
                onChange={(event) => {
                  setSubcategoryName(event.target.value)
                  if (!editingSubcategory) {
                    setSubcategorySlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                }}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60"
                placeholder="e.g., Kanjivaram"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-zinc-200">Slug</Label>
              <Input
                value={subcategorySlug}
                onChange={(event) => setSubcategorySlug(event.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60"
                placeholder="kanjivaram"
              />
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setSubcategoryDialogOpen(false)}
              disabled={isSubmitting}
              className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubcategorySubmit}
              disabled={isSubmitting || !subcategoryCategoryId || !subcategoryName.trim() || !subcategorySlug.trim()}
              className="h-11 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingSubcategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog
        open={!!categoryDeleteId}
        onOpenChange={() => setCategoryDeleteId(null)}
        onConfirm={handleCategoryDelete}
        isDeleting={isDeletingCategory}
        title="Delete Category"
        description="This will permanently delete this category and its child subcategories."
      />

      <AdminDeleteDialog
        open={!!subcategoryDeleteId}
        onOpenChange={() => setSubcategoryDeleteId(null)}
        onConfirm={handleSubcategoryDelete}
        isDeleting={isDeletingSubcategory}
        title="Delete Subcategory"
        description="This will permanently delete this subcategory."
      />
    </div>
  )
}
