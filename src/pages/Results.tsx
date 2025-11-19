import { useState } from 'react'
import HeaderResults from '../components/results/HeaderResults'
import FiltersSidebar from '../components/results/FiltersSidebar'
import CompanyCard from '../components/results/CompanyCard'

interface CompanyResult {
  siren: string
  name: string
  sector: string
  naf: string
  bodaccEvent: string
  pappersInfo: string
  cfnewsEvent: string
  score: number
}

const mockResults: CompanyResult[] = [
  {
    siren: '812345678',
    name: 'Société Alpha',
    sector: 'Logiciels B2B',
    naf: '6201Z - Programmation informatique',
    bodaccEvent: 'Changement de dirigeant (2024)',
    pappersInfo: 'SAS • Créée en 2017',
    cfnewsEvent: 'Levée de fonds série A (2024)',
    score: 78,
  },
  {
    siren: '912345678',
    name: 'Groupe Beta',
    sector: 'Industrie',
    naf: '2562B - Mécanique générale',
    bodaccEvent: 'Dépôt des comptes (2024)',
    pappersInfo: 'SARL • Créée en 2005',
    cfnewsEvent: 'Aucun deal recensé',
    score: 62,
  },
  {
    siren: '123456789',
    name: 'TechCorp Solutions',
    sector: 'Services IT',
    naf: '6202Z - Conseil en systèmes et logiciels informatiques',
    bodaccEvent: 'Augmentation de capital (2024)',
    pappersInfo: 'SAS • Créée en 2019',
    cfnewsEvent: 'Acquisition d\'une startup (2024)',
    score: 85,
  },
  {
    siren: '987654321',
    name: 'Manufacturing Plus',
    sector: 'Industrie manufacturière',
    naf: '2511Z - Fabrication de structures métalliques',
    bodaccEvent: 'Modification statuts (2024)',
    pappersInfo: 'SARL • Créée en 2010',
    cfnewsEvent: 'Partenariat stratégique (2024)',
    score: 71,
  },
]

export default function Results() {
  const [filteredResults, setFilteredResults] = useState<CompanyResult[]>(mockResults)

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <HeaderResults />
      <div className="flex w-full h-[calc(100vh-64px)]">
        <FiltersSidebar results={mockResults} onFilter={setFilteredResults} />
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="text-sm text-gray-600 mb-4">
            {filteredResults.length} résultat{filteredResults.length > 1 ? 's' : ''} trouvé{filteredResults.length > 1 ? 's' : ''}
          </div>
          {filteredResults.map((company) => (
            <CompanyCard key={company.siren} company={company} />
          ))}
        </div>
      </div>
    </div>
  )
}

