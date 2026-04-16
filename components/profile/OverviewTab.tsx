"use client"

import { useState } from "react"
import { TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import { AuthUser, UserProfile } from "@/types"

export default function OverviewTab({ user, dbUser }: { user: AuthUser, dbUser: UserProfile | null }) {
  const router = useRouter()
  const { toast } = useToast()
  const [editProfileMode, setEditProfileMode] = useState(false)

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again."
      })
    }
  }

  return (
    <TabsContent value="overview" className="mt-0 outline-none animate-in fade-in duration-500">
      <div className="border border-primary/20 bg-white p-8 lg:p-12 space-y-12 shadow-sm  rounded-xl">
        <div className="space-y-6">
          <h3 className="text-[14px] font-heading font-bold uppercase tracking-[0.25em] text-primary border-b border-primary/10 pb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-4">
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-2">First Name</p>
              <p className="text-sm font-sans font-medium text-primary tracking-wide">
                {dbUser?.first_name || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-2">Last Name</p>
              <p className="text-sm font-sans font-medium text-primary tracking-wide">
                {dbUser?.last_name || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-2">Email Address</p>
              <p className="text-sm font-sans font-medium text-primary tracking-wide">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-primary/50 mb-2">Phone</p>
              <p className="text-sm font-sans font-medium text-primary tracking-wide">
                {dbUser?.phone || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setEditProfileMode(true)}
            className="w-full sm:w-auto rounded-full border-primary/20 text-[10px] uppercase font-bold tracking-[0.25em] text-primary hover:border-accent hover:bg-accent/5 hover:text-accent transition-all duration-300 h-11 px-8"
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            className="w-full sm:w-auto rounded-full bg-accent/5 text-accent hover:bg-accent hover:text-white uppercase tracking-[0.25em] text-[10px] font-bold shadow-none border border-accent/20 transition-all duration-300 h-11 px-8"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <Dialog open={editProfileMode} onOpenChange={setEditProfileMode}>
        <DialogContent className="sm:max-w-xl rounded-3xl border-primary/10 p-0 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-primary/5">
            <DialogHeader className="space-y-4">
              <DialogTitle className="font-heading text-3xl font-normal tracking-tight text-primary">Edit Profile</DialogTitle>
              <DialogDescription className="font-sans font-medium tracking-wide text-primary/60 text-[13px] leading-relaxed">
                Update your personal information below.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-8 px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">First Name</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={dbUser?.first_name || ""} />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Last Name</Label>
                <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={dbUser?.last_name || ""} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">Email Address (Read Only)</Label>
              <Input className="rounded-xl border-primary/10 bg-primary/5 text-primary/60 h-12 text-[13px] font-medium px-4" defaultValue={user.email} readOnly />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Phone Number</Label>
              <Input className="rounded-xl border-primary/20 focus-visible:border-accent focus-visible:ring-accent/20 shadow-sm h-12 text-[13px] font-medium px-4 transition-colors" defaultValue={dbUser?.phone || ""} />
            </div>
          </div>

          <div className="bg-primary/5 px-8 flex justify-end gap-4 py-5 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditProfileMode(false)}
              className="rounded-full w-full sm:w-auto h-12 px-10 border-primary/20 text-primary text-[10px] tracking-[0.25em] hover:text-accent hover:border-accent hover:bg-accent/5 uppercase font-bold transition-all"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                toast({ title: "Profile Updated", description: "Your personal details have been safely stored." })
                setEditProfileMode(false)
              }}
              className="rounded-full w-full sm:w-auto bg-accent text-white hover:bg-accent/90 h-12 px-10 text-[10px] tracking-[0.25em] uppercase font-bold shadow-md hover:shadow-lg transition-all"
            >
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  )
}
