"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, use, useRef } from "react"
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
import { Badge } from "@/components/ui/badge"
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
  is_variant: boolean
  options: AttributeOption[]
}

interface Variant {
  id: string
  sku: string
  price: string
  original_price: string
  stock_count: string
  options: { attribute_id: string; option_id: string; attribute_name: string; option_value: string }[]
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

  // 1. Fetch reference data
  const { data: catResponse, isLoading: isCatLoading } = useSWR("/api/categories?all=true&includeSubcategories=true", fetcher)
  const { data: attrResponse, isLoading: isAttrLoading } = useSWR("/api/attributes", fetcher)

  // 2. Fetch existing product data
  const { data: productResponse, isLoading: isProductLoading, error: productError } = useSWR(
    currentSlug ? `/api/products/${currentSlug}` : null,
    fetcher
  )



  const categories: Category[] = catResponse?.data || []
  const attributeDefs: AttributeDefinition[] = attrResponse?.data || []

  // ── Form State ────────────────────────────────────────────────────
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [subcategoryId, setSubcategoryId] = useState<string | undefined>(undefined)
  const [stockCount, setStockCount] = useState("0")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [images, setImages] = useState<string[]>([])
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[] | string>>({})
  const [variants, setVariants] = useState<Variant[]>([])

  const hasInitialized = useRef(false)

  // 3. Initialize form when product data arrives
  useEffect(() => {
    const p = productResponse?.data
    const defs = attrResponse?.data
    const cats = catResponse?.data

    if (p && defs && cats && !hasInitialized.current) {

      setTitle(p.title || "")
      setSlug(p.slug || "")
      setDescription(p.description || "")
      setPrice(p.price?.toString() || "")
      setOriginalPrice(p.original_price?.toString() || "")
      setStatus(
        p.status ? p.status.toLowerCase() as "draft" | "published" : "draft"
      )
      // Ensure category IDs are strings for the Select component
      setCategoryId(p.category_id ? p.category_id.toString() : undefined)
      setSubcategoryId(p.subcategory_id ? p.subcategory_id.toString() : undefined)

      setStockCount(p.stock_count?.toString() || "0")
      setImages(p.images || [])

      // Process attributes
      const attrs: Record<string, string[] | string> = {}
      if (p.attributes) {
        Object.values(p.attributes).forEach((attr: any) => {
          if (attr.type === 'text') {
            attrs[attr.id] = attr.values[0] || ""
          } else {
            // Ensure we use the option IDs as strings
            attrs[attr.id] = attr.values.map((v: any) => v.id?.toString())
          }
        })
      }
      setSelectedAttributes(attrs)

      // Process variants
      if (p.variants && Array.isArray(p.variants) && p.variants.length > 0) {
        const mappedVariants: Variant[] = p.variants.map((v: any) => {
          const processedOptions = Object.entries(v.options || {}).map(([attrSlug, optData]: [string, any]) => {
            const def = (defs as AttributeDefinition[]).find(d => d.slug === attrSlug)

            return {
              attribute_id: optData.attribute_id || def?.id || "",
              attribute_name: def?.name || attrSlug,
              option_id: optData.option_id || "",
              option_value: optData.value?.toString() || "Unknown"
            }
          })

          return {
            id: v.id,
            sku: v.sku || "",
            price: v.price?.toString() || "",
            original_price: v.original_price?.toString() || "",
            stock_count: v.stock_count?.toString() || "0",
            options: processedOptions
          }
        })

        setVariants(mappedVariants)
      }
      hasInitialized.current = true
    }
  }, [productResponse, attrResponse, catResponse])



  const selectedCategory = categories.find(c => c.id.toString() === categoryId?.toString())
  const subcategories = selectedCategory?.subcategories || []
  const categoryName = selectedCategory?.name
  const subcategoryName = subcategories.find(s => s.id.toString() === subcategoryId?.toString())?.name

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

