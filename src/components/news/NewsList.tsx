import type { NewsItem } from '../../data/mockNews'

interface NewsListProps {
  news: NewsItem[]
}

export default function NewsList({ news }: NewsListProps) {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number | null): string => {
    if (!amount) return ''
    return `${amount.toLocaleString('fr-FR')} €`
  }

  // Sort: BODACC first (by date descending), then CFNews at bottom
  const sortedNews = [...news].sort((a, b) => {
    // CFNews always at bottom
    if (a.type === 'cfnews' && b.type !== 'cfnews') return 1
    if (a.type !== 'cfnews' && b.type === 'cfnews') return -1
    if (a.type === 'cfnews' && b.type === 'cfnews') return 0

    // BODACC sorted by date descending
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  if (sortedNews.length === 0) {
    return (
      <div className="p-6 bg-white border border-[#E1E5EB]">
        <p className="text-sm text-[#4B4F5C]">Aucune actualité trouvée.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedNews.map((item) => (
        <div key={item.id} className="border border-[#E1E5EB] bg-white p-4 space-y-2">
          {/* Header: Date + Type Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {item.date && (
                <span className="text-sm text-[#4B4F5C]">{formatDate(item.date)}</span>
              )}
              <span
                className={`px-2 py-1 text-xs font-medium ${
                  item.type === 'bodacc'
                    ? 'bg-[#374151] text-white'
                    : 'bg-[#3A6FF7] text-white'
                }`}
              >
                {item.type.toUpperCase()}
              </span>
              {item.category && (
                <span className="text-xs text-[#4B4F5C]">{item.category}</span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-[#1A1C20]">{item.title}</h3>

          {/* Companies */}
          {item.companies && (
            <div>
              <span className="text-xs text-[#4B4F5C] font-medium">Entreprises :</span>{' '}
              <span className="text-sm text-[#1A1C20]">{item.companies}</span>
            </div>
          )}

          {/* Location */}
          {(item.city || item.department) && (
            <div>
              <span className="text-xs text-[#4B4F5C] font-medium">Localisation :</span>{' '}
              <span className="text-sm text-[#1A1C20]">
                {[item.city, item.department].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Activity */}
          {item.activity && (
            <div>
              <span className="text-xs text-[#4B4F5C] font-medium">Activité :</span>{' '}
              <span className="text-sm text-[#1A1C20]">{item.activity}</span>
            </div>
          )}

          {/* Amount */}
          {item.amount && (
            <div>
              <span className="text-xs text-[#4B4F5C] font-medium">Montant :</span>{' '}
              <span className="text-sm font-semibold text-[#1A1C20]">{formatAmount(item.amount)}</span>
            </div>
          )}

          {/* Details/Description */}
          {item.details && (
            <div className="pt-2 border-t border-[#E1E5EB]">
              <p className="text-sm text-[#4B4F5C] leading-relaxed">{item.details}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

