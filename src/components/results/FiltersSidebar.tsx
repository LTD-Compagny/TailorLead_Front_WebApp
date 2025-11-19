import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavGroup {
  title: string
  items: Array<{
    label: string
    path: string
  }>
}

const navGroups: NavGroup[] = [
  {
    title: 'Mes Recherches',
    items: [
      { label: 'Recherche Globale', path: '/results' },
      { label: 'Analyse Entreprise', path: '/analyse-entreprise' },
    ],
  },
  {
    title: 'Mes Surveillances',
    items: [
      { label: 'Actualité', path: '/surveillance/actualite' },
      { label: 'Surveillance', path: '/surveillance' },
    ],
  },
  {
    title: 'Mes Sauvegardes',
    items: [
      { label: 'Mes Recherches (Personne Morale)', path: '/sauvegardes/recherches' },
      { label: 'Mes Listings (Personne Physique)', path: '/sauvegardes/listings' },
    ],
  },
  {
    title: 'Mon compte',
    items: [
      { label: 'Mes Réglages', path: '/compte/reglages' },
      { label: 'Mon abonnement', path: '/compte/abonnement' },
    ],
  },
]

interface FiltersSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export default function FiltersSidebar({ isCollapsed, onToggle }: FiltersSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [credits] = useState<number>(1250)

  if (isCollapsed) {
    return (
      <button
        onClick={onToggle}
        className="w-8 h-screen bg-white border-r border-[#E1E5EB] flex items-center justify-center hover:bg-[#F5F7FA] transition-colors"
      >
        <span className="text-sm font-bold text-[#1A1C20]">▶</span>
      </button>
    )
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-[#E1E5EB] flex flex-col">
      {/* Credits Section */}
      <div className="p-4 border-b border-[#E1E5EB]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-gray-600 uppercase">Mes crédits TailorLead</h3>
          <div className="flex items-center gap-2">
            <button
              className="w-6 h-6 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-sm font-bold hover:bg-[#1a2d42] transition-colors flex items-center justify-center"
              onClick={() => {
                // TODO: Ouvrir modal d'achat de crédits
                console.log('Acheter des crédits')
              }}
            >
              +
            </button>
            <button
              onClick={onToggle}
              className="w-6 h-6 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-bold hover:bg-[#F5F7FA] transition-colors flex items-center justify-center"
            >
              ◀
            </button>
          </div>
        </div>
        <div className="text-2xl font-bold text-[#1A1C20]">{credits.toLocaleString('fr-FR')}</div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">{group.title}</h4>
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`
                      w-full text-left px-3 py-2 text-sm font-medium transition-colors
                      ${
                        location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                          ? 'bg-[#0d1b2a] text-white'
                          : 'text-[#1A1C20] hover:bg-[#F5F7FA]'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
