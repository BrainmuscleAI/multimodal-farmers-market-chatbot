'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Conversation {
  id: string
  title: string
  timestamp: string
}

export function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load conversations from localStorage
    const loadConversations = () => {
      const savedConversations = localStorage.getItem('conversations')
      if (savedConversations) {
        setConversations(JSON.parse(savedConversations))
      }
    }
    loadConversations()
  }, [])

  const startNewChat = () => {
    const newId = Date.now().toString()
    const newConversation = {
      id: newId,
      title: 'Nueva conversación',
      timestamp: new Date().toISOString()
    }
    
    const updatedConversations = [newConversation, ...conversations]
    setConversations(updatedConversations)
    localStorage.setItem('conversations', JSON.stringify(updatedConversations))
    router.push(`/chat/${newId}`)
  }

  const selectConversation = (id: string) => {
    router.push(`/chat/${id}`)
  }

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedConversations = conversations.filter(conv => conv.id !== id)
    setConversations(updatedConversations)
    localStorage.setItem('conversations', JSON.stringify(updatedConversations))
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-zinc-900">
      <div className="p-4">
        <button
          onClick={startNewChat}
          className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Nueva conversación
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => selectConversation(conv.id)}
            className="p-3 rounded-lg cursor-pointer group
              bg-white dark:bg-zinc-800 
              hover:bg-gray-100 dark:hover:bg-zinc-700
              transition-colors"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium truncate dark:text-white">
                {conv.title}
              </span>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {new Date(conv.timestamp).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
