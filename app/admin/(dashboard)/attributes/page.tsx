"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { AttributeDefinitionRow, AttributeOptionRow, AttributeType } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, SlidersHorizontal, Loader2, X } from "lucide-react"
import { AdminPageHeader, AdminDeleteDialog, StatusBadge } from "@/components/admin"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface AttributeWithOptions extends AttributeDefinitionRow {
  options: AttributeOptionRow[]
}

interface OptionFormItem {
  value: string
  hex_code: string
  display_value: string
}

const typeLabels: Record<AttributeType, string> = {
  select: "Select",
  multi_select: "Multi Select",
  text: "Text",
  color: "Color",
}

export default function AdminAttributesPage() {
  const { toast } = useToast()
  const { data: response, isLoading } = useSWR("/api/attributes", fetcher)
  const attributes: AttributeWithOptions[] = response?.data || []

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAttr, setEditingAttr] = useState<AttributeWithOptions | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [type, setType] = useState<AttributeType>("select")
  const [isFilterable, setIsFilterable] = useState(false)
  const [isVariant, setIsVariant] = useState(true)
  const [options, setOptions] = useState<OptionFormItem[]>([])

  const resetForm = () => {
    setName(""); setSlug(""); setType("select")
    setIsFilterable(false); setIsVariant(true); setOptions([])
  }

  const openCreate = () => { setEditingAttr(null); resetForm(); setDialogOpen(true) }

  const openEdit = (attr: AttributeWithOptions) => {
    setEditingAttr(attr)
    setName(attr.name); setSlug(attr.slug); setType(attr.type)
    setIsFilterable(attr.is_filterable); setIsVariant(attr.is_variant)
    setOptions(attr.options.map(o => ({ value: o.value, hex_code: o.hex_code || "", display_value: o.display_value || "" })))
    setDialogOpen(true)
  }

  const addOption = () => setOptions(prev => [...prev, { value: "", hex_code: "", display_value: "" }])
  const removeOption = (i: number) => setOptions(prev => prev.filter((_, idx) => idx !== i))
  const updateOption = (i: number, field: keyof OptionFormItem, value: string) => {
    setOptions(prev => prev.map((opt, idx) => idx === i ? { ...opt, [field]: value } : opt))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        name, slug, type, is_filterable: isFilterable, is_variant: isVariant,
      }
      if (type !== "text") payload.options = options.filter(o => o.value.trim())

      if (editingAttr) {
        const response = await fetch(`/api/attributes/${editingAttr.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: result.error?.includes("already exists") ? "Duplicate attribute" : "Attribute update failed",
            description: result.error || "Failed to update attribute.",
          })
          return
        }
      } else {
        const res = await fetch("/api/attributes", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, slug, type, is_filterable: isFilterable, is_variant: isVariant }),
        })
        const result = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast({
            variant: "destructive",
            title: result.error?.includes("already exists") ? "Duplicate attribute" : "Attribute create failed",
            description: result.error || "Failed to create attribute.",
          })
          return
        }
        if (result.data && type !== "text" && options.length > 0) {
          const optionsResponse = await fetch(`/api/attributes/${result.data.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ options: options.filter(o => o.value.trim()) }),
          })
          if (!optionsResponse.ok) {
            const optionsResult = await optionsResponse.json().catch(() => ({}))
            toast({
              variant: "destructive",
              title: "Attribute options failed",
              description: optionsResult.error || "Failed to save attribute options.",
            })
            return
          }
        }
      }
      await mutate("/api/attributes")
      toast({
        title: editingAttr ? "Attribute updated" : "Attribute created",
        description: editingAttr ? "The attribute was updated successfully." : "The attribute was created successfully.",
      })
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to save attribute:", error)
      toast({
        variant: "destructive",
        title: editingAttr ? "Attribute update failed" : "Attribute create failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/attributes/${deleteId}`, { method: "DELETE" })
      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: result.error || "Failed to delete attribute.",
        })
        return
      }

      await mutate("/api/attributes")
      toast({
        title: "Attribute deleted",
        description: "The attribute was deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete attribute:", error)
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Attributes"
        subtitle="Define product attributes like Color, Size, Fabric"
        actionLabel="Add Attribute"
        actionOnClick={openCreate}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      ) : attributes.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <SlidersHorizontal className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No attributes defined yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attributes.map(attr => (
            <div key={attr.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-white">{attr.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-300 uppercase tracking-wider">
                      {typeLabels[attr.type]}
                    </span>
                    {attr.is_filterable && <StatusBadge label="Filterable" variant="info" />}
                    {attr.is_variant && <StatusBadge label="Variant" variant="success" />}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(attr)}
                    className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(attr.id)}
                    className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {attr.options.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attr.options.map(opt => (
                    <span key={opt.id} className="inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                      {attr.type === "color" && opt.hex_code && (
                        <span className="w-3 h-3 rounded-full border border-zinc-600" style={{ backgroundColor: opt.hex_code }} />
                      )}
                      {opt.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAttr ? "Edit Attribute" : "New Attribute"}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {editingAttr ? "Update the attribute definition and options." : "Define a new product attribute."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Name</Label>
                <Input value={name} onChange={e => { setName(e.target.value); if (!editingAttr) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')) }}
                  className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="Color" />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Slug</Label>
                <Input value={slug} onChange={e => setSlug(e.target.value)}
                  className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="color" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Type</Label>
              <Select value={type} onValueChange={(val) => setType(val as AttributeType)} disabled={!!editingAttr}>
                <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
                  <SelectItem value="select" className="rounded-lg focus:bg-zinc-900">Select</SelectItem>
                  <SelectItem value="multi_select" className="rounded-lg focus:bg-zinc-900">Multi Select</SelectItem>
                  <SelectItem value="color" className="rounded-lg focus:bg-zinc-900">Color</SelectItem>
                  <SelectItem value="text" className="rounded-lg focus:bg-zinc-900">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Filterable (show in sidebar)</Label>
              <Switch checked={isFilterable} onCheckedChange={setIsFilterable} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Variant (buyer must select)</Label>
              <Switch checked={isVariant} onCheckedChange={setIsVariant} />
            </div>

            {type !== "text" && (
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Options</Label>
                  <Button type="button" size="sm" variant="ghost" onClick={addOption}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1 h-7 text-xs">
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input value={opt.value} onChange={e => updateOption(i, "value", e.target.value)}
                        className="h-10 flex-1 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500" placeholder="Value" />
                      {type === "color" && (
                        <Input value={opt.hex_code} onChange={e => updateOption(i, "hex_code", e.target.value)}
                          className="h-10 w-24 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500" placeholder="#hex" />
                      )}
                      <Button type="button" size="icon" variant="ghost" onClick={() => removeOption(i)}
                        className="h-8 w-8 text-zinc-500 hover:text-rose-400 shrink-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}
              className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white">Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !name || !slug}
              className="bg-white text-zinc-900 hover:bg-zinc-200">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingAttr ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Attribute"
        description="This will permanently remove this attribute definition and all its options. Products using this attribute will lose those values."
      />
    </div>
  )
}
