import { useState, useRef } from 'react'
import PremiumNetwork from '../components/PremiumNetwork'
import BackgroundPulseLayer from '../components/BackgroundPulseLayer'
import SearchBar, { SearchBarRef } from '../components/SearchBar'
import ExampleCarousel from '../components/ExampleCarousel'

/**
 * Landing Page TailorLead
 * 
 * Layout:
 * 1. PremiumNetwork (fond animé statique, z-index -10)
 * 2. BackgroundPulseLayer (pulses lumineux, z-index -5)
 * 3. Hero section en haut (titre + slogan animé)
 * 4. SearchBar centré avec animations interactives
 * 5. ExampleCarousel sous le prompt
 * 
 * Le background ne re-render JAMAIS, seuls les pulses réagissent au typing.
 */
export default function Landing() {
  const [isTyping, setIsTyping] = useState(false)
  const searchBarRef = useRef<SearchBarRef>(null)

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0d1b2a]">
      {/* Fond animé statique (ne re-render jamais) */}
      <PremiumNetwork />

      {/* Layer de pulses lumineux (réagit au typing) */}
      <BackgroundPulseLayer 
        isTyping={isTyping}
        promptRef={{
          current: searchBarRef.current?.getInputElement() || null
        }}
      />

      {/* Hero Section en haut */}
      <div className="absolute top-8 md:top-12 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-white/60 font-bold text-4xl md:text-5xl mb-3 font-sora">
          TailorLead
        </h1>
        <p className="text-white/50 text-lg md:text-xl font-light animate-slide-left-fade-in">
          Less tasks, more value.
        </p>
      </div>

      {/* Bouton Connexion en haut à droite */}
      <div className="absolute top-4 md:top-6 right-6 md:right-8 z-20">
        <button
          className="px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 text-white text-xs font-medium hover:bg-white/20 border border-white/20 transition-all duration-150 shadow-2xl focus:outline-none"
        >
          Connexion
        </button>
      </div>

      {/* Contenu principal centré */}
      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-4">
        {/* SearchBar + ExampleCarousel */}
        <div className="w-full max-w-[1100px] mx-auto flex flex-col items-center">
          <SearchBar 
            ref={searchBarRef}
            onTypingChange={setIsTyping}
          />
          <ExampleCarousel />
        </div>
      </div>
    </div>
  )
}

