'use client'

import { Product } from '@/types/products'
import { useCart } from '@/context/CartContext'
import { useEffect, useRef } from 'react'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart, removeFromCart, items } = useCart()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const quantity = items.find(item => item.id === product.id)?.quantity || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl p-6 mx-4 rounded-xl bg-white dark:bg-zinc-800 shadow-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-700">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full
                bg-blue-100 text-blue-800
                dark:bg-blue-900/50 dark:text-blue-300"
              >
                {product.category}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              {product.description || 'Sin descripción'}
            </p>

            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${product.price.toFixed(2)} / {product.unit}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => removeFromCart(product.id)}
                disabled={quantity === 0}
                className="p-3 rounded-xl transition-colors
                  bg-red-100 hover:bg-red-200 
                  dark:bg-red-900/30 dark:hover:bg-red-900/50
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>

              <span className="w-12 text-center text-xl font-medium dark:text-white">
                {quantity}
              </span>

              <button
                onClick={() => addToCart(product)}
                className="p-3 rounded-xl transition-colors
                  bg-green-100 hover:bg-green-200
                  dark:bg-green-900/30 dark:hover:bg-green-900/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
