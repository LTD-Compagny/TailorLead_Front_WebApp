import { useNavigate } from 'react-router-dom'

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

interface CompanyCardProps {
  company: CompanyResult
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const navigate = useNavigate()

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'bg-green-100 text-green-700 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  return (
    <div className="bg-white border border-[#E1E5EB] p-4 hover:border-[#3A6FF7] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <h3 className="text-lg font-bold text-[#1A1C20]">{company.name}</h3>
            <span className="text-sm text-gray-600">SIREN: {company.siren}</span>
            <span
              className={`inline-block px-2 py-1 text-xs font-bold border ${getScoreColor(company.score)}`}
            >
              Score: {company.score}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Secteur</div>
              <div className="text-sm font-medium text-[#1A1C20]">{company.sector}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">NAF</div>
              <div className="text-sm text-gray-600">{company.naf}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">Pappers</div>
              <div className="text-sm text-gray-600">{company.pappersInfo}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 uppercase mb-1">BODACC</div>
              <div className="text-sm text-gray-600">{company.bodaccEvent}</div>
            </div>
          </div>

          <div className="border-t border-[#E1E5EB] pt-3">
            <div className="text-xs text-gray-600 uppercase mb-1">CFNews</div>
            <div className="text-sm text-gray-600">{company.cfnewsEvent}</div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/company/${company.siren}`)}
          className="ml-4 px-4 py-2 border border-[#3A6FF7] bg-[#3A6FF7] text-white text-sm font-medium hover:bg-[#2D5AD6] transition-colors"
        >
          Ouvrir
        </button>
      </div>
    </div>
  )
}

