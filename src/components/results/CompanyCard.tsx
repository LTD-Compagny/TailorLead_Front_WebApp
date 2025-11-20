import { useNavigate } from 'react-router-dom'
import type { SearchResult } from '../../data/loadData'
import AIBadge from '../ia/AIBadge'

interface CompanyCardProps {
  company: SearchResult
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const navigate = useNavigate()

  const getScoreBadgeClass = (badge: { bg: string; text: string; border: string; label: string }) => {
    // Classes adaptées pour background sombre avec animation
    const level = badge.label.toLowerCase()
    if (level === 'élevé' || level === 'high') {
      return 'text-blue-300 border-blue-400/30'
    }
    if (level === 'moyen' || level === 'medium') {
      return 'text-yellow-300 border-yellow-400/30'
    }
    if (level === 'faible' || level === 'low') {
      return 'text-orange-300 border-orange-400/30'
    }
    // Fallback
    return 'text-gray-300 border-gray-400/30'
  }

  const formatCapital = (capital: number) => {
    if (capital >= 1000000) {
      return `${(capital / 1000000).toFixed(1)}M€`
    }
    if (capital >= 1000) {
      return `${(capital / 1000).toFixed(0)}K€`
    }
    return `${capital.toFixed(0)}€`
  }

  return (
    <div className="bg-white border border-[#E1E5EB] p-4 hover:border-[#3A6FF7] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <h3 className="text-lg font-bold text-[#1A1C20]">{company.nom_entreprise || company.denomination}</h3>
            <span className="text-sm text-gray-600">SIREN: {company.siren}</span>
            <AIBadge
              className={`inline-flex items-center px-2 py-1 text-xs font-bold border bg-[#0d1b2a] backdrop-blur-md ${getScoreBadgeClass(company.interestScore.formatted.badge)}`}
              networkSize="xs"
              networkOpacity={0.5}
            >
              <span>
                {company.interestScore.formatted.badge.label}: {company.interestScore.formatted.display}
              </span>
            </AIBadge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Adresse</div>
              <div className="text-sm font-medium text-[#1A1C20]">
                {company.siege.adresse_ligne_1}
              </div>
              <div className="text-sm text-gray-600">
                {company.siege.code_postal} {company.siege.ville}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">NAF / Secteur</div>
              <div className="text-sm font-medium text-[#1A1C20]">{company.code_naf}</div>
              <div className="text-sm text-gray-600">{company.libelle_code_naf}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Forme juridique</div>
              <div className="text-sm text-gray-600">{company.forme_juridique}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Capital</div>
              <div className="text-sm font-medium text-[#1A1C20]">{formatCapital(company.capital)}</div>
            </div>
          </div>

          <div className="border-t border-[#E1E5EB] pt-3 mt-3">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-gray-600 uppercase mb-1">Valorisation estimée</div>
                <div className="text-sm font-bold text-[#3A6FF7]">{company.valuation.formatted.display}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 uppercase mb-1">Date de création</div>
                <div className="text-sm text-gray-600">
                  {new Date(company.date_creation).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/company/${company.siren}`)}
          className="ml-4 px-4 py-2 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
        >
          Ouvrir
        </button>
      </div>
    </div>
  )
}

