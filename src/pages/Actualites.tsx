import { useState, useMemo } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'
import NewsHeaderIA from '../components/news/NewsHeaderIA'
import NewsSearchBar from '../components/news/NewsSearchBar'
import BODACCNewsList from '../components/news/BODACCNewsList'
import CFNewsList from '../components/news/CFNewsList'
import { mockNews, type NewsItem } from '../data/mockNews'

export default function Actualites() {
  const [query, setQuery] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const filteredNews = useMemo(() => {
    if (!query.trim()) {
      return mockNews
    }

    const searchLower = query.toLowerCase().trim()

    return mockNews.filter((item) => {
      // Search in company names
      if (item.companies && item.companies.toLowerCase().includes(searchLower)) {
        return true
      }

      // Search in title
      if (item.title.toLowerCase().includes(searchLower)) {
        return true
      }

      // Search in category
      if (item.category.toLowerCase().includes(searchLower)) {
        return true
      }

      // Search in SIREN (if provided in companies string, or we can add a siren field)
      // For now, searching in companies string should cover it

      return false
    })
  }, [query])

  const handleSearch = (searchQuery: string) => {
    // Search is already handled by filteredNews useMemo
    // This function can be extended for API calls in the future
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="h-screen bg-[#F7F9FC] flex overflow-hidden">
      {/* Sidebar */}
      <FiltersSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <NewsHeaderIA />

        {/* Search Bar */}
        <NewsSearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
        />

        {/* Two Columns: BODACC + CFNews */}
        <div className="flex-1 flex gap-6 p-6 overflow-y-auto">
          {/* Left Column: BODACC */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-[#1A1C20] uppercase mb-4">Actualités BODACC</h2>
            <BODACCNewsList news={filteredNews} />
          </div>

          {/* Right Column: CFNews */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-[#1A1C20] uppercase mb-4">Actualités CFNews</h2>
            <CFNewsList />
          </div>
        </div>
      </div>
    </div>
  )
}

