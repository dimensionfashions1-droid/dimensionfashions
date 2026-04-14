'use client'

import React, { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from "@/hooks/use-toast"

export default function StoreLoginPage() {
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
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
          <Image
            src="/images/auth-banner.jpg"
            alt="Dimensions Ethnic Wear"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-light tracking-wide mb-4">Discover the Essence of Elegance</h2>
            <p className="text-lg font-light text-white/90">Curated collections for the modern festive wardrobe.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-16 bg-white">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-3">
              <h1 className="text-3xl font-light tracking-tight text-gray-900">Sign In</h1>
              <p className="text-gray-500 text-sm font-light">
                Welcome back to Dimensions. Enter your details to continue.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <input type="hidden" name="is_store" value="true" />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Link href="/forgot-password" className="text-xs font-medium text-gray-500 hover:text-accent transition-colors duration-300">
                      Forgot Password?
                    </Link>
                  </div>
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                  />
                </div>
              </div>

              <Button disabled={isLoading} type="submit" className="w-full h-11 text-base font-medium rounded-md shadow-sm bg-black hover:bg-accent hover:text-white transition-all duration-300 group">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 font-light">
                Don't have an account?{' '}
                <Link href="/register" className="text-gray-900 font-medium hover:text-accent transition-colors duration-300 hover:underline underline-offset-4">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