  // ── Variant Handlers ──────────────────────────────────────────────
  const generateVariants = () => {
    const variantAttributes = attributeDefs.filter(def =>
      def.is_variant &&
      Array.isArray(selectedAttributes[def.id]) &&
      (selectedAttributes[def.id] as string[]).length > 0
    )

    if (variantAttributes.length === 0) {
      toast({
        title: "No variant attributes selected",
        description: "Please select options for at least one attribute marked as a variant.",
        variant: "destructive"
      })
      return
    }

    const sets = variantAttributes.map(attr => {
      const selectedOptionIds = selectedAttributes[attr.id] as string[]
      return selectedOptionIds.map(optId => {
        const opt = attr.options.find(o => o.id === optId)
        return {
          attribute_id: attr.id,
          attribute_name: attr.name,
          attribute_slug: attr.slug,
          option_id: optId,
          option_value: opt?.value || "Unknown"
        }
      })
    })

    const cartesian = (args: any[]) => {
      let r: any[] = [], max = args.length - 1;
      function helper(arr: any[], i: number) {
        for (let j = 0, l = args[i].length; j < l; j++) {
          let a = arr.slice(0);
          a.push(args[i][j]);
          if (i === max) r.push(a);
          else helper(a, i + 1);
        }
      }
      helper([], 0);
      return r;
    }

    const combinations = cartesian(sets)

    const newVariants: Variant[] = combinations.map((combo, idx) => {
      // Create a unique key for the current combination to check against existing variants
      const comboKey = combo.map((c: any) => c.option_id).sort().join(',')

      const existing = variants.find(v => {
        const vKey = v.options.map(o => o.option_id).sort().join(',')
        return vKey === comboKey
      })

      if (existing) return existing

      return {
        id: `temp-${Date.now()}-${idx}`,
        sku: `${slug}-${combo.map((c: any) => c.option_value.toLowerCase()).join('-')}`,
        price: price || "",
        original_price: originalPrice || "",
        stock_count: stockCount || "0",
        options: combo
      }
    })

    setVariants(newVariants)
    toast({ title: "Variants generated", description: `Updated variants list (${newVariants.length} total).` })
  }

