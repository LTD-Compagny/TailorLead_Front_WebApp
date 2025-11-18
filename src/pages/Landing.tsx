import { useState } from 'react'
import PremiumNetwork from '../components/PremiumNetwork'
import SearchBar from '../components/SearchBar'
import ExampleCarousel from '../components/ExampleCarousel'

/**
 * Landing Page TailorLead
 * 
 * Layout:
 * 1. PremiumNetwork (fond animé z-index -10)
 * 2. Header TailorLead en haut à gauche
 * 3. Hero section centré (titre + slogan animé)
 * 4. SearchBar centré avec animations interactives
 * 5. ExampleCarousel sous le prompt
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

      {/* Hero Section en haut */}
      <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-white/60 font-bold text-4xl md:text-5xl mb-3 font-sora">
          TailorLead
        </h1>
        <p className="text-white/50 text-lg md:text-xl font-light animate-slide-left-fade-in">
          Less tasks, more value.
        </p>
      </div>

      {/* Contenu principal centré */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        {/* SearchBar + ExampleCarousel */}
        <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center">
          <SearchBar onSearchSpeedChange={handleSearchSpeedChange} />
          <ExampleCarousel />
        </div>
      </div>
    </div>
  )
}

