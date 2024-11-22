import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { useSettings } from '@/context/SettingsContext'

interface Conversation {
  id: string
  title: string
  date: string
}

export function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic')
  const [showSaved, setShowSaved] = useState(false)
  const [tempSettings, setTempSettings] = useState<ChatSettings | null>(null)
  const { settings, updateSettings, resetSettings } = useSettings()

  // Initialize temp settings when opening settings panel
  useEffect(() => {
    if (isSettingsOpen) {
      setTempSettings(settings)
    }
  }, [isSettingsOpen, settings])

  const handleSave = () => {
    if (tempSettings) {
      updateSettings(tempSettings)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    }
  }

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer toda la configuración a los valores predeterminados?')) {
      resetSettings()
      setTempSettings(settings)
    }
  }

  const handleSettingChange = (key: keyof ChatSettings, value: any) => {
    if (tempSettings) {
      setTempSettings({ ...tempSettings, [key]: value })
    }
  }

  // Show "Guardado" indicator briefly when settings change
  useEffect(() => {
    setShowSaved(true)
    const timer = setTimeout(() => setShowSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [settings])

  // Mock conversations - in a real app, these would come from a database
  const conversations: Conversation[] = [
    { id: '1', title: 'Verduras de temporada', date: '2023-11-20' },
    { id: '2', title: 'Frutas orgánicas', date: '2023-11-19' },
    { id: '3', title: 'Hierbas frescas', date: '2023-11-18' },
  ]

  return (
    <div className="w-64 h-screen flex flex-col fixed left-0 top-0 
      dark:bg-[#2a2b2e] bg-white
      dark:border-r dark:border-white/10 border-r border-gray-200
      dark:shadow-[5px_0_15px_#151618] shadow-[5px_0_15px_rgba(0,0,0,0.1)]"
    >
      {/* New Chat Button */}
      <Link 
        href="/"
        className="m-4 flex items-center justify-center gap-2 p-3 rounded-xl
          bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300
          shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
          transition-all duration-200 hover:bg-sky-200 dark:hover:bg-sky-900/40
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]
          active:scale-95"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Nueva Conversación
      </Link>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className="block p-3 rounded-xl
              dark:bg-[#1a1b1e] bg-gray-50
              dark:hover:bg-[#2d2e31] hover:bg-gray-100
              dark:text-white/90 text-gray-800
              transition-colors"
          >
            <div className="text-sm font-medium">{conv.title}</div>
            <div className="text-xs dark:text-white/60 text-gray-500">{conv.date}</div>
          </Link>
        ))}
      </div>

      {/* Settings and Theme */}
      <div className="p-4 border-t dark:border-white/10 border-gray-200">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full p-3 rounded-xl mb-2 flex items-center justify-between
            dark:bg-[#1a1b1e] bg-gray-50
            dark:hover:bg-[#2d2e31] hover:bg-gray-100
            dark:text-white/90 text-gray-800
            transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Configuración
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isSettingsOpen && (
          <div className="rounded-xl overflow-hidden
            dark:bg-[#1a1b1e] bg-gray-50
            dark:text-white/90 text-gray-800"
          >
            {/* Settings Tabs */}
            <div className="flex border-b dark:border-white/10 border-gray-200">
              <button
                onClick={() => setActiveTab('basic')}
                className={`flex-1 p-2 text-sm font-medium ${
                  activeTab === 'basic'
                    ? 'dark:bg-[#2d2e31] bg-gray-100'
                    : 'dark:hover:bg-[#2d2e31] hover:bg-gray-100'
                }`}
              >
                Básico
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`flex-1 p-2 text-sm font-medium ${
                  activeTab === 'advanced'
                    ? 'dark:bg-[#2d2e31] bg-gray-100'
                    : 'dark:hover:bg-[#2d2e31] hover:bg-gray-100'
                }`}
              >
                Avanzado
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Save Indicator */}
              <div className={`absolute top-2 right-2 transition-opacity duration-500 ${
                showSaved ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Guardado
                </span>
              </div>

              {activeTab === 'basic' ? (
                <>
                  <div>
                    <label className="text-sm font-medium">Modelo</label>
                    <select
                      value={tempSettings?.model}
                      onChange={(e) => handleSettingChange('model', e.target.value)}
                      className="mt-1 w-full p-2 rounded-lg text-sm
                        dark:bg-[#2a2b2e] dark:text-white dark:border-white/10
                        bg-white text-gray-800 border-gray-200
                        border"
                    >
                      <option value="gpt-3.5-turbo-1106">GPT-3.5 Turbo</option>
                      <option value="gpt-4-1106-preview">GPT-4 Turbo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Temperatura</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={tempSettings?.temperature}
                      onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                      className="mt-1 w-full"
                    />
                    <div className="text-xs text-center dark:text-white/60 text-gray-500">
                      {tempSettings?.temperature}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Máximo de tokens</label>
                    <input
                      type="number"
                      min="100"
                      max="4000"
                      step="100"
                      value={tempSettings?.maxTokens}
                      onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                      className="mt-1 w-full p-2 rounded-lg text-sm
                        dark:bg-[#2a2b2e] dark:text-white dark:border-white/10
                        bg-white text-gray-800 border-gray-200
                        border"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium">Prompt del sistema</label>
                    <textarea
                      value={tempSettings?.systemPrompt}
                      onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                      rows={6}
                      className="mt-1 w-full p-2 rounded-lg text-sm
                        dark:bg-[#2a2b2e] dark:text-white dark:border-white/10
                        bg-white text-gray-800 border-gray-200
                        border"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Base de conocimientos</label>
                    <textarea
                      value={tempSettings?.knowledgeBase}
                      onChange={(e) => handleSettingChange('knowledgeBase', e.target.value)}
                      rows={6}
                      className="mt-1 w-full p-2 rounded-lg text-sm
                        dark:bg-[#2a2b2e] dark:text-white dark:border-white/10
                        bg-white text-gray-800 border-gray-200
                        border"
                    />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t dark:border-white/10 border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex-1 p-2 rounded-lg text-sm font-medium
                    bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300
                    shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                    transition-all duration-200 hover:bg-sky-200 dark:hover:bg-sky-900/40
                    hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                    active:scale-95"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg text-sm font-medium
                    bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-300
                    hover:bg-rose-100 dark:hover:bg-rose-900/30
                    transition-colors"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
