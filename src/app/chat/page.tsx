import { Suspense } from 'react'
import Chat from '@/components/Chat'
import { products } from '@/data/products'

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex">
        <h1 className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          Mercado Local AI Assistant
        </h1>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <Suspense fallback={<div>Cargando...</div>}>
          <Chat initialProducts={products} />
        </Suspense>
      </div>
    </main>
  )
}
