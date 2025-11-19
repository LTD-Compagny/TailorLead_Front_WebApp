import { useState, FormEvent, KeyboardEvent, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'

// Déclaration des types globaux
declare global {
  interface Window {
    triggerMajorPulse?: () => void
  }
}

interface SearchBarProps {
  onTypingChange?: (isTyping: boolean) => void
}

export interface SearchBarRef {
  getInputElement: () => HTMLDivElement | null
}

/**
 * SearchBar avec états interactifs:
 * 
 * IDLE: bordure blanche 20% opacity, fond transparent
 * TYPING: bordure bleue électrique (#4dafff) avec pulse + glow subtil
 * SUBMIT: onde bleue verticale + burst de particules
 * 
 * Le glow est renforcé quand les pulses du BackgroundPulseLayer arrivent.
 */
const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(({ onTypingChange }, ref) => {
  const [searchValue, setSearchValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [pulseGlow, setPulseGlow] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Exposer l'élément conteneur via ref
  useImperativeHandle(ref, () => ({
    getInputElement: () => containerRef.current,
  }))

  // Détecte quand l'utilisateur tape
  useEffect(() => {
    const typing = searchValue.length > 0
    setIsTyping(typing)
    onTypingChange?.(typing)
  }, [searchValue, onTypingChange])

  // Effet de glow périodique quand on tape (simule l'arrivée des pulses)
  useEffect(() => {
    if (!isTyping) return

    const glowInterval = setInterval(() => {
      setPulseGlow(true)
      setTimeout(() => setPulseGlow(false), 150)
    }, 800)

    return () => clearInterval(glowInterval)
  }, [isTyping])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return

    console.log('Recherche soumise:', searchValue)
    
    // Déclencher le major pulse (beam + multiple pulses)
    if (window.triggerMajorPulse) {
      window.triggerMajorPulse()
    }
    
    // Déclencher l'animation de burst local
    setShowBurst(true)

    setTimeout(() => {
      setShowBurst(false)
    }, 1000)

    // TODO: Intégrer l'API TailorLead ici
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Burst effect (cercles qui partent du prompt) */}
      {showBurst && (
        <>
          <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-burst-1 pointer-events-none" />
          <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-burst-2 pointer-events-none" />
        </>
      )}

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full flex justify-center">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            if (window.triggerMinorPulse) {
              window.triggerMinorPulse()
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter your best Screening Wishlist"
          className={`
            w-[75vw] max-w-[1100px] min-w-[350px] px-6 py-4 rounded-xl backdrop-blur-md 
            bg-white/10 text-white placeholder-white/50 text-lg
            focus:outline-none transition-all duration-150 shadow-2xl
            ${
              isTyping
                ? 'border border-[rgba(120,180,255,0.35)]'
                : 'border border-white/20'
            }
          `}
          style={{
            boxShadow: pulseGlow
              ? '0 0 8px rgba(120,180,255,0.25)'
              : undefined,
          }}
        />
      </form>
    </div>
  )
})

SearchBar.displayName = 'SearchBar'

export default SearchBar

