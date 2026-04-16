"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/types"

interface WishlistStore {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
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

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },

      isInWishlist: (productId: string) => {
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
