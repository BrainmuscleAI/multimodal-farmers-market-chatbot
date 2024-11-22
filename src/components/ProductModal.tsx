'use client'

import { useEffect, useRef } from 'react'
import { Product } from '@/types/products'
import { useCart } from '@/context/CartContext'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const { addToCart, removeFromCart, items } = useCart()

  const getQuantity = (productId: string) => {
    const item = items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const quantity = getQuantity(product.id)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6 rounded-2xl
          bg-white dark:bg-zinc-800
          border border-gray-200 dark:border-zinc-700"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg
            hover:bg-gray-100 dark:hover:bg-zinc-700
            text-gray-500 dark:text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700">
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

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold dark:text-white">
                  {product.name}
                </h2>
                <span className="text-lg font-medium text-green-600 dark:text-green-400">
                  ${product.price.toFixed(2)} / {product.unit}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => removeFromCart(product.id)}
                  disabled={quantity === 0}
                  className="p-2 rounded-lg transition-colors
                    bg-red-100 hover:bg-red-200 
                    dark:bg-red-900/30 dark:hover:bg-red-900/50
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>

                <span className="w-8 text-center text-lg font-medium dark:text-white">
                  {quantity}
                </span>

                <button
                  onClick={() => addToCart(product)}
                  className="p-2 rounded-lg transition-colors
                    bg-green-100 hover:bg-green-200
                    dark:bg-green-900/30 dark:hover:bg-green-900/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {product.description || 'Sin descripción'}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin Info */}
            {product.origin && (
              <div className="p-4 rounded-xl
                bg-orange-50 dark:bg-orange-900/20
                border border-orange-100 dark:border-orange-900/30"
              >
                <h3 className="text-lg font-medium mb-2 text-orange-900 dark:text-orange-300">
                  Origen
                </h3>
                <p className="text-orange-800 dark:text-orange-200">
                  {product.origin}
                </p>
              </div>
            )}

            {/* Nutritional Info */}
            {product.nutritionalInfo && (
              <div className="p-4 rounded-xl
                bg-purple-50 dark:bg-purple-900/20
                border border-purple-100 dark:border-purple-900/30"
              >
                <h3 className="text-lg font-medium mb-2 text-purple-900 dark:text-purple-300">
                  Información Nutricional
                </h3>
                <div className="space-y-1 text-purple-800 dark:text-purple-200">
                  <p>Calorías: {product.nutritionalInfo.calories}</p>
                  <p>Proteína: {product.nutritionalInfo.protein}</p>
                  <p>Carbohidratos: {product.nutritionalInfo.carbs}</p>
                  <p>Grasas: {product.nutritionalInfo.fat}</p>
                  <p>Fibra: {product.nutritionalInfo.fiber}</p>
                </div>
              </div>
            )}
          </div>

          {/* Category Badge */}
          <div className="inline-block px-3 py-1 text-sm font-medium rounded-full
            bg-blue-100 text-blue-800
            dark:bg-blue-900/50 dark:text-blue-300"
          >
            {product.category}
          </div>
        </div>
      </div>
    </div>
  )
}
