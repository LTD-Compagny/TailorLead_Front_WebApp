import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeaderResults from '../components/results/HeaderResults'
import FiltersSidebar from '../components/results/FiltersSidebar'
import CompanyCard from '../components/results/CompanyCard'
import AISuggestions from '../components/results/AISuggestions'
import MiniResultsMap from '../components/results/MiniResultsMap'
import MapModal from '../components/results/MapModal'
import { loadSearchResults, type SearchResult } from '../data/loadData'

export default function Results() {
  const location = useLocation()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [refinementQuery, setRefinementQuery] = useState('')
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [companiesWithCoords, setCompaniesWithCoords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [showRefinementSection, setShowRefinementSection] = useState(true)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedAdditionalFilters, setSelectedAdditionalFilters] = useState<string[]>([])
  const [appliedAdditionalFilters, setAppliedAdditionalFilters] = useState<string[]>([]) // Filtres supplémentaires appliqués
  const [isTransitioning, setIsTransitioning] = useState(true)

  // Animation d'entrée au chargement de la page
  useEffect(() => {
    // Scroll vers le haut avec animation fluide
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Démarrer l'animation d'entrée après un court délai
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 100)

    return () => {
      clearTimeout(timer)
      // Réinitialiser l'animation quand on change de route
      setIsTransitioning(true)
    }
  }, [location.pathname])

  // Filtres pré-remplis par l'IA
  const [filters, setFilters] = useState({
    caMin: '5000000',
    effectifMin: '30',
    secteur: 'Tech',
    dateCreationMin: '2020-01-01',
    formeJuridique: 'SAS',
    codeNAF: '6201Z'
  })

  // Liste des filtres supplémentaires disponibles
  const additionalFilters = [
    { id: 'trancheEffectif', label: 'Tranche d\'effectif' },
    { id: 'trancheCA', label: 'Tranche de CA' },
    { id: 'region', label: 'Région' },
    { id: 'departement', label: 'Département' },
    { id: 'codePostal', label: 'Code postal' },
    { id: 'activitePrincipale', label: 'Activité principale' },
    { id: 'statut', label: 'Statut' },
    { id: 'dateDerniereModification', label: 'Date dernière modification' },
    { id: 'capitalMin', label: 'Capital minimum' },
    { id: 'capitalMax', label: 'Capital maximum' }
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadSearchResults()
        setSearchResults(data.results || [])
        setLoading(false)
      } catch (error) {
        console.error('Error loading search results:', error)
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <>
      <div 
        className={`h-screen bg-[#F5F7FA] flex overflow-hidden ${
          isTransitioning 
            ? '' 
            : 'animate-slide-in-from-bottom'
        }`}
        style={{
          animation: isTransitioning ? 'slideInFromBottom 0.8s ease-out forwards' : undefined
        }}
      >
        {/* Sidebar */}
        <FiltersSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <HeaderResults />

        {/* Refinement Section */}
        <div className="bg-white border-b border-[#E1E5EB]">
          {/* Header avec Logo, Prompt et Carte minimaliste à droite */}
          {showRefinementSection && (
            <div className="flex items-stretch gap-0 border-b border-[#E1E5EB]">
              {/* Left side: Logo + Prompt avec background gris */}
              <div className="flex flex-col gap-4 p-4 bg-[#F5F7FA] relative overflow-hidden min-h-[200px] w-1/2">
                {/* Top: Logo + Prompt */}
                <div className="flex items-center gap-4">
                  {/* TailorLead AI Logo */}
                  <AISuggestions />

                  {/* Refinement Prompt */}
                  <input
                    type="text"
                    value={refinementQuery}
                    onChange={(e) => setRefinementQuery(e.target.value)}
                    placeholder="Affiner votre recherche..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#E1E5EB] text-[#1A1C20] placeholder-[#4B4F5C] text-sm focus:outline-none focus:border-[#0d1b2a] transition-all duration-150"
                  />
                </div>

                {/* Bottom: Suggestions en tableau scrollable */}
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#4B4F5C] text-xs font-medium whitespace-nowrap">Suggestions :</span>
                  </div>
                  <div className="max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#E1E5EB] scrollbar-track-transparent">
                    <table className="w-full border-collapse">
                      <tbody>
                        {[
                          'Entreprises avec un CA supérieur à 5 millions d\'euros',
                          'Sociétés ayant plus de 30 employés',
                          'Entreprises du secteur de la technologie',
                          'Sociétés créées après 2020',
                          'Entreprises situées à Paris',
                          'Sociétés avec une valorisation supérieure à 10 millions d\'euros',
                          'Entreprises sous forme juridique SAS',
                          'Sociétés avec code NAF 6201Z',
                          'Sociétés avec seulement 2 établissements',
                          'Entreprises avec un capital minimum de 50 000€'
                        ].map((suggestion, index) => (
                          <tr
                            key={index}
                            className="border-b border-[#E1E5EB] hover:bg-[#E8ECF0] transition-colors cursor-pointer"
                            onClick={() => setRefinementQuery(refinementQuery ? `${refinementQuery} ${suggestion}` : suggestion)}
                          >
                            <td className="px-3 py-2 text-xs font-medium text-[#1A1C20]">
                              {suggestion}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right side: Mini Carte */}
              <div className="w-1/2 border-l border-[#E1E5EB] flex items-stretch">
                <div className="w-full h-full">
                  <MiniResultsMap 
                    companies={searchResults} 
                    onOpenFullMap={() => setIsMapModalOpen(true)}
                    onCompaniesGeocoded={setCompaniesWithCoords}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Suggestions AI Section - Now below the prompt */}
          {showRefinementSection && (
            <div className="p-4">
              <h3 className="text-xs font-bold text-[#4B4F5C] uppercase mb-3">Suggestions IA</h3>
              <div className="grid grid-cols-4 gap-3">
                {/* Suggestion 1 */}
                <div className="flex flex-col gap-1 px-3 py-2 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                  <div>
                    <div className="text-[11px] font-medium text-[#1A1C20] mb-1">CA + 5M</div>
                    <div className="text-[10px] font-bold text-green-600">+30% de résultats</div>
                  </div>
                  <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                    Exécuter
                  </button>
                </div>

                {/* Suggestion 2 */}
                <div className="flex flex-col gap-1 px-3 py-2 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                  <div>
                    <div className="text-[11px] font-medium text-[#1A1C20] mb-1">Effectif = 30</div>
                    <div className="text-[10px] font-bold text-green-600">+50% de résultats</div>
                  </div>
                  <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                    Exécuter
                  </button>
                </div>

                {/* Suggestion 3 */}
                <div className="flex flex-col gap-1 px-3 py-2 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                  <div>
                    <div className="text-[11px] font-medium text-[#1A1C20] mb-1">Secteur: Tech</div>
                    <div className="text-[10px] font-bold text-green-600">+25% de résultats</div>
                  </div>
                  <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                    Exécuter
                  </button>
                </div>

                {/* Suggestion 4 */}
                <div className="flex flex-col gap-1 px-3 py-2 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                  <div>
                    <div className="text-[11px] font-medium text-[#1A1C20] mb-1">Création {'>'} 2020</div>
                    <div className="text-[10px] font-bold text-green-600">+15% de résultats</div>
                  </div>
                  <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                    Exécuter
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters Section */}
        {showRefinementSection && (
          <div className="bg-white border-b border-[#E1E5EB]">
            {/* Filtres de recherches */}
            <div className="p-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowFiltersModal(true)
                  // Ne pas cacher la section de recherche
                }}
                className="w-full px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors text-left"
              >
                Afficher les Filtres de Recherche
              </button>
              {/* Flèche en dessous du bouton - pour cacher/montrer */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowRefinementSection(false)
                }}
                className="flex items-center justify-center mt-2 w-full hover:bg-[#F5F7FA] transition-colors p-1"
                aria-label="Masquer"
              >
                <svg
                  className="w-4 h-4 text-[#4B4F5C]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Bouton pour afficher la section (quand elle est cachée) */}
        {!showRefinementSection && (
          <div className="bg-white border-b border-[#E1E5EB]">
            <div className="flex items-center justify-center p-2">
              <button
                onClick={() => setShowRefinementSection(true)}
                className="p-2 hover:bg-[#F5F7FA] transition-colors"
                aria-label="Afficher"
              >
                <svg
                  className="w-4 h-4 text-[#4B4F5C] rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}


        {/* Results Banner */}
        <div className="bg-white border-b border-[#E1E5EB] py-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#1A1C20]">Résultats TailorLead</h2>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 p-4 space-y-4 overflow-auto bg-[#F5F7FA]">
          {loading ? (
            <div className="text-sm text-gray-600">Chargement...</div>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-4">
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
              </div>
              {searchResults.map((company) => (
                <CompanyCard key={company.siren} company={company} />
              ))}
            </>
          )}
        </div>
        </div>
      </div>

      {/* Modal pour les filtres */}
      {showFiltersModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowFiltersModal(false)}
        >
          <div
            className="bg-white w-[90vw] max-w-[800px] max-h-[90vh] overflow-y-auto border border-[#E1E5EB]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header du modal */}
            <div className="flex items-center justify-between p-4 border-b border-[#E1E5EB]">
              <h2 className="text-lg font-bold text-[#1A1C20]">Filtres de Recherche</h2>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="px-3 py-1 text-sm text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
              >
                ✕ Fermer
              </button>
            </div>

            {/* Contenu du modal - Filtres pré-remplis par l'IA */}
            <div className="p-6">
              <div className="mb-3">
                <span className="text-xs text-[#4B4F5C] italic">Filtres suggérés par l'IA</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* CA Minimum */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                    CA Minimum (€)
                  </label>
                  <input
                    type="number"
                    value={filters.caMin}
                    onChange={(e) => setFilters({ ...filters, caMin: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a]"
                    placeholder="5000000"
                  />
                </div>

                {/* Effectif Minimum */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                    Effectif Minimum
                  </label>
                  <input
                    type="number"
                    value={filters.effectifMin}
                    onChange={(e) => setFilters({ ...filters, effectifMin: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a]"
                    placeholder="30"
                  />
                </div>

                {/* Secteur */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                    Secteur
                  </label>
                  <input
                    type="text"
                    value={filters.secteur}
                    onChange={(e) => setFilters({ ...filters, secteur: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a]"
                    placeholder="Tech"
                  />
                </div>

                {/* Date de création */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                    Date de création (min)
                  </label>
                  <input
                    type="date"
                    value={filters.dateCreationMin}
                    onChange={(e) => setFilters({ ...filters, dateCreationMin: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a]"
                  />
                </div>

                {/* Forme juridique */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                    Forme juridique
                  </label>
                  <input
                    type="text"
                    value={filters.formeJuridique}
                    onChange={(e) => setFilters({ ...filters, formeJuridique: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a]"
                    placeholder="SAS"
                  />
                </div>

                {/* Code NAF */}
                <div>
                  <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                    Code NAF
                  </label>
                  <input
                    type="text"
                    value={filters.codeNAF}
                    onChange={(e) => setFilters({ ...filters, codeNAF: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a]"
                    placeholder="6201Z"
                  />
                </div>
              </div>

              {/* Liste déroulante "Plus de filtres" */}
              {showMoreFilters && (
                <div className="mt-4 p-4 border border-[#E1E5EB] bg-[#F5F7FA] relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-[#1A1C20]">Filtres supplémentaires</h3>
                    {selectedAdditionalFilters.length > 0 && (
                      <button
                        onClick={() => {
                          // Ajouter les filtres sélectionnés aux filtres appliqués
                          setAppliedAdditionalFilters([...appliedAdditionalFilters, ...selectedAdditionalFilters])
                          // Vider la sélection
                          setSelectedAdditionalFilters([])
                          // Les filtres sont maintenant dans appliedAdditionalFilters et seront pris en compte lors de l'application des filtres
                          console.log('Filtres ajoutés:', selectedAdditionalFilters)
                        }}
                        className="px-3 py-1.5 bg-[#0d1b2a] text-white text-xs font-medium hover:bg-[#1a2d42] transition-colors"
                      >
                        Ajouter les Filtres
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {additionalFilters.map((filter) => (
                      <label
                        key={filter.id}
                        className="flex items-center gap-2 p-2 hover:bg-white transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAdditionalFilters.includes(filter.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAdditionalFilters([...selectedAdditionalFilters, filter.id])
                            } else {
                              setSelectedAdditionalFilters(selectedAdditionalFilters.filter(id => id !== filter.id))
                            }
                          }}
                          className="w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-[#0d1b2a]"
                        />
                        <span className="text-sm text-[#1A1C20]">{filter.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#E1E5EB]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // TODO: Appliquer les filtres
                    console.log('Appliquer les filtres:', filters)
                    console.log('Filtres supplémentaires sélectionnés:', selectedAdditionalFilters)
                    console.log('Filtres supplémentaires appliqués:', appliedAdditionalFilters)
                    // Fermer le modal seulement, ne pas cacher la section de recherche
                    setShowFiltersModal(false)
                  }}
                  className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                >
                  Appliquer les filtres
                </button>
                <button
                  onClick={() => setShowMoreFilters(!showMoreFilters)}
                  className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                >
                  {showMoreFilters ? 'Moins de filtres' : 'Plus de filtres'}
                </button>
                <button
                  onClick={() => {
                    setFilters({
                      caMin: '5000000',
                      effectifMin: '30',
                      secteur: 'Tech',
                      dateCreationMin: '2020-01-01',
                      formeJuridique: 'SAS',
                      codeNAF: '6201Z'
                    })
                    setSelectedAdditionalFilters([])
                    setAppliedAdditionalFilters([]) // Réinitialiser aussi les filtres supplémentaires appliqués
                  }}
                  className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Fermer le modal seulement, ne pas cacher la section de recherche
                    setShowFiltersModal(false)
                  }}
                  className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors ml-auto"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      <MapModal 
        companies={searchResults}
        companiesWithCoords={companiesWithCoords}
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
      />
    </>
  )
}
