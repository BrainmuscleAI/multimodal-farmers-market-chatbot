'use client'

import { Product } from '@/types/products'
import { useCart } from '@/context/CartContext'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const { addToCart, removeFromCart, items } = useCart()

  const getQuantity = (productId: string) => {
    const item = items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => {
        const quantity = getQuantity(product.id)
        
        return (
          <div
            key={product.id}
            className="relative p-4 rounded-xl overflow-hidden
              bg-white dark:bg-zinc-800
              border border-gray-200 dark:border-zinc-700
              hover:shadow-lg transition-shadow duration-200"
          >
            {/* Product Image */}
            <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-700">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium dark:text-white">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.description || 'Sin descripción'}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ${product.price.toFixed(2)} / {product.unit}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    disabled={quantity === 0}
                    className="p-2 rounded-lg transition-colors
                      bg-red-100 hover:bg-red-200 
                      dark:bg-red-900/30 dark:hover:bg-red-900/50
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <span className="w-8 text-center font-medium dark:text-white">
                    {quantity}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-lg transition-colors
                      bg-green-100 hover:bg-green-200
                      dark:bg-green-900/30 dark:hover:bg-green-900/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full
              bg-blue-100 text-blue-800
              dark:bg-blue-900/50 dark:text-blue-300"
            >
              {product.category}
            </div>
          </div>
        )
      })}
    </div>
  )
}
