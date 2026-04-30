"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Product, CartItem } from "@/types"

interface CartStore {
  items: CartItem[]
  isAuthenticated: boolean
  isSynced: boolean
  isSyncing: boolean
  setAuthenticated: (auth: boolean) => void
  addToCart: (product: Product, attributes: Record<string, string>, quantity: number, isAuthenticated: boolean) => Promise<void>
  removeFromCart: (itemId: string, isAuthenticated: boolean) => Promise<void>
  updateQuantity: (itemId: string, quantity: number, isAuthenticated: boolean) => Promise<void>
  migrateToDB: () => Promise<void>
  fetchFromDB: () => Promise<void>
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isAuthenticated: false,
      isSynced: false,
      isSyncing: false,

      setAuthenticated: (auth) => set({ isAuthenticated: auth }),

      addToCart: async (product, attributes, quantity = 1, isAuthenticated = false) => {
        const { items } = get()
        
        const sortedAttributes = Object.keys(attributes).sort().reduce((acc: any, key) => {
            acc[key] = attributes[key]
            return acc
        }, {})
        const attrString = JSON.stringify(sortedAttributes)

        const existingItemIndex = items.findIndex(
          (item) => 
            item.productId === product.id && 
            JSON.stringify(Object.keys(item.selectedAttributes || {}).sort().reduce((acc: any, key) => {
                acc[key] = item.selectedAttributes![key]
                return acc
            }, {})) === attrString
        )

        let updatedItems = [...items]
        const tempId = Math.random().toString(36).substr(2, 9)

        if (existingItemIndex > -1) {
          const item = updatedItems[existingItemIndex]
          updatedItems[existingItemIndex] = { ...item, quantity: item.quantity + quantity }
        } else {
          updatedItems.push({
            id: tempId,
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
            selectedAttributes: sortedAttributes,
            slug: product.slug
          })
        }

        // Update local state for immediate UI feedback (optimistic)
        set({ items: updatedItems, isAuthenticated })

        if (isAuthenticated) {
          try {
            const res = await fetch('/api/users/cart', {
              method: 'POST',
              body: JSON.stringify({
                productId: product.id,
                quantity,
                selectedAttributes: sortedAttributes
              })
            })
            
            const data = await res.json()
            if (data.success && data.id) {
                set((state) => ({
                    items: state.items.map(i => {
                        const isMatch = i.productId === product.id && 
                                        JSON.stringify(i.selectedAttributes) === attrString
                        return isMatch ? { ...i, id: data.id } : i
                    })
                }))
            }
          } catch (e) {
            console.error('Failed to sync add to cart', e)
          }
        }
      },

      removeFromCart: async (itemId, isAuthenticated = false) => {
        const { items } = get()
        set({ items: items.filter((i) => i.id !== itemId), isAuthenticated })

        if (isAuthenticated) {
          try {
            await fetch(`/api/users/cart?id=${itemId}`, { method: 'DELETE' })
          } catch (e) {
            console.error('Failed to sync remove from cart', e)
          }
        }
      },

      updateQuantity: async (itemId, quantity, isAuthenticated = false) => {
        const { items } = get()
        const targetItem = items.find(i => i.id === itemId)
        if (!targetItem) return

        set({
          items: items.map((i) => (i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i)),
          isAuthenticated
        })

        if (isAuthenticated) {
            try {
                await fetch('/api/users/cart', {
                    method: 'POST',
                    body: JSON.stringify({
                        productId: targetItem.productId,
                        quantity: quantity,
                        selectedAttributes: targetItem.selectedAttributes,
                        action: 'set'
                    })
                })
            } catch (e) {
                console.error('Failed to sync quantity update', e)
            }
        }
      },

      migrateToDB: async () => {
        const { items, isSyncing } = get()
        if (isSyncing) return
        
        set({ isSyncing: true, isAuthenticated: true })

        try {
          const guestItems = items.filter(i => i.id.length < 15 || !i.id.includes('-'))

          if (guestItems.length > 0) {
            await fetch('/api/users/cart/sync', {
              method: 'POST',
              body: JSON.stringify({ items: guestItems })
            })
          }

          const res = await fetch('/api/users/cart')
          const { data } = await res.json()
          
          if (data) {
            set({ items: data, isSynced: true })
          }
        } catch (e) {
          console.error('Cart migration error:', e)
        } finally {
          set({ isSyncing: false })
        }
      },

      fetchFromDB: async () => {
        try {
          const res = await fetch('/api/users/cart')
          const { data } = await res.json()
          if (data) set({ items: data, isSynced: true, isAuthenticated: true })
        } catch (e) {
          console.error('Fetch cart error:', e)
        }
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
      storage: createJSONStorage(() => localStorage),
      // CRITICAL: If authenticated, return empty items to localStorage.
      // This ensures that logged-in users never save their cart locally.
      partialize: (state) => {
        if (state.isAuthenticated) {
          return { items: [], isAuthenticated: true }
        }
        return { items: state.items, isAuthenticated: false }
      }
    },
  ),
)
