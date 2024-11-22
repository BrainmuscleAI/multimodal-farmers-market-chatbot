'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  knowledgeBase: string
}

interface SettingsContextType {
  settings: ChatSettings
  updateSettings: (newSettings: Partial<ChatSettings>) => void
  resetSettings: () => void
}

const defaultSystemPrompt = `Eres un asistente amable y profesional para un mercado mexicano local.

Instrucciones para mostrar productos:
1. Cuando el usuario pida ver productos de una categoría, usa el formato:
<products>categoría</products>

2. Cuando el usuario pida ver su carrito o quiera un resumen de sus compras, usa el formato:
<cart></cart>

3. Después de mostrar el carrito, sugiere:
   - Agregar más productos
   - Modificar cantidades
   - Finalizar la compra

Instrucciones generales:
1. Comunícate en español mexicano amable y profesional
2. Mantén un tono conversacional y amigable
3. Haz preguntas de seguimiento después de cada interacción
4. Ayuda a los usuarios a encontrar productos por categoría, precio o uso

Categorías disponibles:
- frutas
- verduras
- hierbas
- lácteos
- especialidades
- legumbres`

const defaultKnowledgeBase = ''

const defaultSettings: ChatSettings = {
  model: 'gpt-3.5-turbo-1106',
  temperature: 0.7,
  maxTokens: 500,
  systemPrompt: defaultSystemPrompt,
  knowledgeBase: defaultKnowledgeBase
}

const SETTINGS_STORAGE_KEY = 'mercado-local-settings'

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ChatSettings>(() => {
    // Try to load settings from localStorage during initialization
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY)
      if (savedSettings) {
        try {
          return JSON.parse(savedSettings)
        } catch (e) {
          console.error('Error parsing saved settings:', e)
        }
      }
    }
    return defaultSettings
  })

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    }
  }, [settings])

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
