import type { CompanyAnalysisData } from '../../data/loadData'

interface StructureDiagramProps {
  companyData: CompanyAnalysisData
}

export default function StructureDiagram({ companyData }: StructureDiagramProps) {
  const pappers = companyData.data.pappers
  const actionnaires = pappers.actionnaires || []
  const beneficiaires = pappers.beneficiaires_effectifs || []
  const etablissements = pappers.etablissements || []

  // Séparer les BE indirects (via PM) et directs
  const indirectBE = beneficiaires.filter((be: any) => be.pourcentage_parts_indirectes > 0 && be.pourcentage_parts_directes === 0)
  const directBE = beneficiaires.filter((be: any) => be.pourcentage_parts_directes > 0)

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="bg-white border border-[#E1E5EB] p-6">
      <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-6">
        Organigramme capitalistique & établissements
      </h2>

      <div className="space-y-8">
        {/* Row 1: BE Indirects */}
        {indirectBE.length > 0 && (
          <div className="flex justify-center gap-4">
            {indirectBE.map((be: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="border border-[#E1E5EB] bg-[#F5F7FA] px-3 py-2 text-xs font-medium text-[#1A1C20] text-center min-w-[120px]">
                  {be.nom} {be.prenom || ''}
                  <div className="text-[10px] text-[#4B4F5C] mt-1">
                    {formatPercentage(be.pourcentage_parts_indirectes)} indirect
                  </div>
                </div>
                <div className="w-px h-4 bg-[#E1E5EB]"></div>
              </div>
            ))}
          </div>
        )}

        {/* Row 2: Actionnaires */}
        {actionnaires.length > 0 && (
          <div className="flex justify-center gap-4 flex-wrap">
            {actionnaires.map((actionnaire: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="border border-[#E1E5EB] bg-white px-3 py-2 text-xs font-medium text-[#1A1C20] text-center min-w-[140px]">
                  {actionnaire.denomination || actionnaire.nom || 'N/A'}
                  <div className="text-[10px] text-[#4B4F5C] mt-1">
                    {formatPercentage(actionnaire.pourcentage_parts)} • {actionnaire.personne_morale ? 'PM' : 'PP'}
                  </div>
                </div>
                <div className="w-px h-4 bg-[#E1E5EB]"></div>
              </div>
            ))}
          </div>
        )}

        {/* Row 3: BE Directs */}
        {directBE.length > 0 && (
          <div className="flex justify-center gap-4">
            {directBE.map((be: any, index: number) => (
              <div key={index} className="flex flex-col items-center">
                <div className="border border-[#E1E5EB] bg-[#F5F7FA] px-3 py-2 text-xs font-medium text-[#1A1C20] text-center min-w-[120px]">
                  {be.nom} {be.prenom || ''}
                  <div className="text-[10px] text-[#4B4F5C] mt-1">
                    {formatPercentage(be.pourcentage_parts_directes)} direct
                  </div>
                </div>
                <div className="w-px h-4 bg-[#E1E5EB]"></div>
              </div>
            ))}
          </div>
        )}

        {/* Row 4: Entreprise analysée */}
        <div className="flex justify-center">
          <div className="border-2 border-[#3A6FF7] bg-white px-4 py-3 text-sm font-bold text-[#1A1C20] text-center min-w-[200px]">
            {pappers.nom_entreprise || pappers.denomination}
            <div className="text-[10px] text-[#4B4F5C] font-normal mt-1">
              SIREN: {pappers.siren}
            </div>
          </div>
        </div>

        {/* Row 5: Établissements */}
        {etablissements.length > 0 && (
          <>
            <div className="w-px h-4 bg-[#E1E5EB] mx-auto"></div>
            <div className="flex justify-center gap-4 flex-wrap">
              {etablissements.map((etab: any, index: number) => (
                <div key={index} className="border border-[#E1E5EB] bg-[#F5F7FA] px-3 py-2 text-xs text-[#4B4F5C] text-center min-w-[140px]">
                  {etab.siege ? 'Siège' : `Établissement ${index + 1}`}
                  <div className="text-[10px] mt-1">
                    {etab.code_postal} {etab.ville}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

