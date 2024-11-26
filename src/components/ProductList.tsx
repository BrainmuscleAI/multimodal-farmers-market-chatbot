'use client'

import { Product } from '@/types/products'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const { addToCart, items } = useCart()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const cartItem = items.find(item => item.id === product.id)
        return (
          <div
            key={product.id}
            className="relative flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 dark:border-zinc-700"
          >
            <div className="relative h-48 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex-1">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  ${product.price.toFixed(2)} / {product.unit}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                  {cartItem ? 'Agregar más' : 'Agregar'}
                </button>
              </div>
              {cartItem && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  {cartItem.quantity} en el carrito
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
