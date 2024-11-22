'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductCardProps {
  name: string
  price: number
  description: string
  image: string
  unit?: string
  onAddToCart?: (quantity: number) => void
}

export function ProductCard({
  name,
  price,
  description,
  image,
  unit = 'each',
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-medium">
            ${price.toFixed(2)} / {unit}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(quantity)}
            className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}
