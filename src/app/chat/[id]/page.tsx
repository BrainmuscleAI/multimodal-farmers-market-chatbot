import { Chat } from '@/components/Chat'
import { products } from '@/data/products'

export default function ChatPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-full">
      <Chat initialProducts={products} chatId={params.id} />
    </div>
  )
}
