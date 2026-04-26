"use client"

export const dynamic = 'force-dynamic'


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

export default function AdminProductNewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch categories and attributes for the form selectors
  const { data: catResponse, isLoading: isCatLoading } = useSWR("/api/categories?all=true&includeSubcategories=true", fetcher)
  const { data: attrResponse, isLoading: isAttrLoading } = useSWR("/api/attributes", fetcher)

  const categories: Category[] = catResponse?.data || []
  const attributeDefs: AttributeDefinition[] = attrResponse?.data || []

  // ── Form State ────────────────────────────────────────────────────
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [stockCount, setStockCount] = useState("0")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [images, setImages] = useState<string[]>([])

  // Dynamic attributes: { [attribute_id]: option_id[] | text_value }
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[] | string>>({})
  
  // Variants State
  const [variants, setVariants] = useState<Variant[]>([])

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

  // Derived state
  const selectedCategory = categories.find(c => c.id === categoryId)
  const subcategories = selectedCategory?.subcategories || []
  const categoryName = selectedCategory?.name
  const subcategoryName = subcategories.find(s => s.id === subcategoryId)?.name

  // ── Variant Generation Logic ──────────────────────────────────────
  const generateVariants = () => {
    // 1. Find all attributes that are marked as 'is_variant' AND have options selected
    const variantAttributes = attributeDefs.filter(def => 
      def.is_variant && 
      Array.isArray(selectedAttributes[def.id]) && 
      (selectedAttributes[def.id] as string[]).length > 0
    )

    if (variantAttributes.length === 0) {
      toast({
        title: "No variant attributes selected",
        description: "Please select options for at least one attribute marked as a variant (e.g., Color, Size).",
        variant: "destructive"
      })
      return
    }

    // 2. Prepare the sets for Cartesian product
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

    // 3. Cartesian Product function
    const cartesian = (args: any[]) => {
      if (!args.length) return [];
      let r: any[] = [], max = args.length - 1;
      function helper(arr: any[], i: number) {
        if (!args[i]) return;
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

    // 4. Transform combinations into Variant objects
    const newVariants: Variant[] = combinations.map((combo, idx) => {
      const comboKey = combo.map((c: any) => c.option_id).sort().join(',')
      const existing = variants.find(v => v.options.map(o => o.option_id).sort().join(',') === comboKey)
      if (existing) return existing

      const variantSlug = combo.map((c: any) => c.option_value.toString().toLowerCase().replace(/\s+/g, '-')).join('-')

      return {
        id: `temp-${Date.now()}-${idx}`,
        sku: slug ? `${slug}-${variantSlug}` : variantSlug,
        price: price || "0",
        original_price: originalPrice || "0",
        stock_count: stockCount || "0",
        options: combo
      }
    })

    setVariants(newVariants)
    toast({ title: "Variants generated", description: `Synchronized ${newVariants.length} possible variations.` })
  }

  const updateVariant = (id: string, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(v => v.id !== id))
  }

  if (isCatLoading || isAttrLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-medium tracking-widest uppercase text-center">Loading Reference Data...</p>
      </div>
    )
  }

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

  const makeMainImage = (index: number) => {
    setImages(prev => {
      const newImages = [...prev]
      const [item] = newImages.splice(index, 1)
      newImages.unshift(item)
      return newImages
    })
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
      // 1. Link attributes rows
      const attrRows: Array<{ attribute_id: string; option_id?: string; text_value?: string }> = []

      for (const [attrId, value] of Object.entries(selectedAttributes)) {
        const def = attributeDefs.find(d => d.id === attrId)
        if (!def) continue

        if (def.type === "text" && typeof value === "string" && value.trim()) {
          attrRows.push({
            attribute_id: attrId,
            text_value: value.trim(),
          })
        } else if (Array.isArray(value)) {
          for (const optionId of value) {
            attrRows.push({
              attribute_id: attrId,
              option_id: optionId,
            })
          }
        }
      }

      // 2. Format variants for API
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

      // 3. Build the full product payload
      const fullPayload = {
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

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullPayload),
      })

      const result = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: result.error?.includes("already exists") ? "Duplicate product" : "Product create failed",
          description: result.error || "Failed to create product.",
        })
        return
      }

      toast({
        title: "Product created",
        description: "The product and its variants were created successfully.",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        variant: "destructive",
        title: "Product create failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">New Product</h1>
          <p className="text-zinc-400 text-sm mt-1">Create a new product with variants</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ... (Basic Info, Pricing, Category, Images sections remain same or similar) ... */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="e.g., Midnight Kanjivaram Saree" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Slug</Label>
              <Input value={slug} onChange={e => setSlug(e.target.value)} required
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="midnight-kanjivaram-saree" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-zinc-300">Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                className="min-h-[120px] rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="Product description..." />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Status</Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100">
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
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="2999" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Original Price (₹)</Label>
              <Input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="4999" />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Default Stock</Label>
              <Input type="number" value={stockCount} onChange={e => setStockCount(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60" placeholder="50" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-600">These values will be used as defaults for all generated variants unless overridden.</p>
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
                value={categoryId || undefined} 
                onValueChange={(val) => { 
                  setCategoryId(val); 
                  setSubcategoryId(""); 
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
                  value={subcategoryId || undefined} 
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
            <span className="text-xs text-zinc-500">{images.length} images uploaded</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {images.map((url, i) => (
              <div key={i} className={`relative w-32 h-32 rounded-xl overflow-hidden border transition-all duration-300 group bg-zinc-950 ${
                i === 0 ? 'border-zinc-100 ring-2 ring-zinc-100/20 shadow-lg shadow-black/50' : 'border-zinc-800'
              }`}>
                <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                
                {i === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white text-zinc-900 text-[9px] font-bold rounded-md z-10 shadow-sm">
                    MAIN
                  </div>
                )}

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  {i !== 0 && (
                    <button type="button" onClick={() => makeMainImage(i)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
                      title="Make Main">
                      <Star className="h-4 w-4 fill-white/20" />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(i)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 rounded-full text-rose-400 transition-all hover:scale-110"
                    title="Remove">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <label className="w-32 h-32 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950/50 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-5 w-5 text-zinc-500 animate-spin" />
                  <span className="text-[10px] text-zinc-500 font-medium">Uploading...</span>
                </div>
              ) : (
                <>
                  <div className="p-2 bg-zinc-900 rounded-full mb-1 group-hover:scale-110 transition-transform">
                    <Upload className="h-5 w-5 text-zinc-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">Click to upload</span>
                </>
              )}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* ── Attributes ── */}
        {attributeDefs.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white border-b border-zinc-800 pb-3">Attributes</h2>
            <div className="space-y-6">
              {attributeDefs.map(attr => (
                <div key={attr.id} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-zinc-300 text-sm font-medium">{attr.name}</Label>
                    {attr.is_variant && <Badge variant="outline" className="text-[9px] uppercase border-zinc-700 text-zinc-500">Variant Attribute</Badge>}
                  </div>

                  {attr.type === "text" ? (
                    <Input
                      value={(selectedAttributes[attr.id] as string) || ""}
                      onChange={e => handleTextAttribute(attr.id, e.target.value)}
                      className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60"
                      placeholder={`Enter ${attr.name.toLowerCase()}...`}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {attr.options.map(opt => {
                        const isSelected = ((selectedAttributes[attr.id] as string[]) || []).includes(opt.id)
                        return (
                          <div key={opt.id} className="flex items-center gap-2 bg-zinc-950/50 px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
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

            <div className="pt-4 border-t border-zinc-800 flex justify-center">
              <Button 
                type="button" 
                onClick={generateVariants}
                variant="outline"
                className="bg-accent/10 border-accent/20 text-accent hover:bg-accent/20 hover:text-accent font-bold uppercase tracking-widest text-[10px] h-11 px-8 rounded-full transition-all"
              >
                Generate Product Variants
              </Button>
            </div>
          </div>
        )}

        {/* ── Variants Section ── */}
        {variants.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-lg font-semibold text-white">Generated Variants</h2>
              <span className="text-xs text-zinc-500">{variants.length} variations</span>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {variants.map((v) => (
                <div key={v.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 relative group">
                  <button 
                    type="button" 
                    onClick={() => removeVariant(v.id)}
                    className="absolute top-2 right-2 p-1 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
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
                      <Input 
                        value={v.sku} 
                        onChange={(e) => updateVariant(v.id, 'sku', e.target.value)}
                        className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Price (₹)</Label>
                      <Input 
                        type="number"
                        value={v.price} 
                        onChange={(e) => updateVariant(v.id, 'price', e.target.value)}
                        className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Orig. Price</Label>
                      <Input 
                        type="number"
                        value={v.original_price} 
                        onChange={(e) => updateVariant(v.id, 'original_price', e.target.value)}
                        className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Stock</Label>
                      <Input 
                        type="number"
                        value={v.stock_count} 
                        onChange={(e) => updateVariant(v.id, 'stock_count', e.target.value)}
                        className="h-9 rounded-lg border-zinc-800 bg-zinc-950 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


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
