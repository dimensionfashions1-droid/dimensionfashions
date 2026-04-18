"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { CategoryRow, SubcategoryRow } from "@/types"
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
import { Plus, Pencil, Trash2, Tags, ChevronRight, Loader2 } from "lucide-react"
import { AdminPageHeader, AdminDeleteDialog } from "@/components/admin"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface CategoryWithSubs extends CategoryRow {
  subcategories: SubcategoryRow[]
}

export default function AdminCategoriesPage() {
  const { data: response, isLoading } = useSWR("/api/categories", fetcher)
  const categories: CategoryWithSubs[] = response?.data || []

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithSubs | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [subDialogOpen, setSubDialogOpen] = useState(false)
  const [subCategoryId, setSubCategoryId] = useState("")
  const [subName, setSubName] = useState("")
  const [subSlug, setSubSlug] = useState("")

  const openCreate = () => {
    setEditingCategory(null)
    setName("")
    setSlug("")
    setImageUrl("")
    setDialogOpen(true)
  }

  const openEdit = (cat: CategoryWithSubs) => {
    setEditingCategory(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setImageUrl(cat.image_url || "")
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = { name, slug, image_url: imageUrl || null }
      if (editingCategory) {
        await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      mutate("/api/categories")
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to save category:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/categories/${deleteId}`, { method: "DELETE" })
      mutate("/api/categories")
    } catch (error) {
      console.error("Failed to delete category:", error)
    } finally {
      setDeleteId(null)
    }
  }

  const openSubCreate = (categoryId: string) => {
    setSubCategoryId(categoryId)
    setSubName("")
    setSubSlug("")
    setSubDialogOpen(true)
  }

  const handleSubSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id: subCategoryId, name: subName, slug: subSlug }),
      })
      if (!res.ok) throw new Error("Failed to create subcategory")
      mutate("/api/categories")
      setSubDialogOpen(false)
    } catch (error) {
      console.error("Failed to save subcategory:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Categories"
        subtitle="Manage your product collections and subcategories"
        actionLabel="Add Category"
        actionOnClick={openCreate}
      />

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Tags className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No categories yet. Create your first collection.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  {cat.image_url && (
                    <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover bg-zinc-800" />
                  )}
                  <div>
                    <h3 className="font-medium text-white">{cat.name}</h3>
                    <p className="text-xs text-zinc-500">/{cat.slug} · {cat.subcategories.length} subcategories</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openSubCreate(cat.id)}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1 text-xs">
                    <Plus className="h-3 w-3" /> Sub
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(cat.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {cat.subcategories.length > 0 && (
                <div className="border-t border-zinc-800 bg-zinc-950/50">
                  {cat.subcategories.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 last:border-0">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <ChevronRight className="h-3 w-3 text-zinc-600" />
                        {sub.name}
                        <span className="text-zinc-600">/{sub.slug}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {editingCategory ? "Update the category details." : "Create a new product collection."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Name</Label>
              <Input value={name} onChange={e => { setName(e.target.value); if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')) }}
                className="bg-zinc-800 border-zinc-700 text-white" placeholder="e.g., Sarees" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white" placeholder="sarees" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Image URL (optional)</Label>
              <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white" placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !name || !slug}
              className="bg-white text-zinc-900 hover:bg-zinc-200">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subcategory Dialog */}
      <Dialog open={subDialogOpen} onOpenChange={setSubDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription className="text-zinc-400">Create a new subcategory under this collection.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-300">Name</Label>
              <Input value={subName} onChange={e => { setSubName(e.target.value); setSubSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')) }}
                className="bg-zinc-800 border-zinc-700 text-white" placeholder="e.g., Kanjivaram" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Slug</Label>
              <Input value={subSlug} onChange={e => setSubSlug(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white" placeholder="kanjivaram" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">Cancel</Button>
            <Button onClick={handleSubSubmit} disabled={isSubmitting || !subName || !subSlug}
              className="bg-white text-zinc-900 hover:bg-zinc-200">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AdminDeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="This will permanently delete this category and all its subcategories. Products linked to this category will be unlinked."
      />
    </div>
  )
}
