"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, use, useRef } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, User, ShieldCheck, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function AdminUserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const resolvedParams = use(params)
  const userId = resolvedParams.id

  const [isSaving, setIsSaving] = useState(false)
  const hasInitialized = useRef(false)

  const { data: userResponse, isLoading, error } = useSWR(
    userId ? `/api/admin/users/${userId}` : null,
    fetcher
  )

  const user = userResponse?.data

  // Form State
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (user && !hasInitialized.current) {
      setFirstName(user.first_name || "")
      setLastName(user.last_name || "")
      setPhone(user.phone || "")
      setIsAdmin(!!user.is_admin)
      hasInitialized.current = true
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          is_admin: isAdmin,
        }),
      })

      const result = await res.json().catch(() => ({}))

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: result.error || "Failed to update user.",
        })
        return
      }

      toast({ title: "User updated", description: "The user has been updated successfully." })
      mutate(`/api/admin/users/${userId}`)
      router.push("/admin/users")
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (error || (userResponse && !userResponse.data && !isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6 bg-zinc-950 px-4 text-center rounded-2xl border border-zinc-900">
        <h2 className="text-2xl font-bold text-white tracking-tight">User Not Found</h2>
        <p className="text-zinc-500 max-w-md text-sm">We couldn't find the user you're looking for.</p>
        <Link href="/admin/users">
          <Button className="rounded-full px-8 py-2 bg-white text-zinc-900 font-bold hover:bg-zinc-200">Return to Users</Button>
        </Link>
      </div>
    )
  }

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 font-medium tracking-widest uppercase">Loading User...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Edit User</h1>
            <p className="text-zinc-400 text-sm mt-1">Managing {user.email || "User profile"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Profile Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <User className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Profile Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-300">First Name</Label>
              <Input 
                value={firstName} 
                onChange={e => setFirstName(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Last Name</Label>
              <Input 
                value={lastName} 
                onChange={e => setLastName(e.target.value)}
                className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Email Address (Read-only)</Label>
              <div className="relative">
                <Input 
                  value={user.email || "N/A"} 
                  disabled 
                  className="h-11 rounded-xl border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed pr-10" 
                />
                <Mail className="absolute right-3 top-3 h-5 w-5 text-zinc-700" />
              </div>
              <p className="text-[10px] text-zinc-600 italic mt-1">Emails are linked to authentication and cannot be changed here.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Phone Number</Label>
              <div className="relative">
                <Input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 pr-10" 
                />
                <Phone className="absolute right-3 top-3 h-5 w-5 text-zinc-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <ShieldCheck className="h-5 w-5 text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Permissions</h2>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-zinc-950/50 rounded-xl border border-zinc-800/50">
            <div>
              <p className="text-sm font-medium text-white">Admin Access</p>
              <p className="text-xs text-zinc-500 mt-1">Grant this user full access to the admin dashboard.</p>
            </div>
            <div 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-200 ${isAdmin ? 'bg-indigo-600' : 'bg-zinc-800'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-200 ${isAdmin ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-800">
          <Link href="/admin/users">
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
