import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Create Account | Dimensions',
  description: 'Join Dimensions to manage orders, addresses, and wishlists.'
}

export default async function StoreRegisterPage(props: { searchParams?: Promise<any> | any }) {
  const resolvedParams = await props.searchParams
  const error = resolvedParams?.error

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen rtl:flex-row-reverse">
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-light tracking-tight text-gray-900">Create Account</h1>
              <p className="text-gray-500 text-sm font-light">
                Join our community for a seamless shopping experience.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-none text-center">
                {error}
              </div>
            )}

            <form action={signup} className="space-y-6">
              <input type="hidden" name="is_store" value="true" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input 
                    id="first_name" 
                    name="first_name" 
                    required 
                    className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input 
                    id="last_name" 
                    name="last_name" 
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
                  required 
                  className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  minLength={6}
                  required 
                  className="h-11 rounded-md bg-white border-gray-200 shadow-sm focus-visible:ring-1 focus-visible:ring-gray-900 focus-visible:border-gray-900 transition-all"
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base font-medium rounded-md shadow-sm bg-black hover:bg-gray-900 transition-all group">
                Create Account
                <ArrowRight className="h-4 w-4 ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 font-light">
                Already have an account?{' '}
                <Link href="/login" className="text-gray-900 font-medium hover:underline underline-offset-4">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Left Side - Image (Flipped visual order via HTML order or flex row behavior) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-100">
          <Image 
            src="/images/editorial.jpg" 
            alt="Dimensions Collection" 
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-12 right-12 text-right text-white">
            <h2 className="text-3xl font-light tracking-wide mb-4 text-white drop-shadow-md">Timeless Craft</h2>
            <p className="text-lg font-light text-white/90 drop-shadow-md">Authentic weaves for every celebration.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
