"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
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
import { ArrowLeft, Upload, X, Loader2, Star } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

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

export default function AdminProductEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const resolvedParams = use(params)
  const currentSlug = resolvedParams.slug

  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // 1. Fetch reference data (categories/attributes)
  const { data: catResponse } = useSWR("/api/categories?all=true&includeSubcategories=true", fetcher)
  const { data: attrResponse } = useSWR("/api/attributes", fetcher)
  const categories: Category[] = catResponse?.data || []
  const attributeDefs: AttributeDefinition[] = attrResponse?.data || []

  // 2. Fetch existing product data
  const { data: productResponse, isLoading: isProductLoading } = useSWR(
    currentSlug ? `/api/products/${currentSlug}` : null,
    fetcher
  )

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
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[] | string>>({})

  // 3. Initialize form when product data arrives
  useEffect(() => {
    if (productResponse?.data) {
      const p = productResponse.data
      setTitle(p.title || "")
      setSlug(p.slug || "")
      setDescription(p.description || "")
      setPrice(p.price?.toString() || "")
      setOriginalPrice(p.original_price?.toString() || "")
      setDiscount(p.discount?.toString() || "")
      setCategoryId(p.category_id || "")
      setSubcategoryId(p.subcategory_id || "")
      setStockCount(p.stock_count?.toString() || "0")
      setIsFeatured(p.is_featured || false)
      setIsBestSeller(p.is_best_seller || false)
      setImages(p.images || [])

      // Process attributes
      const attrs: Record<string, string[] | string> = {}
      if (p.attributes) {
         Object.values(p.attributes).forEach((attr: any) => {
            if (attr.type === 'text') {
              attrs[attr.id] = attr.values[0] || ""
            } else {
              attrs[attr.id] = attr.values.map((v: any) => v.id)
            }
         })
      }
      setSelectedAttributes(attrs)
    }
  }, [productResponse])

  // Get subcategories for the selected category
  const selectedCategory = categories.find(c => c.id === categoryId)
  const subcategories = selectedCategory?.subcategories || []

  // ── Handlers ──────────────────────────────────────────────────────
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("folder", "products")
        const res = await fetch("/api/upload", { method: "POST", body: formData })
        if (!res.ok) continue
        const data = await res.json()
        if (data.data?.url) setImages(prev => [...prev, data.data.url])
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const makeMainImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [item] = newImages.splice(index, 1)
      newImages.unshift(item)
      return newImages
    })
  }

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index))

  const handleOptionToggle = (attrId: string, optionId: string) => {
    setSelectedAttributes(prev => {
      const current = (prev[attrId] as string[]) || []
      return current.includes(optionId) 
        ? { ...prev, [attrId]: current.filter(id => id !== optionId) }
        : { ...prev, [attrId]: [...current, optionId] }
    })
  }

  const handleTextAttribute = (attrId: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [attrId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
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
        // Flatten attributes for the PUT endpoint
        attributes: Object.entries(selectedAttributes).flatMap(([attrId, value]) => {
          const def = attributeDefs.find(d => d.id === attrId)
          if (!def) return []
          if (def.type === 'text' && typeof value === 'string' && value.trim()) {
            return [{ attribute_id: attrId, text_value: value.trim() }] as any[]
          } else if (Array.isArray(value)) {
            return value.map(optId => ({ attribute_id: attrId, option_id: optId }))
          }
          return []
        })
      }

      const res = await fetch(`/api/products/${currentSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      })

      const result = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error || "Failed to update product.",
        })
        return
      }

      toast({ title: "Product updated", description: "All changes saved successfully." })
      mutate(`/api/products/${currentSlug}`)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isProductLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-medium tracking-widest uppercase">Fetching Piece Details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Edit Product</h1>
          <p className="text-zinc-400 text-sm mt-1">{title || "Loading..."}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                className="min-h-[120px] rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Price (₹)</Label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Original Price (₹)</Label>
              <Input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Discount %</Label>
              <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Stock Count</Label>
              <Input type="number" value={stockCount} onChange={e => setStockCount(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Category</Label>
              <Select value={categoryId} onValueChange={(val) => { setCategoryId(val); setSubcategoryId("") }}>
                <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Subcategory</Label>
                <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                  <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                    {subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Images</h2>
            <span className="text-xs text-zinc-500">{images.length} images</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {images.map((url, i) => (
              <div key={i} className={`relative w-32 h-32 rounded-xl overflow-hidden border transition-all duration-300 group bg-zinc-950 ${
                i === 0 ? 'border-zinc-100 ring-2 ring-zinc-100/20 shadow-lg shadow-black/50' : 'border-zinc-800'
              }`}>
                <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                {i === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white text-zinc-900 text-[9px] font-bold rounded-md z-10">MAIN</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {i !== 0 && (
                    <button type="button" onClick={() => makeMainImage(i)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110">
                      <Star className="h-4 w-4 fill-white/20" />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)} className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-full text-rose-400 transition-all hover:scale-110">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <label className="w-32 h-32 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50 transition-all duration-300">
              {isUploading ? <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" /> : (
                <>
                  <Upload className="h-5 w-5 text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-medium">Add Image</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {attributeDefs.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Attributes</h2>
            <div className="space-y-6">
              {attributeDefs.map(attr => (
                <div key={attr.id} className="space-y-3">
                  <Label className="text-zinc-300">{attr.name}</Label>
                  {attr.type === "text" ? (
                    <Input value={(selectedAttributes[attr.id] as string) || ""} onChange={e => handleTextAttribute(attr.id, e.target.value)} className="bg-zinc-950 border-zinc-800" />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {attr.options.map(opt => (
                        <div key={opt.id} className="flex items-center gap-2">
                          <Checkbox id={`attr-${attr.id}-${opt.id}`} checked={((selectedAttributes[attr.id] as string[]) || []).includes(opt.id)} onCheckedChange={() => handleOptionToggle(attr.id, opt.id)} className="border-zinc-600" />
                          <label htmlFor={`attr-${attr.id}-${opt.id}`} className="text-sm text-zinc-300 cursor-pointer flex items-center gap-2">
                            {attr.type === "color" && opt.hex_code && (
                              <span className="w-4 h-4 rounded-full border border-zinc-600" style={{ backgroundColor: opt.hex_code }} />
                            )}
                            {opt.value}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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

        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSaving} className="bg-white text-zinc-900 hover:bg-zinc-200 font-medium min-w-[120px]">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
