'use client'

import { useState } from 'react'
import { PlusIcon, ChatBubbleLeftIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Conversation } from '@/store/conversations'

interface SidebarProps {
  onNewChat: () => void
  onSelectChat: (id: string) => void
  activeChat?: string
  conversations: Conversation[]
}

export function Sidebar({ onNewChat, onSelectChat, activeChat, conversations }: SidebarProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 m-4 p-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors"
      >
        <PlusIcon className="h-5 w-5" />
        <span>New Chat</span>
      </button>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectChat(conv.id)}
            className={`flex items-center gap-2 w-full p-3 hover:bg-gray-800 transition-colors ${
              activeChat === conv.id ? 'bg-gray-800' : ''
            }`}
          >
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <div className="flex-1 text-left truncate">
              {conv.title || 'New Conversation'}
              <div className="text-xs text-gray-400">
                {new Date(conv.timestamp).toLocaleDateString()}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Settings Button */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 m-4 p-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        <Cog6ToothIcon className="h-5 w-5" />
        <span>Settings</span>
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute bottom-16 left-4 w-56 bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Dark Mode</span>
              <button className="w-8 h-4 bg-gray-600 rounded-full relative">
                <div className="absolute w-3 h-3 bg-white rounded-full left-0.5 top-0.5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notifications</span>
              <button className="w-8 h-4 bg-gray-600 rounded-full relative">
                <div className="absolute w-3 h-3 bg-white rounded-full left-0.5 top-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
