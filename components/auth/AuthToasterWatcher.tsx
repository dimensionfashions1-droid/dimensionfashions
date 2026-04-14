'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function AuthToasterWatcher() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      // Delay slightly for smooth UX
      setTimeout(() => {
        toast({
          title: "Email verified successfully",
          description: "Please log in to continue to your account.",
        })
      }, 500)
      
      // Clean up the URL
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete('verified')
      const newUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname
      router.replace(newUrl)
    }
  }, [searchParams, pathname, router, toast])

  return null
}
