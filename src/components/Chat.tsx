'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import { StreamableUI, parseStreamableComponent } from './ui/StreamableUI'
import { Product } from '@/types/products'

interface OrderItem {
  product: Product
  quantity: number
}

export default function Chat() {
  const [error, setError] = useState<string | null>(null)
  const [orderedItems, setOrderedItems] = useState<OrderItem[]>([])
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
      setError(error.message)
    }
  })

  const handleAddToCart = (product: Product, quantity: number) => {
    setOrderedItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  // Format ordered items for display
  const formatOrderedItems = () => {
    return orderedItems.map(
      ({ product, quantity }) =>
        `${quantity} ${product.unit} ${product.name} ($${(product.price * quantity).toFixed(2)})`
    )
  }

  // Calculate total
  const total = orderedItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  )

  return (
    <div className="rounded-lg border bg-white">
      {error && (
        <div className="p-4 text-red-500 bg-red-50 border-b">
          Error: {error}
        </div>
      )}
      
      <div className="h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.map(message => {
          // Parse any components in the message
          const component = parseStreamableComponent(message.content)
          
          return (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {component ? (
                  <StreamableUI
                    name={component.name as any}
                    props={{
                      ...component.props,
                      onAddToCart: handleAddToCart,
                    }}
                  />
                ) : (
                  message.content
                )}
              </div>
            </div>
          )
        })}
      </div>

      {orderedItems.length > 0 && (
        <div className="border-t p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Your Order:</h3>
          <StreamableUI
            name="List"
            props={{
              items: formatOrderedItems(),
              style: "number"
            }}
          />
          <div className="mt-2 font-semibold text-right">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}

      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setError(null)
            handleSubmit(e)
          }}
          className="flex space-x-4"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about our fresh produce..."
            className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
