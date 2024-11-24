import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { ConversationList } from '@/components/ConversationList'
import { CartPreview } from '@/components/CartPreview'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mercado Local AI',
  description: 'Tu asistente virtual para el mercado local',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <SettingsProvider>
          <CartProvider>
            <div className="flex h-screen bg-gray-100 dark:bg-zinc-900">
              {/* Sidebar */}
              <div className="w-64 border-r border-gray-200 dark:border-zinc-800">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-12 px-4">
                    <div className="w-full h-6 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                }>
                  <ConversationList />
                </Suspense>
              </div>

              {/* Main content */}
              <div className="flex-1 relative">
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"></div>
                    </div>
                  </div>
                }>
                  {children}
                </Suspense>
              </div>

              {/* Cart Preview */}
              <Suspense fallback={
                <div className="w-64 border-l border-gray-200 dark:border-zinc-800">
                  <div className="h-12 px-4 flex items-center border-b border-gray-200 dark:border-zinc-800">
                    <div className="w-full h-6 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse" />
                  </div>
                </div>
              }>
                <CartPreview />
              </Suspense>
            </div>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
