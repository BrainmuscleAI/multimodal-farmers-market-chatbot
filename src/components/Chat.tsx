'use client'

import { useChat } from 'ai/react'
import { useRef, useState, useEffect } from 'react'
import { ProductList } from '@/components/ProductList'
import { VoiceInput } from '@/components/VoiceInput'
import ReactMarkdown from 'react-markdown'
import { Product } from '@/types/products'
import { useCart } from '@/context/CartContext'
import { CartPreview } from '@/components/CartPreview'

interface ChatProps {
  initialProducts: Product[]
  chatId: string
}

export function Chat({ initialProducts, chatId }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    id: chatId,
    initialMessages: [],
    body: {
      chatId
    }
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { items, getTotal } = useCart()

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
      
      // Update conversation title after first message
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
      const updatedConversations = conversations.map((conv: any) => {
        if (conv.id === chatId && conv.title === 'Nueva conversación') {
          // Use first user message as title
          const firstUserMessage = messages.find(m => m.role === 'user')
          return {
            ...conv,
            title: firstUserMessage ? firstUserMessage.content.slice(0, 30) + '...' : conv.title
          }
        }
        return conv
      })
      localStorage.setItem('conversations', JSON.stringify(updatedConversations))
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

  const renderMessageContent = (message: any) => {
    if (message.role === 'assistant' && message.content) {
      // Check for product tags
      const productMatch = message.content.match(/<products>(.*?)<\/products>/s)
      if (productMatch) {
        const category = productMatch[1].trim()
        const products = initialProducts.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        )
        
        const parts = message.content.split(/<products>.*?<\/products>/s)
        const beforeProducts = parts[0]
        const afterProducts = parts[1]

        return (
          <div className="space-y-4">
            {beforeProducts && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{beforeProducts.trim()}</ReactMarkdown>
              </div>
            )}

            <div className="my-4">
              <ProductList products={products} />
            </div>

            {afterProducts && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{afterProducts.trim()}</ReactMarkdown>
              </div>
            )}
          </div>
        )
      }

      // Check for cart
      if (message.content.includes('<cart>')) {
        const cartSummary = items.map(item => 
          `- ${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')
        
        const total = getTotal()
        const cartInfo = `
🛒 Resumen del carrito:

${cartSummary}

Total: $${total.toFixed(2)}
`
        const parts = message.content.split(/<cart>.*?<\/cart>/s)
        const beforeCart = parts[0]
        const afterCart = parts[1]

        return (
          <div className="space-y-4">
            {beforeCart && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{beforeCart.trim()}</ReactMarkdown>
              </div>
            )}

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{cartInfo.trim()}</ReactMarkdown>
            </div>

            {afterCart && (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{afterCart.trim()}</ReactMarkdown>
              </div>
            )}
          </div>
        )
      }

      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, i) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar */}
            {message.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
            )}
            
            <div
              className={`rounded-2xl px-4 py-2 max-w-[85%] space-y-2 shadow-sm
                ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700'
                }`}
            >
              {renderMessageContent(message)}
            </div>

            {/* Avatar */}
            {message.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-800 rounded-2xl px-4 py-2 shadow-sm border border-gray-200 dark:border-zinc-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <div className="flex-1 min-h-[44px] relative">
            <textarea
              ref={inputRef}
              className="w-full h-full min-h-[44px] p-3 pr-20 rounded-xl resize-none
                bg-white dark:bg-zinc-800
                border border-gray-200 dark:border-zinc-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:text-white"
              placeholder="Escribe tu mensaje aquí..."
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

          <VoiceInput onTranscript={handleVoiceInput} isProcessing={isProcessing} />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-4 rounded-xl transition-all duration-200
              bg-blue-500 hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-medium"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Enviar'
            )}
          </button>
        </div>
      </form>

      {/* Cart Preview */}
      <CartPreview />
    </div>
  )
}