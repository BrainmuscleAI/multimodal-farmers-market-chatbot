import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { ConversationList } from '@/components/ConversationList'
import { CartPreview } from '@/components/CartPreview'

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
                <ConversationList />
              </div>

              {/* Main content */}
              <div className="flex-1">
                {children}
              </div>

              {/* Cart Preview */}
              <CartPreview />
            </div>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
