import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

interface ConversationStore {
  conversations: Conversation[]
  activeConversation?: string
  addConversation: (title: string) => string
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  setActiveConversation: (id: string) => void
  deleteConversation: (id: string) => void
  clearConversations: () => void
  updateConversationTitle: (id: string, title: string) => void
}

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversation: undefined,

      addConversation: (title) => {
        const id = crypto.randomUUID()
        set((state) => ({
          conversations: [
            {
              id,
              title,
              messages: [],
              timestamp: new Date(),
            },
            ...state.conversations,
          ],
          activeConversation: id,
        }))
        return id
      },

      addMessage: (conversationId, message) => {
        const state = get()
        const conversation = state.conversations.find(c => c.id === conversationId)
        
        // Check if message already exists
        if (conversation?.messages.some(m => 
          m.role === message.role && 
          m.content === message.content &&
          new Date(m.timestamp).getTime() > Date.now() - 5000
        )) {
          return // Skip if message was added in last 5 seconds
        }

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    {
                      ...message,
                      id: crypto.randomUUID(),
                      timestamp: new Date(),
                    },
                  ],
                }
              : conv
          ),
        }))
      },

      setActiveConversation: (id) => {
        set({ activeConversation: id })
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          activeConversation:
            state.activeConversation === id ? undefined : state.activeConversation,
        }))
      },

      clearConversations: () => {
        set({ conversations: [], activeConversation: undefined })
      },

      updateConversationTitle: (id, title) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? {
                  ...conv,
                  title,
                }
              : conv
          ),
        }))
      },
    }),
    {
      name: 'conversation-store',
      version: 1,
    }
  )
)
