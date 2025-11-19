import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'
import SearchBarIA from '../components/analysis/SearchBarIA'
import CompaniesMap from '../components/analysis/CompaniesMap'
import CompaniesList from '../components/analysis/CompaniesList'

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

export default function AnalyseEntreprise() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [companies, setCompanies] = useState<FoundCompany[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)

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
        {/* Search Bar */}
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
      </div>
    </div>
  )
}

