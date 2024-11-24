'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export function CartPreview() {
  const { items, getTotal } = useCart()

  if (items.length === 0) {
    return null
  }

  const total = getTotal()

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Link
        href="/cart"
        className="flex items-center space-x-2 px-4 py-2 rounded-full
          bg-green-500 text-white
          hover:bg-green-600
          shadow-lg hover:shadow-xl
          transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
        <span className="font-medium">${total.toFixed(2)}</span>
        <span className="w-6 h-6 flex items-center justify-center bg-white text-green-500 rounded-full text-sm font-bold">
          {items.length}
        </span>
      </Link>
    </div>
  )
}
