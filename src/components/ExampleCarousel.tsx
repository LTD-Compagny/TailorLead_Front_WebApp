import { useEffect, useState } from 'react'

/**
 * ExampleCarousel - Carousel d'exemples de recherche sous le prompt
 * 
 * Effet amélioré avec bulles transparentes qui défilent :
 * - Chaque exemple est dans une bulle transparente
 * - Animation de défilement vertical où la suivante arrive de l'arrière-plan
 * - Transition douce avec scale + opacity + translateY
 */
const ExampleCarousel = () => {
  const examples = [
    "Rechercher les entreprises ayant eu un événement BODACC récent.",
    "Trouver des PME françaises dans le secteur de la biotech créées après 2020.",
    "Identifier des cibles d'acquisition dans le logiciel avec une forte croissance.",
    "Lister les entreprises avec des actionnaires actifs dans Pappers.",
    "Rechercher des sociétés avec plus de 10 salariés et un chiffre d'affaires > 5M€.",
    "Trouver des entreprises du secteur logistique avec une actualité CFNews récente.",
    "Rechercher les dirigeants à contacter dans les entreprises familiales.",
    "Identifier les sociétés à reprendre dans l'industrie en région Auvergne-Rhône-Alpes.",
    "Trouver les entreprises ayant levé des fonds récemment (Dealroom).",
    "Rechercher les sociétés proches du dépôt de bilan via les signaux BODACC.",
  ]

  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // Commence le fade out
      setFade(false)

      // Change l'index après le fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % examples.length)
        // Fade in
        setFade(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [examples.length])

  return (
    <div className="mt-6 h-14 flex justify-center items-center relative w-full">
      <div
        className="transition-opacity duration-500 ease-in-out"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <div className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
          <p className="text-center text-white/60 text-sm whitespace-nowrap">
            {examples[index]}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExampleCarousel
