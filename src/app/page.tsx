import { Chat } from '@/components/Chat'
import { products } from '@/data/products'

export default function Home() {
  return (
    <div className="h-full">
      <Chat initialProducts={products} chatId="default" />
    </div>
  )
}
