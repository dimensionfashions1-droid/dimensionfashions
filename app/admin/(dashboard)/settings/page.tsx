"use client"

import { useState, useEffect } from "react"
import { AdminPageHeader } from "@/components/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save } from "lucide-react"

interface Settings {
  flat_shipping_rate: string
  free_shipping_threshold: string
  store_email: string
  store_phone: string
  store_address: string
  instagram_url: string
  whatsapp_number: string
}

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    flat_shipping_rate: "0",
    free_shipping_threshold: "0",
    store_email: "",
    store_phone: "",
    store_address: "",
    instagram_url: "",
    whatsapp_number: "",
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (!res.ok) throw new Error("Failed to fetch settings")
        const { data } = await res.json()
        setSettings(prev => ({ ...prev, ...data }))
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load settings.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [toast])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Failed to update settings")
      }

      toast({
        title: "Settings updated",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminPageHeader
        title="Settings"
        subtitle="Global site configuration and preferences"
      />

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Shipping & Delivery</CardTitle>
            <CardDescription className="text-zinc-400">
              Configure delivery charges and free shipping thresholds.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flat_shipping_rate">Flat Shipping Rate (₹)</Label>
                <Input
                  id="flat_shipping_rate"
                  type="number"
                  value={settings.flat_shipping_rate}
                  onChange={(e) => handleChange("flat_shipping_rate", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (₹)</Label>
                <Input
                  id="free_shipping_threshold"
                  type="number"
                  value={settings.free_shipping_threshold}
                  onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription className="text-zinc-400">
              Update store contact details and address shown to customers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store_email">Store Email</Label>
                <Input
                  id="store_email"
                  type="email"
                  value={settings.store_email}
                  onChange={(e) => handleChange("store_email", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store_phone">Store Phone</Label>
                <Input
                  id="store_phone"
                  value={settings.store_phone}
                  onChange={(e) => handleChange("store_phone", e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="store_address">Shop Address</Label>
              <Input
                id="store_address"
                value={settings.store_address}
                onChange={(e) => handleChange("store_address", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="N.M Sungam, Valparai main road, Pollachi, Tamil Nadu, 642007, India"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Social Media & WhatsApp</CardTitle>
            <CardDescription className="text-zinc-400">
              Connect your official social media and WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                value={settings.instagram_url}
                onChange={(e) => handleChange("instagram_url", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="https://instagram.com/your-brand"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input
                id="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                placeholder="+91 00000 00000"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving} className="bg-accent text-white hover:bg-accent/90">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
