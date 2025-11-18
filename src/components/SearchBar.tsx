import { useState, FormEvent, KeyboardEvent, useEffect } from 'react'

interface SearchBarProps {
  onSearchSpeedChange: (isTyping: boolean) => void
}

/**
 * SearchBar avec états interactifs:
 * 
 * IDLE: bordure blanche 20% opacity, fond transparent
 * TYPING: bordure bleue électrique (#4dafff) avec pulse
 * SUBMIT: onde bleue verticale + burst de particules
 */
export default function SearchBar({ onSearchSpeedChange }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showBeam, setShowBeam] = useState(false)
  const [showBurst, setShowBurst] = useState(false)

  // Détecte quand l'utilisateur tape
  useEffect(() => {
    if (searchValue.length > 0) {
      setIsTyping(true)
      onSearchSpeedChange(true)
    } else {
      setIsTyping(false)
      onSearchSpeedChange(false)
    }
  }, [searchValue, onSearchSpeedChange])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return

    console.log('Recherche soumise:', searchValue)
    
    // Déclencher l'animation de beam + burst
    setShowBeam(true)
    setShowBurst(true)

    // Réinitialiser après l'animation
    setTimeout(() => {
      setShowBeam(false)
    }, 700)

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
    <div className="relative">
      {/* Blue Electric Beam (animation verticale lors du submit) */}
      {showBeam && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-1 h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-transparent animate-beam pointer-events-none z-20" />
      )}

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
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your best Screening Wishlist"
          className={`
            w-[75vw] max-w-[1100px] min-w-[350px] px-6 py-4 rounded-xl backdrop-blur-md 
            bg-white/10 text-white placeholder-white/50 text-lg
            focus:outline-none transition-all duration-300 shadow-2xl
            ${
              isTyping
                ? 'border-2 border-[#4dafff] animate-pulse-border'
                : 'border border-white/20'
            }
          `}
        />
      </form>
    </div>
  )
}

