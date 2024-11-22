'use client'

import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'

export function CartPreview() {
  const { items, getTotal } = useCart()
  const [isVisible, setIsVisible] = useState(false)

  // Show cart preview when items change
  useEffect(() => {
    if (items.length > 0) {
      setIsVisible(true)
      const timer = setTimeout(() => setIsVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [items])

  if (!isVisible || items.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full p-4 rounded-xl shadow-lg
      bg-white dark:bg-zinc-800
      border border-gray-200 dark:border-zinc-700"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium dark:text-white">
          🛒 Carrito
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-2 mb-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {item.name} ({item.quantity}x)
            </span>
            <span className="font-medium dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-200 dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <span className="font-medium dark:text-white">Total:</span>
          <span className="text-lg font-semibold text-green-600 dark:text-green-400">
            ${getTotal().toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
