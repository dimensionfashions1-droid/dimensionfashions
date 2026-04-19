'use client'

import React, { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Lock, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await login(formData)
    setIsLoading(false)
    if (result?.error) {
      toast({
        variant: "destructive",
        description: result.error,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="flex justify-center mb-8">
          <div className="h-12 w-12 bg-black rounded-xl flex items-center justify-center">
            <Lock className="text-white h-5 w-5" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-500">
            Secure login for Dimensions staff only.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="admin@dimensions.in" 
              required 
              className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="h-11 rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] focus-visible:border-zinc-700 focus-visible:ring-zinc-700/60 transition-all"
            />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full h-11 text-base font-medium rounded-md shadow-sm bg-black hover:bg-gray-900 transition-all group">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
