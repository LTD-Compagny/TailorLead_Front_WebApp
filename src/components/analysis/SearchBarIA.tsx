import { useState, FormEvent } from 'react'

interface SearchBarIAProps {
  onSearch: (query: string) => void
}

export default function SearchBarIA({ onSearch }: SearchBarIAProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Toujours appeler onSearch, même si le champ est vide
    onSearch(query.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 p-6 bg-white border border-[#E1E5EB]">
      {/* Search Input - Now takes full width */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Recherchez une entreprise par nom, SIREN ou SIRET..."
        className="flex-1 px-4 py-3 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] transition-colors"
      />

      {/* Search Button */}
      <button
        type="submit"
        className="px-6 py-3 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
      >
        Rechercher
      </button>
    </form>
  )
}

