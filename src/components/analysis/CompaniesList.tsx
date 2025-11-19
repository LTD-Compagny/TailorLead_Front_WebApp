import { useNavigate } from 'react-router-dom'

interface FoundCompany {
  siren: string
  nom: string
  latitude: number | null
  longitude: number | null
  ville?: string
  code_naf?: string
  libelle_code_naf?: string
  date_creation?: string
  raw: any
}

interface CompaniesListProps {
  companies: FoundCompany[]
}

export default function CompaniesList({ companies }: CompaniesListProps) {
  const navigate = useNavigate()

  if (companies.length === 0) {
    return (
      <div className="p-6 bg-white border border-[#E1E5EB] text-center">
        <p className="text-sm text-[#4B4F5C]">Aucune entreprise trouvée.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-[#4B4F5C] font-medium">
        {companies.length} entreprise{companies.length > 1 ? 's' : ''} trouvée{companies.length > 1 ? 's' : ''}
      </div>

      {companies.map((company) => (
        <div
          key={company.siren}
          className="bg-white border border-[#E1E5EB] p-4 hover:border-[#0d1b2a] transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {/* Mini IA Badge */}
                <div className="w-8 h-8 bg-[#0d1b2a] flex items-center justify-center text-white font-bold text-[10px]">
                  IA
                </div>

                <h3 className="text-base font-bold text-[#1A1C20]">{company.nom}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#4B4F5C]">SIREN:</span>{' '}
                  <span className="text-[#1A1C20] font-medium">{company.siren}</span>
                </div>

                {company.ville && (
                  <div>
                    <span className="text-[#4B4F5C]">Ville:</span>{' '}
                    <span className="text-[#1A1C20] font-medium">{company.ville}</span>
                  </div>
                )}

                {company.code_naf && (
                  <div>
                    <span className="text-[#4B4F5C]">NAF:</span>{' '}
                    <span className="text-[#1A1C20] font-medium">{company.code_naf}</span>
                  </div>
                )}

                {company.libelle_code_naf && (
                  <div className="col-span-2">
                    <span className="text-[#4B4F5C] text-xs">{company.libelle_code_naf}</span>
                  </div>
                )}

                {company.date_creation && (
                  <div>
                    <span className="text-[#4B4F5C]">Création:</span>{' '}
                    <span className="text-[#1A1C20] font-medium">
                      {new Date(company.date_creation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(`/company/${company.siren}`)}
              className="ml-4 px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
            >
              Ouvrir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

