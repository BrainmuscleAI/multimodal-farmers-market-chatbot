'use client'

import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartPreview() {
  const { items, getTotal, getItemCount } = useCart()
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const itemCount = getItemCount()

  // Show preview when cart changes
  useEffect(() => {
    if (itemCount > 0) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false)
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [itemCount, isHovered])

  if (itemCount === 0) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsVisible(false)
      }}
    >
      <Link href="/cart">
        <div className="p-4 rounded-xl shadow-lg
          bg-white dark:bg-zinc-800
          border border-gray-200 dark:border-zinc-700"
        >
          <div className="flex items-center gap-4">
            {/* Cart Icon with Badge */}
            <div className="relative">
              <div className="p-2 rounded-lg
                bg-blue-100 dark:bg-blue-900/30
                text-blue-600 dark:text-blue-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full
                bg-green-500 text-white
                flex items-center justify-center text-sm font-medium"
              >
                {itemCount}
              </div>
            </div>

            {/* Cart Info */}
            <div>
              <div className="font-medium dark:text-white">
                {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total: ${getTotal().toFixed(2)}
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="ml-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
