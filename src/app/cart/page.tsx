'use client'

import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQuantity, clearCart, getTotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold dark:text-white">Tu carrito está vacío</h2>
          <p className="text-gray-600 dark:text-gray-400">
            ¿No sabes qué comprar? Habla con nuestro asistente para recibir recomendaciones.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-xl
              bg-blue-500 hover:bg-blue-600
              text-white font-medium"
          >
            Explorar productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Tu Carrito</h1>
        <button
          onClick={clearCart}
          className="px-4 py-2 rounded-lg
            text-red-600 hover:bg-red-50
            dark:text-red-400 dark:hover:bg-red-900/30"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex gap-4 p-4 rounded-xl
                bg-white dark:bg-zinc-800
                border border-gray-200 dark:border-zinc-700"
            >
              {/* Product Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-700 flex-shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ${item.price.toFixed(2)} / {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600 dark:text-green-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 mt-4">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg transition-colors
                      bg-red-100 hover:bg-red-200 
                      dark:bg-red-900/30 dark:hover:bg-red-900/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value)) {
                        updateQuantity(item.id, value)
                      }
                    }}
                    className="w-16 p-1 text-center rounded-lg
                      border border-gray-200 dark:border-zinc-700
                      bg-white dark:bg-zinc-800
                      dark:text-white"
                  />

                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg transition-colors
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
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl sticky top-4
            bg-white dark:bg-zinc-800
            border border-gray-200 dark:border-zinc-700"
          >
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Resumen del Pedido
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="dark:text-white">${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Envío</span>
                <span className="dark:text-white">Gratis</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-zinc-700">
                <div className="flex justify-between font-medium">
                  <span className="dark:text-white">Total</span>
                  <span className="text-green-600 dark:text-green-400">
                    ${getTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              disabled={isCheckingOut}
              className="w-full py-3 rounded-xl transition-all duration-200
                bg-blue-500 hover:bg-blue-600 
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-medium"
            >
              {isCheckingOut ? 'Procesando...' : 'Proceder al pago'}
            </button>

            <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
              Pago seguro con encriptación SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
