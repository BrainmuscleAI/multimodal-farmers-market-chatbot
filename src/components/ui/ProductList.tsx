'use client'

import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  unit: string
}

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  if (!products.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        No products found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-green-600 font-medium">
              ${product.price.toFixed(2)} / {product.unit}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {product.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
