"use client"

import { useState } from "react"
import { X, ShoppingBag, Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()

  const totalPrice = getTotalPrice()
  const itemCount = getTotalItems()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-gold/10 rounded-lg transition-colors text-black hover:text-[rgb(218_184_105)]"
      >
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-[rgb(218_184_105)] text-black text-xs rounded-full flex items-center justify-center font-bold">
            {itemCount}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setIsOpen(false)} />}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-serif font-bold text-black">Your Cart</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-4 opacity-50" />
              <p className="text-black font-medium">Your cart is empty</p>
              <p className="text-sm text-gray-600">Add some beautiful sarees!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.selectedColor}`}
                className="flex gap-4 bg-gray-50 rounded-lg p-4 animate-fade-in-up border border-gray-200"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-black line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      Color: <span className="font-medium">{item.selectedColor}</span>
                    </p>
                    <p className="text-sm font-bold text-[rgb(218_184_105)] mt-1">₹{item.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Minus className="w-3 h-3 text-black" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      <Plus className="w-3 h-3 text-black" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto p-1 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-black">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-[rgb(218_184_105)]">FREE</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between text-lg font-bold">
                <span className="text-black">Total</span>
                <span className="text-[rgb(218_184_105)]">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full bg-[rgb(218_184_105)] hover:bg-[rgb(208_174_95)] text-black rounded-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              Proceed to Checkout
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white text-black border-gray-300 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
