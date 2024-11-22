'use client'

import { Product } from '@/types/products'
import { ProductCard } from './ProductCard'

interface ProductListProps {
  products: Product[]
  onAddToCart?: (product: Product, quantity: number) => void
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  if (!products.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        No products found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={
            onAddToCart ? (quantity) => onAddToCart(product, quantity) : undefined
          }
        />
      ))}
    </div>
  )
}
