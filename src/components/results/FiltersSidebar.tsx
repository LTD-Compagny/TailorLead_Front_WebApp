import { useState } from 'react'

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

interface FiltersSidebarProps {
  results: CompanyResult[]
  onFilter: (filtered: CompanyResult[]) => void
}

export default function FiltersSidebar({ results, onFilter }: FiltersSidebarProps) {
  const [minScore, setMinScore] = useState<number>(0)
  const [selectedSector, setSelectedSector] = useState<string>('all')

  const sectors = Array.from(new Set(results.map((r) => r.sector)))

  const handleScoreChange = (value: number) => {
    setMinScore(value)
    const filtered = results.filter((r) => r.score >= value)
    if (selectedSector !== 'all') {
      const sectorFiltered = filtered.filter((r) => r.sector === selectedSector)
      onFilter(sectorFiltered)
    } else {
      onFilter(filtered)
    }
  }

  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector)
    let filtered = results.filter((r) => r.score >= minScore)
    if (sector !== 'all') {
      filtered = filtered.filter((r) => r.sector === sector)
    }
    onFilter(filtered)
  }

  return (
    <div className="w-64 bg-white border-r border-[#E1E5EB] p-4">
      <h2 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Filtres</h2>

      {/* Score Filter */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-2 uppercase">
          Score minimum
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={minScore}
          onChange={(e) => handleScoreChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>0</span>
          <span className="font-bold text-[#1A1C20]">{minScore}</span>
          <span>100</span>
        </div>
      </div>

      {/* Sector Filter */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-2 uppercase">Secteur</label>
        <select
          value={selectedSector}
          onChange={(e) => handleSectorChange(e.target.value)}
          className="w-full border border-[#E1E5EB] px-3 py-2 text-sm bg-white text-[#1A1C20]"
        >
          <option value="all">Tous les secteurs</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setMinScore(0)
          setSelectedSector('all')
          onFilter(results)
        }}
        className="w-full px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
      >
        Réinitialiser
      </button>
    </div>
  )
}

