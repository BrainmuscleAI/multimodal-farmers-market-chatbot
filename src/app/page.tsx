import dynamic from 'next/dynamic'

const Chat = dynamic(() => import('@/components/Chat'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <Chat />
      </div>
    </main>
  )
}
