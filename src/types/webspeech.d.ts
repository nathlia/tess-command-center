declare global {
  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void) | null
    onend: ((this: SpeechRecognition, event: Event) => void) | null
    onerror: ((this: SpeechRecognition, event: Event) => void) | null
    start(): void
    stop(): void
  }

  var SpeechRecognition: {
    prototype: SpeechRecognition
    new (): SpeechRecognition
  }

  interface Window {
    SpeechRecognition?: typeof SpeechRecognition
    webkitSpeechRecognition?: typeof SpeechRecognition
  }
}

export {}