  const updateVariant = (id: string, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // 1. Attributes
      const attrRows = Object.entries(selectedAttributes).flatMap(([attrId, value]) => {
        const def = attributeDefs.find(d => d.id === attrId)
        if (!def) return []
        if (def.type === 'text' && typeof value === 'string' && value.trim()) {
          return [{ attribute_id: attrId, text_value: value.trim() }] as any[]
        } else if (Array.isArray(value)) {
          return value.map(optId => ({ attribute_id: attrId, option_id: optId }))
        }
        return []
      })

      // 2. Variants
      const variantPayload = variants.map(v => ({
        sku: v.sku || null,
        price: v.price ? Number(v.price) : null,
        original_price: v.original_price ? Number(v.original_price) : null,
        stock_count: Number(v.stock_count),
        options: v.options.map(opt => ({
          attribute_id: opt.attribute_id,
          option_id: opt.option_id
        }))
      }))

      const productPayload = {
        title,
        slug,
        description,
        price: Number(price),
        original_price: originalPrice ? Number(originalPrice) : null,
        category_id: categoryId || null,
        subcategory_id: subcategoryId || null,
        stock_count: Number(stockCount),
        status,
        images,
        attributes: attrRows,
        variants: variantPayload
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

      toast({ title: "Product updated", description: "All changes and variants saved." })
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

  if (productError || (productResponse && !productResponse.data && !isProductLoading)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 bg-zinc-950 px-4 text-center rounded-2xl border border-zinc-900">
        <h2 className="text-2xl font-bold text-white tracking-tight">This piece seems to have drifted away.</h2>
        <p className="text-zinc-500 max-w-md text-sm">We couldn't find the product you're looking for. It may have been relocated or removed from our collection.</p>
        <Link href="/admin/products">
          <Button className="rounded-full px-8 py-2 bg-white text-zinc-900 font-bold hover:bg-zinc-200">Return to Catalog</Button>
        </Link>
      </div>
    )
  }

  if (isProductLoading || isCatLoading || isAttrLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-medium tracking-widest uppercase">Curating Experience...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
            <div className="space-y-2">
              <Label className="text-zinc-300">Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as "draft" | "published")}>                <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Base Price (₹)</Label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Original Price (₹)</Label>
              <Input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Default Stock</Label>
              <Input type="number" value={stockCount} onChange={e => setStockCount(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" />
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 className="text-lg font-semibold text-white">Category</h2>
            {categoryName && <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">{categoryName} {subcategoryName ? `/ ${subcategoryName}` : ''}</Badge>}
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">Category</Label>
              <Select
                value={categoryId}
                onValueChange={(val) => {
                  if (!val) return // 🚫 block empty reset
                  setCategoryId(val)
                  setSubcategoryId(undefined)
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="rounded-lg focus:bg-zinc-900 focus:text-white">
                        {cat.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-zinc-500">No categories found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label className="text-zinc-300">Subcategory</Label>
                <Select
                  value={subcategoryId?.toString() || undefined}
                  onValueChange={setSubcategoryId}
                >
                  <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl shadow-black/40">
                    {subcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id.toString()} className="rounded-lg focus:bg-zinc-900 focus:text-white">
                        {sub.name}
                      </SelectItem>
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
              <div key={i} className={`relative w-32 h-32 rounded-xl overflow-hidden border transition-all duration-300 group bg-zinc-950 ${i === 0 ? 'border-zinc-100 ring-2 ring-zinc-100/20 shadow-lg shadow-black/50' : 'border-zinc-800'
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
                  <div className="flex items-center gap-2">
                    <Label className="text-zinc-300">{attr.name}</Label>
                    {attr.is_variant && <Badge variant="outline" className="text-[9px] uppercase border-zinc-700 text-zinc-500">Variant Attribute</Badge>}
                  </div>
                  {attr.type === "text" ? (
                    <Input value={(selectedAttributes[attr.id] as string) || ""} onChange={e => handleTextAttribute(attr.id, e.target.value)} className="bg-zinc-950 border-zinc-800" />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {attr.options.map(opt => (
                        <div key={opt.id} className="flex items-center gap-2 bg-zinc-950/50 px-3 py-2 rounded-lg border border-zinc-800">
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
            <div className="pt-4 border-t border-zinc-800 flex justify-center">
              <Button type="button" onClick={generateVariants} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white font-bold uppercase tracking-widest text-[10px] h-11 px-8 rounded-full">
                Sync Product Variations
              </Button>
            </div>
          </div>
        )}

        {variants.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-semibold text-white">Product Variations</h2>
              <span className="text-xs text-zinc-500">{variants.length} variations active</span>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {variants.map((v) => (
                <div key={v.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 relative group">
                  <button type="button" onClick={() => removeVariant(v.id)} className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex flex-wrap items-center gap-2">
                    {v.options.map((opt, i) => (
                      <Badge key={i} className="bg-zinc-800 text-zinc-300 border-zinc-700 font-mono text-[9px] uppercase tracking-tighter">
                        <span className="text-zinc-500 mr-1">{opt.attribute_name}:</span> {opt.option_value}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">SKU</Label>
                      <Input value={v.sku} onChange={(e) => updateVariant(v.id, 'sku', e.target.value)} className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Price (₹)</Label>
                      <Input type="number" value={v.price} onChange={(e) => updateVariant(v.id, 'price', e.target.value)} className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Orig. Price</Label>
                      <Input type="number" value={v.original_price} onChange={(e) => updateVariant(v.id, 'original_price', e.target.value)} className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Stock</Label>
                      <Input type="number" value={v.stock_count} onChange={(e) => updateVariant(v.id, 'stock_count', e.target.value)} className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


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
