'use client'

import React, { useState } from 'react'
import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from "@/hooks/use-toast"

export default function StoreRegisterPage() {
  const { toast } = useToast()
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)
    setIsLoading(false)
    if (result?.error) {
      toast({
        variant: "destructive",
        description: result.error,
      })
    } else if (result?.success) {
      setSuccess(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen rtl:flex-row-reverse">
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:pl-0 sm:p-12 lg:p-24 bg-white">
          <div className="w-full max-w-sm">
            {success ? (
              <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Mail className="h-8 w-8 text-accent" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-light tracking-tight text-gray-900">Check your email</h1>
                  <p className="text-gray-500 text-sm font-light leading-relaxed">
                    We've sent a confirmation link to your inbox. Please click the link to activate your account and start your journey with Dimension.
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                  <p className="text-xs text-gray-400 font-light italic">
                    If you don't see the email, please check your spam folder.
                  </p>
                  <Link 
                    href="/register" 
                    className="flex items-center text-sm font-medium text-gray-900 hover:text-accent transition-colors group"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to registration
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="text-3xl font-light tracking-tight text-gray-900">Create Account</h1>
                  <p className="text-gray-500 text-sm font-light">
                    Join our community for a seamless shopping experience.
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  <input type="hidden" name="is_store" value="true" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        placeholder="Jane"
                        required
                        className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        placeholder="Doe"
                        required
                        className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@example.com"
                      required
                      className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <PasswordInput
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      minLength={6}
                      required
                      className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                    />
                  </div>

                  <Button disabled={isLoading} type="submit" className="w-full h-11 text-base font-medium rounded-md shadow-sm bg-black hover:bg-accent hover:text-white transition-all duration-300 group">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 font-light">
                    Already have an account?{' '}
                    <Link href="/login" className="text-gray-900 font-medium hover:text-accent transition-colors duration-300 hover:underline underline-offset-4">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Left Side - Image (Flipped visual order via HTML order or flex row behavior) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
          <Image
            src="/images/auth-banner2.jpg"
            alt="Dimension Collection"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />

        </div>

      </div>
    </div>
  )
}
