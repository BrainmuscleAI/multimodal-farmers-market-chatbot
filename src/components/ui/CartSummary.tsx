'use client'

import { useCart } from '@/hooks/useCart'

export function CartSummary() {
  const { items, total, updateQuantity, removeItem } = useCart()

  if (!items.length) {
    return (
      <div className="text-center p-4 text-gray-500">
        El carrito está vacío
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Tu Carrito</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{item.product.name}</h4>
              <p className="text-gray-600">${item.product.price.toFixed(2)} MXN × {item.quantity}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.product.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${total.toFixed(2)} MXN</span>
        </div>
        <button
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Proceder al Pago
        </button>
      </div>
    </div>
  )
}
