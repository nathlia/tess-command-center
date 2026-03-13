import { useState, useRef } from 'react'

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [listening, setListening] = useState(false)
  const recognRef = useRef<SpeechRecognition | null>(null)

  function toggle() {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition

    if (!SR) {
      // Gracefully degrade — no-op in unsupported browsers
      return
    }

    if (listening && recognRef.current) {
      recognRef.current.stop()
      setListening(false)
      return
    }

    const r = new SR()
    r.continuous = false
    r.interimResults = false
    r.lang = 'en-US'
    r.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0]?.[0]?.transcript ?? ''
      if (text) onTranscript(text)
    }
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    recognRef.current = r
    r.start()
    setListening(true)
  }

  return { listening, toggle }
}
