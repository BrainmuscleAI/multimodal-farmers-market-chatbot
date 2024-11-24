'use client'

import { useState, useEffect } from 'react'
import { Market } from '@/types/market'
import { MarketMap } from './MarketMap'

interface OrderStatus {
  id: string
  status: 'pending' | 'preparing' | 'ready' | 'in_transit' | 'delivered'
  estimatedDelivery?: Date
  currentLocation?: {
    latitude: number
    longitude: number
  }
  market: Market
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  total: number
  createdAt: Date
  updatedAt: Date
}

interface OrderTrackerProps {
  orderId: string
  className?: string
}

export function OrderTracker({ orderId, className = '' }: OrderTrackerProps) {
  const [order, setOrder] = useState<OrderStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulated order data - replace with actual API call
    const mockOrder: OrderStatus = {
      id: orderId,
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 30 * 60000), // 30 minutes from now
      currentLocation: {
        latitude: 19.4010,
        longitude: -99.1363
      },
      market: {
        id: '1',
        name: 'Mercado de Coyoacán',
        address: 'Ignacio Allende s/n, Del Carmen, Coyoacán',
        latitude: 19.3500,
        longitude: -99.1627
      },
      items: [
        { id: '1', name: 'Aguacate', quantity: 3, price: 15 },
        { id: '2', name: 'Jitomate', quantity: 1, price: 10 }
      ],
      total: 55,
      createdAt: new Date(Date.now() - 20 * 60000), // 20 minutes ago
      updatedAt: new Date()
    }

    setOrder(mockOrder)
  }, [orderId])

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-red-800 dark:text-red-400">
        {error}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
        <div className="h-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
      </div>
    )
  }

  const statusSteps = [
    { key: 'pending', label: 'Pendiente' },
    { key: 'preparing', label: 'Preparando' },
    { key: 'ready', label: 'Listo' },
    { key: 'in_transit', label: 'En camino' },
    { key: 'delivered', label: 'Entregado' }
  ]

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Status Steps */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 dark:bg-zinc-700 -translate-y-1/2"></div>
        <div className="relative flex justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div 
                className={`w-4 h-4 rounded-full ${
                  index <= currentStepIndex
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-zinc-700'
                } relative z-10`}
              />
              <span className="text-xs mt-2">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      {order.currentLocation && (
        <MarketMap
          markets={[order.market]}
          selectedMarket={order.market}
          className="h-64 rounded-xl shadow-sm"
        />
      )}

      {/* Order Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Pedido #{order.id}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {order.market.name}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${order.total.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {order.items.length} productos
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Estimated Delivery */}
        {order.estimatedDelivery && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Entrega estimada: {order.estimatedDelivery.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}
