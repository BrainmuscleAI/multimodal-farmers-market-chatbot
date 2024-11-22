import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types'

interface CartItem {
  product: Product
  quantity: number
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          )

          if (existingItem) {
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems),
            }
          }

          const newItems = [...state.items, { product, quantity }]
          return {
            items: newItems,
            total: calculateTotal(newItems),
          }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const updatedItems = state.items.filter(
              (item) => item.product.id !== productId
            )
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems),
            }
          }

          const updatedItems = state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
          return {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          }
        }),

      removeItem: (productId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.product.id !== productId
          )
          return {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          }
        }),

      clearCart: () =>
        set({
          items: [],
          total: 0,
        }),
    }),
    {
      name: 'cart-storage',
    }
  )
)

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
}
