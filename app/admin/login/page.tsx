'use client'

import React, { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Lock, Loader2, Eye, EyeOff } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-50/50">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-zinc-200">
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
            Secure login for Dimension staff only.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="admin@dimension.in" 
              required 
              className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-500 focus-visible:border-zinc-400 focus-visible:ring-zinc-400/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                required 
                className="h-11 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 pr-10 focus-visible:border-zinc-400 focus-visible:ring-zinc-400/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
