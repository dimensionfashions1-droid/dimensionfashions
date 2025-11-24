"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/types"

interface WishlistStore {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  getTotalItems: () => number
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product: Product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id)
          if (exists) return state
          return {
            items: [...state.items, product],
          }
        })
      },

      removeFromWishlist: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      isInWishlist: (productId: number) => {
        return get().items.some((item) => item.id === productId)
      },

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
)
