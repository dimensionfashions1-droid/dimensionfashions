"use client"

import { useState } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"

import { UserProfile, UserAddress } from "@/types"

export default function AddressesTab({ dbUser }: { dbUser: UserProfile | null }) {
  const { toast } = useToast()
  const [editAddressId, setEditAddressId] = useState<string | null>(null)

  // Mock Addresses
  const mockAddresses: UserAddress[] = [
    {
      id: "add-1",
      title: "Home",
      first_name: dbUser?.first_name || "Isabella",
      last_name: dbUser?.last_name || "Sharma",
      address: "Apt 4B, 120 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      phone: dbUser?.phone || "+91 98765 43210",
      is_default: true,
      user_id: dbUser?.id || "user-123"
    }
  ]

  return (
    <TabsContent value="addresses" className="mt-0 outline-none animate-in fade-in duration-500">
      <div className="border border-primary/20 rounded-xl bg-white p-8 lg:p-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-primary/10 pb-4 mb-8 gap-4">
          <h3 className="text-[14px] font-heading font-bold uppercase tracking-[0.25em] text-primary">Saved Addresses</h3>
          <Button className="rounded-full bg-accent text-white hover:bg-accent/90 shadow-md uppercase tracking-[0.25em] text-[10px] font-bold h-11 px-8 transition-colors duration-300">
            Add New Address
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAddresses.map((addr) => (
            <div key={addr.id} className="border border-primary/10 rounded-xl p-6 relative group hover:border-accent/30 transition-colors duration-300 shadow-sm">
              {addr.is_default && (
                <span className="absolute top-6 right-6 text-[8px] font-sans font-extrabold uppercase tracking-[0.3em] bg-accent/10 text-accent px-2 py-1 rounded-sm">Default</span>
              )}
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-primary/60 mb-1">{addr.title}</p>
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
                  onClick={() => setEditAddressId(addr.id)}
                  className="rounded-full flex-1 border-primary/20 text-[10px] uppercase font-bold tracking-widest text-primary hover:border-accent hover:bg-accent/5 hover:text-accent transition-all h-9"
                >
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="rounded-full w-9 h-9 p-0 border-primary/20 text-accent hover:bg-accent/5 hover:border-accent hover:text-accent transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!editAddressId} onOpenChange={(open) => !open && setEditAddressId(null)}>
        <DialogContent className="sm:max-w-2xl rounded-2xl border-primary/10 p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-primary/5">
            <DialogHeader className="space-y-4">
              <DialogTitle className="font-heading text-3xl font-normal tracking-tight text-primary">Edit Delivery Address</DialogTitle>
              <DialogDescription className="font-sans font-medium tracking-wide text-primary/60 text-[13px] leading-relaxed">
                Update your location details below. We'll ensure your future orders arrive right here.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-8 px-8 py-6 max-h-[60vh] overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Title (e.g., Home, Office)</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.title} />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Phone Number</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.phone} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">First Name</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.first_name} />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">Last Name</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.last_name} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Full Street Address</Label>
              <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.address} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">City</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.city} />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">State</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.state} />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">Pincode</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={mockAddresses[0]?.pincode} />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-6 pb-2 border-t border-primary/5">
              <Checkbox id="default-address" defaultChecked={mockAddresses[0]?.is_default} className="rounded-sm border-primary/20 data-[state=checked]:bg-accent data-[state=checked]:text-white w-4 h-4 ml-1" />
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
              onClick={() => {
                toast({ title: "Address Updated", description: "Your mock address modifications were successfully saved." })
                setEditAddressId(null)
              }}
              className="rounded-full w-full sm:w-auto bg-accent text-white hover:bg-accent/90 h-12 px-10 text-[10px] tracking-[0.25em] uppercase font-bold shadow-md hover:shadow-lg transition-all"
            >
              Save Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  )
}
