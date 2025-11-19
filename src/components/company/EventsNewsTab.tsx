interface EventsNewsTabProps {
  siren: string
}

interface BodaccEvent {
  date: string
  type: string
  description: string
  source: string
  reference: string
}

interface NewsItem {
  date: string
  title: string
  category: string
  source: string
  relevance: 'High' | 'Medium' | 'Low'
}

// Mock data
const mockBodaccEvents: BodaccEvent[] = [
  {
    date: '2024-03-15',
    type: 'Comptes annuels',
    description: 'Dépôt des comptes annuels 2023',
    source: 'BODACC',
    reference: 'BODACC-C-20240315-0001',
  },
  {
    date: '2024-01-20',
    type: 'Modification',
    description: 'Changement de dirigeant - Nomination CFO',
    source: 'BODACC',
    reference: 'BODACC-B-20240120-0045',
  },
  {
    date: '2023-12-05',
    type: 'Augmentation de capital',
    description: 'Augmentation de capital de 50M€',
    source: 'BODACC',
    reference: 'BODACC-C-20231205-0123',
  },
  {
    date: '2023-09-10',
    type: 'Modification',
    description: "Changement d'adresse du siège social",
    source: 'BODACC',
    reference: 'BODACC-B-20230910-0089',
  },
]

const mockNews: NewsItem[] = [
  {
    date: '2024-03-20',
    title: 'Schneider Electric acquires a majority stake in AutoGrid for smart grid solutions',
    category: 'M&A',
    source: 'CFNews',
    relevance: 'High',
  },
  {
    date: '2024-03-18',
    title: 'Q1 2024 Results: Revenue up 7.8% driven by data center demand',
    category: 'Financial Results',
    source: 'CFNews',
    relevance: 'High',
  },
  {
    date: '2024-03-10',
    title: 'Partnership with Microsoft for AI-powered energy management',
    category: 'Partnership',
    source: 'CFNews',
    relevance: 'Medium',
  },
  {
    date: '2024-02-28',
    title: 'Launch of new EcoStruxure platform for industrial automation',
    category: 'Product Launch',
    source: 'CFNews',
    relevance: 'Medium',
  },
  {
    date: '2024-02-15',
    title: 'Investment of €200M in Indian manufacturing facilities',
    category: 'Investment',
    source: 'CFNews',
    relevance: 'High',
  },
  {
    date: '2024-01-25',
    title: 'Schneider Electric named a Leader in Gartner Magic Quadrant',
    category: 'Award',
    source: 'CFNews',
    relevance: 'Low',
  },
]

export default function EventsNewsTab({ siren: _siren }: EventsNewsTabProps) {
  const getRelevanceBadge = (relevance: string) => {
    const colors = {
      High: 'bg-red-100 text-red-700 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Low: 'bg-green-100 text-green-700 border-green-200',
    }
    return colors[relevance as keyof typeof colors] || colors.Low
  }

  return (
    <div className="space-y-4">
      {/* BODACC Events */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">BODACC Events</h3>
          <span className="text-xs text-gray-600">{mockBodaccEvents.length} events</span>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Date</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Type</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Description</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Reference</th>
            </tr>
          </thead>
          <tbody>
            {mockBodaccEvents.map((event, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm text-gray-600">{event.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{event.type}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{event.description}</td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{event.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CFNews / Actualités */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">News & Deals (CFNews)</h3>
          <span className="text-xs text-gray-600">{mockNews.length} articles</span>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Date</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Title</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Category</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Relevance</th>
            </tr>
          </thead>
          <tbody>
            {mockNews.map((news, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm text-gray-600">{news.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{news.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{news.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium border ${getRelevanceBadge(news.relevance)}`}
                  >
                    {news.relevance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Total Events (12M)</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{mockBodaccEvents.length + mockNews.length}</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">BODACC Events</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{mockBodaccEvents.length}</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">News Articles</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{mockNews.length}</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">High Relevance</div>
          <div className="text-2xl font-bold text-[#3A6FF7]">
            {mockNews.filter((n) => n.relevance === 'High').length}
          </div>
        </div>
      </div>
    </div>
  )
}

