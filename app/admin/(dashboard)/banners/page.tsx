"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import useSWR, { mutate } from "swr"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MonitorPlay,
  Loader2,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react"
import { 
  AdminPageHeader, 
  AdminDataTable, 
  AdminDeleteDialog,
  AdminImageUploader,
  StatusBadge
} from "@/components/admin"
import { Button } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { BannerRow } from "@/types"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface BannersResponse {
  data: BannerRow[]
}

const columns = [
  { key: "banner", label: "Banner" },
  { key: "order", label: "Order" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", className: "text-right" },
]

export default function AdminBannersPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<BannerRow | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form State
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [displayOrder, setDisplayOrder] = useState("0")
  const [isActive, setIsActive] = useState(true)

  const { data, isLoading } = useSWR<BannersResponse>("/api/banners?all=true", fetcher)
  const banners = data?.data || []

  const resetForm = () => {
    setTitle("")
    setSubtitle("")
    setImageUrl("")
    setLinkUrl("")
    setDisplayOrder("0")
    setIsActive(true)
    setSelectedBanner(null)
  }

  const handleEdit = (banner: BannerRow) => {
    setSelectedBanner(banner)
    setTitle(banner.title)
    setSubtitle(banner.subtitle || "")
    setImageUrl(banner.image_url)
    setLinkUrl(banner.link_url || "")
    setDisplayOrder(banner.display_order.toString())
    setIsActive(banner.is_active)
    setIsDialogOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageUrl) {
      toast({ title: "Error", description: "Image is required", variant: "destructive" })
      return
    }

    setIsSaving(true)
    const payload = {
      title,
      subtitle,
      image_url: imageUrl,
      link_url: linkUrl,
      display_order: parseInt(displayOrder) || 0,
      is_active: isActive
    }

    try {
      const url = selectedBanner ? `/api/banners/${selectedBanner.id}` : "/api/banners"
      const method = selectedBanner ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save banner")

      toast({ title: "Success", description: `Banner ${selectedBanner ? "updated" : "created"} successfully` })
      setIsDialogOpen(false)
      resetForm()
      mutate("/api/banners?all=true")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(true)
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/banners/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete banner")

      toast({ title: "Success", description: "Banner deleted successfully" })
      setDeleteId(null)
      mutate("/api/banners?all=true")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Banners" 
        subtitle="Manage promotional banners and hero slides"
        actionLabel="Add Banner"
        actionOnClick={() => { resetForm(); setIsDialogOpen(true); }}
      />

      <AdminDataTable
        columns={columns}
        data={banners}
        isLoading={isLoading}
        emptyIcon={<MonitorPlay className="h-8 w-8 opacity-50" />}
        emptyMessage="No banners found."
        keyExtractor={(b) => b.id}
        renderRow={(banner) => (
          <>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-10 w-20 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{banner.title}</p>
                  <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">{banner.subtitle}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-zinc-300">{banner.display_order}</TableCell>
            <TableCell>
              <StatusBadge 
                label={banner.is_active ? "Active" : "Inactive"} 
                variant={banner.is_active ? "success" : "danger"} 
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEdit(banner)}
                  className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setDeleteId(banner.id)}
                  className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </>
        )}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBanner ? "Edit Banner" : "New Banner"}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Fill in the details for the promotional banner.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <AdminImageUploader 
                    value={imageUrl} 
                    onChange={setImageUrl} 
                    folder="banners"
                    className="aspect-[16/9] max-w-full"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                  <Label className="text-zinc-300 cursor-pointer">Active Status</Label>
                  <Switch checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. Summer Collection" 
                    required
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input 
                    value={subtitle} 
                    onChange={e => setSubtitle(e.target.value)} 
                    placeholder="e.g. Up to 50% OFF" 
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input 
                    value={linkUrl} 
                    onChange={e => setLinkUrl(e.target.value)} 
                    placeholder="e.g. /products/summer" 
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                    <Label>Display Order</Label>
                    <Input 
                      type="number" 
                      value={displayOrder} 
                      onChange={e => setDisplayOrder(e.target.value)} 
                      className="bg-zinc-950 border-zinc-800"
                    />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-zinc-800">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-zinc-400">
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="bg-white text-zinc-900 hover:bg-zinc-200 min-w-[120px]">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AdminDeleteDialog 
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
      />
    </div>
  )
}
