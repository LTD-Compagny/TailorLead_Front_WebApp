import { useState, useEffect } from 'react'
import HeaderResults from '../components/results/HeaderResults'
import FiltersSidebar from '../components/results/FiltersSidebar'
import CompanyCard from '../components/results/CompanyCard'
import AISuggestions from '../components/results/AISuggestions'
import MiniResultsMap from '../components/results/MiniResultsMap'
import MapModal from '../components/results/MapModal'
import { loadSearchResults, type SearchResult } from '../data/loadData'

export default function Results() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [refinementQuery, setRefinementQuery] = useState('')
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [companiesWithCoords, setCompaniesWithCoords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    <div className="h-screen bg-[#F5F7FA] flex overflow-hidden">
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
          <div className="flex items-start gap-0 border-b border-[#E1E5EB]">
            {/* Left side: Logo + Prompt avec background Landing */}
            <div className="flex flex-col gap-4 flex-1 p-4 bg-[#0d1b2a] relative overflow-hidden">
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
                  className="flex-1 px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#4dafff] transition-all duration-150"
                />
              </div>

              {/* Bottom: Suggestions List */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white/60 text-xs font-medium mr-2">Suggestions :</span>
                {[
                  'CA > 5M€',
                  'Effectif > 30',
                  'Secteur: Tech',
                  'Création > 2020',
                  'Paris',
                  'Valorisation > 10M€',
                  'Forme: SAS',
                  'NAF: 6201Z'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setRefinementQuery(refinementQuery ? `${refinementQuery} ${suggestion}` : suggestion)}
                    className="px-3 py-1.5 text-xs font-medium text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-sm transition-all duration-150 hover:border-white/30 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Mini Carte */}
            <div className="w-[400px] h-[200px] border-l border-white/10">
              <MiniResultsMap 
                companies={searchResults} 
                onOpenFullMap={() => setIsMapModalOpen(true)}
                onCompaniesGeocoded={setCompaniesWithCoords}
              />
            </div>
          </div>

          {/* Suggestions AI Section - Now below the prompt */}
          <div className="p-4">
            <h3 className="text-xs font-bold text-[#4B4F5C] uppercase mb-3">Suggestions IA</h3>
            <div className="grid grid-cols-4 gap-3">
              {/* Suggestion 1 */}
              <div className="flex flex-col gap-2 px-3 py-3 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">Modification</div>
                  <div className="text-[11px] font-medium text-[#1A1C20] mb-1">CA + 5M</div>
                  <div className="text-[10px] font-bold text-green-600">+30% de résultats</div>
                </div>
                <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                  Exécuter
                </button>
              </div>

              {/* Suggestion 2 */}
              <div className="flex flex-col gap-2 px-3 py-3 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">Modification</div>
                  <div className="text-[11px] font-medium text-[#1A1C20] mb-1">Effectif = 30</div>
                  <div className="text-[10px] font-bold text-green-600">+50% de résultats</div>
                </div>
                <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                  Exécuter
                </button>
              </div>

              {/* Suggestion 3 */}
              <div className="flex flex-col gap-2 px-3 py-3 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">Modification</div>
                  <div className="text-[11px] font-medium text-[#1A1C20] mb-1">Secteur: Tech</div>
                  <div className="text-[10px] font-bold text-green-600">+25% de résultats</div>
                </div>
                <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                  Exécuter
                </button>
              </div>

              {/* Suggestion 4 */}
              <div className="flex flex-col gap-2 px-3 py-3 border border-[#E1E5EB] bg-[#F5F7FA] hover:bg-[#E8ECF0] transition-colors">
                <div>
                  <div className="text-[10px] text-gray-500 mb-1">Modification</div>
                  <div className="text-[11px] font-medium text-[#1A1C20] mb-1">Création {'>'} 2020</div>
                  <div className="text-[10px] font-bold text-green-600">+15% de résultats</div>
                </div>
                <button className="w-full px-3 py-1.5 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-[10px] font-medium hover:bg-[#1a2d42] transition-colors">
                  Exécuter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white border-b border-[#E1E5EB]">
          {/* Filtres de recherches */}
          <div className="p-4 border-b border-[#E1E5EB]">
            <h3 className="text-xs font-bold text-[#1A1C20] uppercase mb-3">Filtres de recherches</h3>
            <div className="flex gap-4">
              {/* Placeholder pour les filtres de recherche */}
              <div className="text-xs text-[#4B4F5C]">Filtres à venir...</div>
            </div>
          </div>

          {/* Filtrer les Résultats */}
          <div className="p-4">
            <h3 className="text-xs font-bold text-[#1A1C20] uppercase mb-3">Filtrer les Résultats</h3>
            <div className="flex gap-4">
              {/* Placeholder pour les filtres de résultats */}
              <div className="text-xs text-[#4B4F5C]">Filtres à venir...</div>
            </div>
          </div>
        </div>

        {/* Map Modal */}
        <MapModal 
          companies={searchResults}
          companiesWithCoords={companiesWithCoords}
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
        />

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
  )
}
