"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface AttributeOption {
  id: string
  value: string
  hex_code?: string
  display_value?: string
}

interface AttributeDefinition {
  id: string
  name: string
  slug: string
  type: string
  options: AttributeOption[]
}

interface Category {
  id: string
  name: string
  slug: string
  subcategories?: { id: string; name: string; slug: string }[]
}

export default function AdminProductNewPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch categories and attributes for the form selectors
  const { data: catResponse } = useSWR("/api/categories", fetcher)
  const { data: attrResponse } = useSWR("/api/attributes", fetcher)

  const categories: Category[] = catResponse?.data || []
  const attributeDefs: AttributeDefinition[] = attrResponse?.data || []

  // ── Form State ────────────────────────────────────────────────────
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [stockCount, setStockCount] = useState("0")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isBestSeller, setIsBestSeller] = useState(false)
  const [images, setImages] = useState<string[]>([])

  // Dynamic attributes: { [attribute_id]: option_id[] | text_value }
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[] | string>>({})

  // Auto-generate slug from title
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "")
    setSlug(generated)
  }, [title])

  // Get subcategories for the selected category
  const selectedCategory = categories.find(c => c.id === categoryId)
  const subcategories = selectedCategory?.subcategories || []

  // ── Image Upload ──────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "products")

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const errData = await res.json()
          console.error("Upload error:", errData.error)
          continue
        }

        const data = await res.json()
        if (data.data?.url) {
          setImages(prev => [...prev, data.data.url])
        }
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // ── Attribute Handlers ────────────────────────────────────────────
  const handleOptionToggle = (attrId: string, optionId: string) => {
    setSelectedAttributes(prev => {
      const current = (prev[attrId] as string[]) || []
      if (current.includes(optionId)) {
        return { ...prev, [attrId]: current.filter(id => id !== optionId) }
      }
      return { ...prev, [attrId]: [...current, optionId] }
    })
  }

  const handleTextAttribute = (attrId: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [attrId]: value }))
  }

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Build the product payload
      const productPayload = {
        title,
        slug,
        description,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        discount: discount ? Number(discount) : 0,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        stock_count: Number(stockCount),
        is_featured: isFeatured,
        is_best_seller: isBestSeller,
        images,
      }

      // 1. Create the product
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to create product")
      }

      const { data: createdProduct } = await res.json()

      // 2. Link attributes
      const attrRows: Array<{ product_id: string; attribute_id: string; option_id?: string; text_value?: string }> = []

      for (const [attrId, value] of Object.entries(selectedAttributes)) {
        const def = attributeDefs.find(d => d.id === attrId)
        if (!def) continue

        if (def.type === "text" && typeof value === "string" && value.trim()) {
          attrRows.push({
            product_id: createdProduct.id,
            attribute_id: attrId,
            text_value: value.trim(),
          })
        } else if (Array.isArray(value)) {
          for (const optionId of value) {
            attrRows.push({
              product_id: createdProduct.id,
              attribute_id: attrId,
              option_id: optionId,
            })
          }
        }
      }

      // Batch insert attributes if any
      if (attrRows.length > 0) {
        // We use the PUT endpoint for the newly created slug to link attributes
        await fetch(`/api/products/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attributes: attrRows.map(r => ({ attribute_id: r.attribute_id, option_id: r.option_id, text_value: r.text_value })) }),
        })
      }

      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">New Product</h1>
          <p className="text-zinc-400 text-sm mt-1">Create a new product in your catalog</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Basic Information ─────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="e.g., Midnight Kanjivaram Saree" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} required
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="midnight-kanjivaram-saree" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="Product description..." />
            </div>
          </div>
        </div>

        {/* ── Pricing ──────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Selling Price (₹)</Label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="2999" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Original Price (₹)</Label>
              <Input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="4999" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Discount %</Label>
              <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="20" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Stock Count</Label>
              <Input type="number" value={stockCount} onChange={e => setStockCount(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600" placeholder="50" />
            </div>
          </div>
        </div>

        {/* ── Category ─────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Category</Label>
              <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setSubcategoryId("") }}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id} className="hover:bg-zinc-800 focus:bg-zinc-800">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Subcategory</Label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                    {subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id} className="hover:bg-zinc-800 focus:bg-zinc-800">{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* ── Images ───────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Images</h2>
          <div className="flex flex-wrap gap-4">
            {images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700 group">
                <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-zinc-900/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3 text-rose-400" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 rounded-lg border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />
              ) : (
                <>
                  <Upload className="h-5 w-5 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 mt-1">Upload</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* ── Attributes (Dynamic) ─────────────────────────────────── */}
        {attributeDefs.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Attributes</h2>
            <div className="space-y-6">
              {attributeDefs.map(attr => (
                <div key={attr.id} className="space-y-3">
                  <Label className="text-zinc-300 text-sm font-medium">{attr.name}</Label>

                  {attr.type === "text" ? (
                    <Input
                      value={(selectedAttributes[attr.id] as string) || ""}
                      onChange={e => handleTextAttribute(attr.id, e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white focus-visible:ring-zinc-600"
                      placeholder={`Enter ${attr.name.toLowerCase()}...`}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {attr.options.map(opt => {
                        const isSelected = ((selectedAttributes[attr.id] as string[]) || []).includes(opt.id)
                        return (
                          <div key={opt.id} className="flex items-center gap-2">
                            <Checkbox
                              id={`attr-${attr.id}-${opt.id}`}
                              checked={isSelected}
                              onCheckedChange={() => handleOptionToggle(attr.id, opt.id)}
                              className="border-zinc-600 data-[state=checked]:bg-white data-[state=checked]:text-zinc-900"
                            />
                            <label htmlFor={`attr-${attr.id}-${opt.id}`} className="text-sm text-zinc-300 cursor-pointer flex items-center gap-2">
                              {attr.type === "color" && opt.hex_code && (
                                <span className="w-4 h-4 rounded-full border border-zinc-600" style={{ backgroundColor: opt.hex_code }} />
                              )}
                              {opt.value}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Flags ────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Visibility</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Featured Product</Label>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Best Seller</Label>
              <Switch checked={isBestSeller} onCheckedChange={setIsBestSeller} />
            </div>
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving} className="bg-white text-zinc-900 hover:bg-zinc-200 font-medium gap-2 min-w-[120px]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
