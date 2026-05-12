"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Product } from "@/types"

interface WishlistStore {
  items: Product[]
  isAuthenticated: boolean
  isSynced: boolean
  isSyncing: boolean
  setAuthenticated: (auth: boolean) => void
  addToWishlist: (product: Product) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  migrateToDB: () => Promise<void>
  fetchFromDB: () => Promise<void>
  getTotalItems: () => number
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isAuthenticated: false,
      isSynced: false,
      isSyncing: false,

      setAuthenticated: (auth) => set({ isAuthenticated: auth }),

      addToWishlist: async (product) => {
        const { items, isAuthenticated } = get()
        const exists = items.some((item) => item.id === product.id)
        if (exists) return

        set({ items: [...items, product] })

        if (isAuthenticated) {
          try {
            await fetch('/api/users/wishlist', {
              method: 'POST',
              body: JSON.stringify({ productId: product.id })
            })
          } catch (e) {
            console.error('Wishlist sync add error:', e)
          }
        }
      },

      removeFromWishlist: async (productId) => {
        const { items, isAuthenticated } = get()
        set({ items: items.filter((item) => item.id !== productId) })

        if (isAuthenticated) {
          try {
            await fetch(`/api/users/wishlist?productId=${productId}`, { method: 'DELETE' })
          } catch (e) {
            console.error('Wishlist sync remove error:', e)
          }
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId)
      },

      migrateToDB: async () => {
        const { isSyncing, items } = get()
        if (isSyncing) return

        set({ isSyncing: true, isAuthenticated: true })
        try {
          if (items.length > 0) {
            await fetch('/api/users/wishlist/sync', {
              method: 'POST',
              body: JSON.stringify({ productIds: items.map(i => i.id) })
            })
          }

          const res = await fetch('/api/users/wishlist')
          const { data } = await res.json()

          if (data) {
            set({ items: data, isSynced: true })
          }
        } catch (e) {
          console.error('Wishlist migration error:', e)
        } finally {
          set({ isSyncing: false })
        }
      },

      fetchFromDB: async () => {
        try {
          const res = await fetch('/api/users/wishlist')
          const { data } = await res.json()
          if (data) set({ items: data, isSynced: true, isAuthenticated: true })
        } catch (e) {
          console.error('Fetch wishlist error:', e)
        }
      },

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        if (state.isAuthenticated) {
          return { items: [], isAuthenticated: true }
        }
        return { items: state.items, isAuthenticated: false }
      }
    },
  ),
)
