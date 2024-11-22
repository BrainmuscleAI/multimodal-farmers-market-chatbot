import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Message } from 'ai'

interface StoreState {
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage',
    }
  )
)
