"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product, CartItem } from "@/types"

interface CartStore {
  items: CartItem[]
  addToCart: (product: Product, color: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, color: string = product.colors?.[0] || "", quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id && item.selectedColor === color)

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id && item.selectedColor === color
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                id: Math.random().toString(36).substr(2, 9),
                productId: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity,
                color: color,
                selectedColor: color,
              },
            ],
          }
        })
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        const state = get()
        return state.items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
