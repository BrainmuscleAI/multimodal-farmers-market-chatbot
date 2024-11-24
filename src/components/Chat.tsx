'use client'

import { useChat } from 'ai/react'
import { useRef, useState, useEffect } from 'react'
import { ProductList } from '@/components/ProductList'
import { VoiceInput } from '@/components/VoiceInput'
import ReactMarkdown from 'react-markdown'
import { Product } from '@/types/products'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

interface ChatProps {
  initialProducts: Product[]
  chatId: string
}

export function Chat({ initialProducts, chatId }: ChatProps) {
  const [error, setError] = useState<string | null>(null)
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    id: chatId,
    initialMessages: [],
    body: {
      chatId,
      initialProducts
    },
    onResponse(response) {
      setError(null)
      if (response.status === 200) {
        console.log('Streaming started successfully')
      } else {
        response.json().then((data) => {
          if (data.error) {
            setError(data.error)
          }
        })
      }
    },
    onError(error) {
      console.error('Chat error:', error)
      setError('Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.')
    },
    onFinish(message) {
      if (!message.content) return

      try {
        // Process add-to-cart tags
        const addToCartMatches = Array.from(message.content.matchAll(/<add-to-cart>(.*?)<\/add-to-cart>/g))
        addToCartMatches.forEach(match => {
          const productId = match[1].trim()
          const product = initialProducts.find(p => p.id === productId)
          if (product) {
            console.log('Adding to cart:', product.name)
            addToCart(product)
          }
        })

        // Process remove-from-cart tags
        const removeFromCartMatches = Array.from(message.content.matchAll(/<remove-from-cart>(.*?)<\/remove-from-cart>/g))
        removeFromCartMatches.forEach(match => {
          const productId = match[1].trim()
          console.log('Removing from cart:', productId)
          removeFromCart(productId)
        })

        // Process update-quantity tags
        const updateQuantityMatches = Array.from(message.content.matchAll(/<update-quantity>(.*?):(.*?)<\/update-quantity>/g))
        updateQuantityMatches.forEach(match => {
          const productId = match[1].trim()
          const quantity = parseInt(match[2].trim(), 10)
          if (!isNaN(quantity) && quantity >= 0) {
            console.log('Updating quantity:', productId, quantity)
            updateQuantity(productId, quantity)
          }
        })

        // Process clear-cart tags
        if (message.content.includes('<clear-cart></clear-cart>')) {
          console.log('Clearing cart')
          clearCart()
        }

        // Process cart tags
        if (message.content.includes('<cart></cart>')) {
          const cartContent = items.map(item => 
            `- ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`
          ).join('\n')
          
          const total = getTotal()
          const cartInfo = `
🛒 Resumen del carrito:

${cartContent || 'El carrito está vacío'}

${items.length > 0 ? `Total: $${total.toFixed(2)}` : ''}
`
          // Replace cart tag with actual content
          message.content = message.content.replace(
            /<cart><\/cart>/,
            cartInfo
          )
        }

        // Process product tags
        const productMatch = message.content.match(/<products>(.*?)<\/products>/s)
        if (productMatch) {
          const category = productMatch[1].trim().toLowerCase()
          const filteredProducts = initialProducts.filter(p => 
            p.category.toLowerCase() === category
          )
          
          const parts = message.content.split(/<products>.*?<\/products>/s)
          message.content = `
${parts[0] || ''}

${filteredProducts.map(p => `- ${p.name}: $${p.price.toFixed(2)} por ${p.unit}`).join('\n')}

${parts[1] || ''}`
        }
      } catch (error) {
        console.error('Error processing message:', error)
      }
    }
  })

  const renderMessageContent = (message: any) => {
    if (message.role === 'assistant' && message.content) {
      try {
        // Remove add-to-cart tags from display
        let cleanContent = message.content.replace(/<add-to-cart>.*?<\/add-to-cart>/g, '')
        
        // Check for product tags
        const productMatch = cleanContent.match(/<products>(.*?)<\/products>/s)
        if (productMatch) {
          const category = productMatch[1].trim().toLowerCase()
          const filteredProducts = initialProducts.filter(p => 
            p.category.toLowerCase() === category
          )
          
          const parts = cleanContent.split(/<products>.*?<\/products>/s)
          return (
            <div className="space-y-4">
              {parts[0] && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{parts[0].trim()}</ReactMarkdown>
                </div>
              )}
              <div className="my-4">
                <ProductList products={filteredProducts} />
              </div>
              {parts[1] && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{parts[1].trim()}</ReactMarkdown>
                </div>
              )}
            </div>
          )
        }

        // Check for cart
        if (cleanContent.includes('<cart>')) {
          const cartSummary = items.length > 0 
            ? items.map(item => 
                `- ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`
              ).join('\n')
            : 'El carrito está vacío'
          
          const total = getTotal()
          const cartInfo = `
🛒 Resumen del carrito:

${cartSummary}

${items.length > 0 ? `Total: $${total.toFixed(2)}` : ''}
`
          const parts = cleanContent.split(/<cart>.*?<\/cart>/s)
          return (
            <div className="space-y-4">
              {parts[0] && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{parts[0].trim()}</ReactMarkdown>
                </div>
              )}
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 p-4 space-y-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{cartInfo.trim()}</ReactMarkdown>
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/cart"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    {items.length > 0 ? 'Ver carrito completo' : 'Explorar productos'}
                  </Link>
                </div>
              </div>
              {parts[1] && (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{parts[1].trim()}</ReactMarkdown>
                </div>
              )}
            </div>
          )
        }

        // Default message rendering
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{cleanContent}</ReactMarkdown>
          </div>
        )
      } catch (error) {
        console.error('Error rendering message:', error)
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )
      }
    }
    return null
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${chatId}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [chatId, setMessages])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages))
    }
  }, [messages, chatId])

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript) return
    
    try {
      setIsProcessing(true)
      if (inputRef.current) {
        inputRef.current.value = transcript
        handleInputChange({ target: { value: transcript } } as any)
      }
      const fakeEvent = { preventDefault: () => {} }
      await handleSubmit(fakeEvent as any)
    } catch (error) {
      console.error('Error processing voice input:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {error && (
          <div className="flex justify-center">
            <div className="rounded-xl px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800/50">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}
        {messages.map((message, i) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`rounded-xl px-4 py-2 max-w-[85%] ${
                message.role === 'assistant'
                  ? 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-xl px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex space-x-4"
        >
          <div className="flex-1 min-w-0">
            <textarea
              ref={inputRef}
              className="w-full p-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Escribe tu mensaje..."
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <VoiceInput onTranscript={handleVoiceInput} isProcessing={isProcessing} />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}