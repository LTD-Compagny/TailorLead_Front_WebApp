import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'
import SearchBarIA from '../components/analysis/SearchBarIA'
import CompaniesMap from '../components/analysis/CompaniesMap'
import CompaniesList from '../components/analysis/CompaniesList'
import TailorIAIconMiniNetwork from '../components/ia/TailorIAIconMiniNetwork'

interface FoundCompany {
  siren: string
  nom: string
  latitude: number | null
  longitude: number | null
  ville?: string
  code_naf?: string
  libelle_code_naf?: string
  date_creation?: string
  raw: any
}

type AnalysisMode = 'simple' | 'deepsearch'

export default function AnalyseEntreprise() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [companies, setCompanies] = useState<FoundCompany[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('simple')
  
  // Options DeepSearch
  const [deepSearchOptions, setDeepSearchOptions] = useState({
    bddTailorLead: false,
    web: false,
  })
  
  // Filtres pour DeepSearch
  const [filters, setFilters] = useState({
    caMin: '',
    effectifMin: '',
    secteur: '',
    dateCreationMin: '',
    formeJuridique: '',
    codeNAF: ''
  })

  const performSearch = async (_query: string) => {
    setLoading(true)
    setHasSearched(true)

    try {
      // Load CALLIOPE4M analysis JSON
      const response = await fetch('/mock/analyse_globale_calliope4m_887831725.json')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Données chargées:', data)

      // Extract company data from the analysis structure
      const pappers = data.data?.pappers
      console.log('📋 Données Pappers:', pappers)
      
      if (pappers) {
        const foundCompany: FoundCompany = {
          siren: pappers.siren || '',
          nom: pappers.nom_entreprise || pappers.denomination || 'CALLIOPE4M',
          latitude: pappers.siege?.latitude ? parseFloat(pappers.siege.latitude.toString()) : null,
          longitude: pappers.siege?.longitude ? parseFloat(pappers.siege.longitude.toString()) : null,
          ville: pappers.siege?.ville || '',
          code_naf: pappers.code_naf || '',
          libelle_code_naf: pappers.libelle_code_naf || '',
          date_creation: pappers.date_creation || '',
          raw: pappers,
        }

        console.log('✅ Entreprise trouvée:', foundCompany)
        setCompanies([foundCompany])
      } else {
        console.warn('⚠️ Aucune donnée Pappers trouvée')
        setCompanies([])
      }
    } catch (error) {
      console.error('❌ Error loading company analysis:', error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <FiltersSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Bandeaux d'onglets */}
        <div className="flex items-center border-b border-[#E1E5EB] bg-white">
          <button
            type="button"
            onClick={() => setAnalysisMode('simple')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              analysisMode === 'simple'
                ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
            }`}
          >
            Analyse simple
          </button>
          <button
            type="button"
            onClick={() => setAnalysisMode('deepsearch')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              analysisMode === 'deepsearch'
                ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
            }`}
          >
            Analyse DeepSearch
          </button>
        </div>

        {/* Container avec prompt et options DeepSearch (uniquement en mode DeepSearch) */}
        {analysisMode === 'deepsearch' ? (
          <div 
            className="relative w-full flex-1 flex flex-col border-b border-[#E1E5EB] border-t border-[#E1E5EB] bg-[#0d1b2a] overflow-y-auto particles-container"
          >
            {/* Background animé - Mini Network limité au conteneur */}
            <div 
              className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
              style={{ 
                opacity: 0.4,
                width: '100%',
                height: '100%'
              }}
            >
              <TailorIAIconMiniNetwork size="lg" fill={true} />
            </div>
            {/* Contenu */}
            <div className="relative z-10 flex flex-col p-6 gap-4">
              {/* Prompt et Suggestions en ligne */}
              <div className="flex items-start gap-4">
                {/* Prompt à gauche */}
                <div className="flex-1">
                  <SearchBarIA onSearch={performSearch} variant="dark" />
                </div>

                {/* Suggestions à droite */}
                <div className="flex flex-col gap-1.5 w-[300px] flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => performSearch("Trouve moi une entreprise d'AI avec un nom comme Tailorlead à Paris")}
                    className="w-full px-2.5 py-1 rounded-xl backdrop-blur-md bg-white/10 text-white/50 text-[10px] border border-white/20 focus:outline-none focus:border-white/40 transition-all duration-150 shadow-2xl text-left hover:bg-white/15"
                  >
                    Trouve moi une entreprise d'AI avec un nom comme Tailorlead à Paris
                  </button>
                  <button
                    type="button"
                    onClick={() => performSearch("Je cherche une société qui a été vendue à Mistral AI dans la tech à Paris avec un nom comme Tailor quelque chose")}
                    className="w-full px-2.5 py-1 rounded-xl backdrop-blur-md bg-white/10 text-white/50 text-[10px] border border-white/20 focus:outline-none focus:border-white/40 transition-all duration-150 shadow-2xl text-left hover:bg-white/15"
                  >
                    Je cherche une société qui a été vendue à Mistral AI dans la tech à Paris avec un nom comme Tailor quelque chose
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-2 justify-center group relative">
                  <h3 className="text-sm font-medium text-white/50 text-center">DeepSearch Selection</h3>
                  {/* Icône info */}
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full border border-gray-400 text-gray-400 text-[8px] flex items-center justify-center cursor-help">
                      i
                    </div>
                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      Choisir une ou plusieurs options de Recherches
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 justify-center">
                  {/* DeepSearch TailorLead */}
                  <div className="flex items-center gap-2 group relative">
                    <button
                      type="button"
                      onClick={() => setDeepSearchOptions({ ...deepSearchOptions, bddTailorLead: !deepSearchOptions.bddTailorLead })}
                      className={`px-2.5 py-1 rounded-xl backdrop-blur-md border transition-all duration-150 text-[10px] focus:outline-none shadow-2xl text-white/50 ${
                        deepSearchOptions.bddTailorLead
                          ? 'bg-white/25 border-white/40'
                          : 'bg-white/10 border-white/20'
                      }`}
                    >
                      DeepSearch TailorLead
                    </button>
                    {/* Icône info */}
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full border border-gray-400 text-gray-400 text-[8px] flex items-center justify-center cursor-help">
                        i
                      </div>
                      {/* Tooltip */}
                      <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        Recherche avec l'Agent TailorLead dans les Base de données connectées à tailorLead
                      </div>
                    </div>
                  </div>

                  {/* DeepSearch Web */}
                  <div className="flex items-center gap-2 group relative">
                    <button
                      type="button"
                      onClick={() => setDeepSearchOptions({ ...deepSearchOptions, web: !deepSearchOptions.web })}
                      className={`px-2.5 py-1 rounded-xl backdrop-blur-md border transition-all duration-150 text-[10px] focus:outline-none shadow-2xl text-white/50 ${
                        deepSearchOptions.web
                          ? 'bg-white/25 border-white/40'
                          : 'bg-white/10 border-white/20'
                      }`}
                    >
                      DeepSearch Web
                    </button>
                    {/* Icône info */}
                    <div className="relative">
                      <div className="w-3 h-3 rounded-full border border-gray-400 text-gray-400 text-[8px] flex items-center justify-center cursor-help">
                        i
                      </div>
                      {/* Tooltip */}
                      <div className="absolute left-0 top-full mt-2 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        Recherche grâce à l'agent Web Search TailorLead d'informations en ligne
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résultats dans le container */}
              {loading && (
                <div className="text-center py-12">
                  <p className="text-sm text-white">Recherche en cours...</p>
                </div>
              )}

              {!loading && hasSearched && (
                <div className="space-y-6 mt-4">
                  {/* List */}
                  <div>
                    <CompaniesList companies={companies} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <SearchBarIA onSearch={performSearch} />
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading && (
                <div className="text-center py-12">
                  <p className="text-sm text-[#4B4F5C]">Recherche en cours...</p>
                </div>
              )}

              {!loading && hasSearched && (
                <>
                  {/* Map */}
                  {companies.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-[#1A1C20] mb-4">Carte des entreprises</h2>
                      <CompaniesMap companies={companies} />
                    </div>
                  )}

                  {/* List */}
                  <div>
                    <h2 className="text-lg font-bold text-[#1A1C20] mb-4">Liste des entreprises</h2>
                    <CompaniesList companies={companies} />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

