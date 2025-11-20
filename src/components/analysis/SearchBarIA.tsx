import { useState, FormEvent } from 'react'

interface SearchBarIAProps {
  onSearch: (query: string) => void
  variant?: 'light' | 'dark' // Variant pour adapter le style
}

export default function SearchBarIA({ onSearch, variant = 'light' }: SearchBarIAProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Toujours appeler onSearch, même si le champ est vide
    onSearch(query.trim())
  }

  const isDark = variant === 'dark'

  return (
    <form 
      onSubmit={handleSubmit} 
      className={isDark ? 'w-full' : 'flex items-center gap-4 p-6 border bg-white border-[#E1E5EB]'}
    >
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Recherchez une entreprise par nom, SIREN ou SIRET..."
        className={`w-full border focus:outline-none transition-all duration-150 ${
          isDark
            ? 'px-4 py-2 rounded-xl backdrop-blur-md bg-white/10 text-white placeholder-white/50 text-sm border-white/20 focus:border-white/40 shadow-2xl'
            : 'px-4 py-3 border-[#E1E5EB] bg-white text-[#1A1C20] text-sm focus:border-[#0d1b2a]'
        }`}
      />
    </form>
  )
}

