import { useState } from 'react'
import PremiumNetwork from '../components/PremiumNetwork'
import SearchBar from '../components/SearchBar'

/**
 * Landing Page TailorLead
 * 
 * Layout:
 * 1. PremiumNetwork (fond animé z-index -10)
 * 2. Header TailorLead en haut à gauche
 * 3. SearchBar centré avec animations interactives
 */
export default function Landing() {
  const [pulseSpeed, setPulseSpeed] = useState(1)

  const handleSearchSpeedChange = (isTyping: boolean) => {
    // Augmenter la vitesse des pulses de 20% quand l'utilisateur tape
    setPulseSpeed(isTyping ? 1.2 : 1)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d1b2a]">
      {/* Fond animé avec réseau directionnel */}
      <PremiumNetwork pulseSpeed={pulseSpeed} />

      {/* Header TailorLead en haut à gauche */}
      <header className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
        <h1 className="text-white font-bold text-2xl md:text-3xl tracking-wide mb-1">
          TailorLead
        </h1>
        <p className="text-white/60 text-sm md:text-base font-light">
          Where Data Becomes Deal Flow.
        </p>
      </header>

      {/* SearchBar centré */}
      <div className="relative z-10 flex items-center justify-center h-screen">
        <SearchBar onSearchSpeedChange={handleSearchSpeedChange} />
      </div>
    </div>
  )
}

