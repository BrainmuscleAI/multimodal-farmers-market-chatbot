'use client'

import { useState, useEffect, useCallback } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'

interface TextToSpeechProps {
  text: string
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const newUtterance = new SpeechSynthesisUtterance(text)
    
    // Prefer Mexican Spanish voice if available
    const voices = window.speechSynthesis.getVoices()
    const mexicanVoice = voices.find(voice => voice.lang === 'es-MX')
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'))
    
    newUtterance.voice = mexicanVoice || spanishVoice || null
    newUtterance.lang = 'es-MX'
    newUtterance.rate = 1.0
    newUtterance.pitch = 1.0

    newUtterance.onend = () => {
      setIsSpeaking(false)
    }

    newUtterance.onerror = () => {
      setIsSpeaking(false)
    }

    setUtterance(newUtterance)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text])

  const toggleSpeech = useCallback(() => {
    if (!utterance) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      window.speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }, [utterance, isSpeaking])

  if (!utterance) return null

  return (
    <button
      onClick={toggleSpeech}
      className="mt-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      title={isSpeaking ? 'Detener lectura' : 'Leer mensaje'}
    >
      {isSpeaking ? (
        <SpeakerXMarkIcon className="h-5 w-5 text-gray-500" />
      ) : (
        <SpeakerWaveIcon className="h-5 w-5 text-gray-500" />
      )}
    </button>
  )
}
