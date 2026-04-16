"use client"

import { useState } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, Loader2, Plus, Home, Briefcase, MapPin } from "lucide-react"
import { useEffect, useCallback } from "react"

import { UserProfile, UserAddress } from "@/types"

export default function AddressesTab({ dbUser }: { dbUser: UserProfile | null }) {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<UserAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editAddressId, setEditAddressId] = useState<string | null>(null)
  const [isAddMode, setIsAddMode] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const emptyAddress: Omit<UserAddress, 'id' | 'user_id'> = {
    title: "",
    first_name: dbUser?.first_name || "",
    last_name: dbUser?.last_name || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: dbUser?.phone || "",
    is_default: false
  }

  const [formData, setFormData] = useState<Omit<UserAddress, 'id' | 'user_id'>>(emptyAddress)

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/users/addresses')
      if (!res.ok) throw new Error('Failed to fetch addresses')
      const { data } = await res.json()
      setAddresses(data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleOpenEdit = (addr: UserAddress) => {
    setFormData({
      title: addr.title,
      first_name: addr.first_name,
      last_name: addr.last_name,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      is_default: addr.is_default
    })
    setEditAddressId(addr.id)
  }

  const handleOpenAdd = () => {
    setFormData(emptyAddress)
    setIsAddMode(true)
  }

  const handleSaveAddress = async () => {
    setIsSaving(true)
    try {
      const isEditing = !!editAddressId
      const url = isEditing ? `/api/users/addresses?id=${editAddressId}` : '/api/users/addresses'
      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save address')
      }

      toast({
        title: isEditing ? "Address Updated" : "Address Added",
        description: "Your delivery information has been updated."
      })
      
      setEditAddressId(null)
      setIsAddMode(false)
      fetchAddresses()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process request"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const confirmDeleteAddress = (id: string) => {
    setAddressToDelete(id)
  }

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return
    setIsDeleting(true)

    try {
      const res = await fetch(`/api/users/addresses?id=${addressToDelete}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast({ title: "Address Deleted" })
      fetchAddresses()
    } catch (error) {
      toast({ variant: "destructive", title: "Delete Failed" })
    } finally {
      setIsDeleting(false)
      setAddressToDelete(null)
    }
  }

  return (
    <TabsContent value="addresses" className="mt-0 outline-none animate-in fade-in duration-500">
      <div className="border border-primary/20 rounded-xl bg-white p-8 lg:p-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-primary/10 pb-4 mb-8 gap-4">
          <h3 className="text-[14px] font-heading font-bold uppercase tracking-[0.25em] text-primary">Saved Addresses</h3>
          <Button
            onClick={handleOpenAdd}
            className="rounded-full bg-accent text-white hover:bg-accent/90 shadow-md uppercase tracking-[0.25em] text-[10px] font-bold h-11 px-8 transition-colors duration-300 gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Address
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary/30" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-primary/10 rounded-3xl bg-primary/5">
            <MapPin className="w-10 h-10 text-primary/20 mx-auto mb-4" />
            <p className="text-[12px] font-sans font-medium text-primary/60 tracking-widest uppercase">No saved addresses found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div key={addr.id} className="border border-primary/10 rounded-xl p-6 relative group hover:border-accent/30 transition-colors duration-300 shadow-sm">
                {addr.is_default && (
                  <span className="absolute top-6 right-6 text-[8px] font-sans font-extrabold uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-1 rounded-sm">Default</span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  {addr.title.toLowerCase() === 'home' ? <Home className="w-3 h-3 text-primary/40" /> : addr.title.toLowerCase() === 'office' ? <Briefcase className="w-3 h-3 text-primary/40" /> : <MapPin className="w-3 h-3 text-primary/40" />}
                  <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-primary/60">{addr.title}</p>
                </div>
                <h4 className="font-heading font-normal text-lg tracking-tight text-primary">{addr.first_name} {addr.last_name}</h4>
                <div className="text-[12px] font-medium text-primary/80 mt-4 leading-relaxed font-sans">
                  <p>{addr.address}</p>
                  <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="mt-2">Phone: {addr.phone}</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(addr)}
                    className="rounded-full flex-1 border-primary/20 text-[10px] uppercase font-bold tracking-widest text-primary hover:border-accent hover:bg-accent/5 hover:text-accent transition-all h-9"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmDeleteAddress(addr.id)}
                    className="rounded-full w-9 h-9 p-0 border-primary/20 text-accent hover:bg-accent/5 hover:border-accent hover:text-accent transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!editAddressId || isAddMode} onOpenChange={(open) => {
        if (!open) {
          setEditAddressId(null)
          setIsAddMode(false)
        }
      }}>
        <DialogContent className="sm:max-w-2xl rounded-2xl border-primary/10 p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-primary/5">
            <DialogHeader className="space-y-4">
              <DialogTitle className="font-heading text-3xl font-normal tracking-tight text-accent">{editAddressId ? 'Edit Delivery Address' : 'Add New Address'}</DialogTitle>
              <DialogDescription className="font-sans font-medium tracking-wide text-primary/60 text-[13px] leading-relaxed">
                {editAddressId ? 'Update your location details below.' : 'Add a new location for your deliveries.'} We'll ensure your future orders arrive right here.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-8 px-8 py-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Title (e.g., Home, Office)</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Home"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Phone Number</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">First Name</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Isabella"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Last Name</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Sharma"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Full Street Address</Label>
              <Input
                className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Apt 4B, 120 Brigade Road"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">City</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Bangalore"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">State</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Karnataka"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">Pincode</Label>
                <Input
                  className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="560001"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-6 pb-2 border-t border-primary/5">
              <Checkbox
                id="default-address"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData({ ...formData, is_default: !!checked })}
                className="rounded-sm border-primary/20 data-[state=checked]:bg-accent data-[state=checked]:text-white w-4 h-4 ml-1"
              />
              <Label htmlFor="default-address" className="text-[11px] font-sans font-bold uppercase tracking-[0.1em] text-accent cursor-pointer pt-0.5">Set as default delivery address</Label>
            </div>
          </div>

          <div className="bg-primary/5 px-8 flex justify-end gap-4 py-5 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditAddressId(null)}
              className="rounded-full w-full sm:w-auto h-12 px-10 border-primary/20 text-primary text-[10px] tracking-[0.25em] hover:text-accent hover:border-accent hover:bg-accent/5 uppercase font-bold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveAddress}
              disabled={isSaving}
              className="rounded-full w-full sm:w-auto bg-accent text-white hover:bg-accent/90 h-12 px-10 text-[10px] tracking-[0.25em] uppercase font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {editAddressId ? 'Save Details' : 'Add Address'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addressToDelete} onOpenChange={(open) => {
        if (!open) setAddressToDelete(null)
      }}>
        <DialogContent className="sm:max-w-md rounded-2xl border-primary/10 p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-primary/5">
            <DialogHeader className="space-y-4">
              <DialogTitle className="font-heading text-2xl font-normal tracking-tight text-accent">Delete Address</DialogTitle>
              <DialogDescription className="font-sans font-medium tracking-wide text-primary/60 text-[13px] leading-relaxed">
                Are you sure you want to delete this address? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="bg-primary/5 px-8 flex justify-end gap-4 py-5 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddressToDelete(null)}
              className="rounded-full w-full sm:w-auto h-11 px-8 border-primary/20 text-primary text-[10px] tracking-[0.25em] hover:text-accent hover:border-accent hover:bg-accent/5 uppercase font-bold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteAddress}
              disabled={isDeleting}
              className="rounded-full w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90 h-11 px-8 text-[10px] tracking-[0.25em] uppercase font-bold shadow-md hover:shadow-lg transition-all"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  )
}
