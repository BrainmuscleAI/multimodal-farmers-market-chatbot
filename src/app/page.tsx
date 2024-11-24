import { Chat } from '@/components/Chat'
import { products } from '@/data/products'
import { Suspense } from 'react'

export const runtime = 'edge'

export default function Home() {
  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"></div>
          </div>
        </div>
      }>
        <Chat initialProducts={products} chatId="default" />
      </Suspense>
    </div>
  )
}
