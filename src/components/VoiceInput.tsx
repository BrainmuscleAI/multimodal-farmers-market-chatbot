'use client'

import { useState, useCallback, useEffect } from 'react'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  isProcessing?: boolean
  className?: string
}

export function VoiceInput({ onTranscript, isProcessing, className = '' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'es-MX'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        setIsListening(false)
      }

      recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognition)
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [onTranscript])

  const toggleListening = useCallback(() => {
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }, [recognition, isListening])

  if (!recognition) {
    return null
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isProcessing}
      className={`p-2 rounded-md transition-colors ${
        isListening
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-blue-600 hover:bg-blue-700'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación'}
      type="button"
    >
      {isListening ? (
        <StopIcon className="h-6 w-6 text-white" />
      ) : (
        <MicrophoneIcon className="h-6 w-6 text-white" />
      )}
    </button>
  )
}
