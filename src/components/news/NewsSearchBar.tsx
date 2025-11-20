import { FormEvent } from 'react'

interface NewsSearchBarProps {
  query: string
  onQueryChange: (query: string) => void
  onSearch: (query: string) => void
}

export default function NewsSearchBar({ query, onQueryChange, onSearch }: NewsSearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4 p-6 bg-white border-b border-[#E1E5EB]">
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Recherchez une entreprise, un SIREN ou un mot-clé..."
        className="flex-1 px-4 py-3 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] transition-colors"
      />

      <button
        type="submit"
        className="px-6 py-3 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
      >
        Rechercher
      </button>
    </form>
  )
}

