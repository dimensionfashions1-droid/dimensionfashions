'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

import { createClient } from '@/lib/supabase/client'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'

export function AuthToasterWatcher() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  
  const migrateCart = useCart(state => state.migrateToDB)
  const migrateWishlist = useWishlist(state => state.migrateToDB)
  const fetchCart = useCart(state => state.fetchFromDB)
  const fetchWishlist = useWishlist(state => state.fetchFromDB)
  const setAuthCart = useCart(state => state.setAuthenticated)
  const setAuthWishlist = useWishlist(state => state.setAuthenticated)

  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && session)) {
        const isInitial = event === 'INITIAL_SESSION'
        
        setAuthCart(true)
        setAuthWishlist(true)

        if (isInitial) {
          await fetchCart()
          await fetchWishlist()
        } else {
          await migrateCart()
          await migrateWishlist()
        }
        
        // Final wipe of storage keys just to be absolutely sure
        localStorage.removeItem('cart-storage')
        localStorage.removeItem('wishlist-storage')
      } else if (event === 'SIGNED_OUT') {
          setAuthCart(false)
          setAuthWishlist(false)
          useCart.getState().clearCart()
          useWishlist.setState({ items: [] })
          localStorage.removeItem('cart-storage')
          localStorage.removeItem('wishlist-storage')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [migrateCart, migrateWishlist, fetchCart, fetchWishlist, setAuthCart, setAuthWishlist])

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setTimeout(() => {
        toast({
          title: "Email verified successfully",
          description: "Please log in to continue to your account.",
        })
      }, 500)
      
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete('verified')
      const newUrl = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname
      router.replace(newUrl)
    }
  }, [searchParams, pathname, router, toast])

  return null
}
