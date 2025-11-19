import type { CompanyAnalysisData } from '../../data/loadData'
import StructureDiagram from './StructureDiagram'

interface ShareholdersTabProps {
  siren: string
  companyData: CompanyAnalysisData
}

export default function ShareholdersTab({ siren: _siren, companyData }: ShareholdersTabProps) {
  const pappers = companyData.data.pappers
  const actionnaires = pappers.actionnaires || []
  const beneficiaires = pappers.beneficiaires_effectifs || []

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  const totalOwnership = actionnaires.reduce((sum: number, sh: any) => sum + (sh.pourcentage_parts || 0), 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Shareholding Structure</h3>
          <div className="text-sm text-gray-600">
            Total: <span className="font-bold text-[#1A1C20]">{formatPercentage(totalOwnership)}</span>
          </div>
        </div>
      </div>

      {/* Actionnaires Table */}
      {actionnaires.length > 0 && (
        <div className="bg-white border border-[#E1E5EB]">
          <div className="px-4 py-3 border-b border-[#E1E5EB]">
            <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Actionnaires</h3>
          </div>
          <table className="w-full">
            <thead className="bg-[#F5F7FA]">
              <tr className="border-b border-[#E1E5EB]">
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Type</th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Parts %</th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Votes %</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">SIREN</th>
              </tr>
            </thead>
            <tbody>
              {actionnaires.map((actionnaire: any, index: number) => (
                <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">
                    {actionnaire.denomination || actionnaire.nom || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {actionnaire.personne_morale ? 'Personne morale' : 'Personne physique'}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#1A1C20] text-right">
                    {formatPercentage(actionnaire.pourcentage_parts)}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#1A1C20] text-right">
                    {formatPercentage(actionnaire.pourcentage_votes)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {actionnaire.siren || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bénéficiaires effectifs */}
      {beneficiaires.length > 0 && (
        <div className="bg-white border border-[#E1E5EB]">
          <div className="px-4 py-3 border-b border-[#E1E5EB]">
            <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Bénéficiaires effectifs</h3>
          </div>
          <table className="w-full">
            <thead className="bg-[#F5F7FA]">
              <tr className="border-b border-[#E1E5EB]">
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Parts directes</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Parts indirectes</th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Votes %</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Contrôle</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaires.map((benef: any, index: number) => (
                <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">
                    {benef.nom} {benef.prenom || ''}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatPercentage(benef.pourcentage_parts_directes)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatPercentage(benef.pourcentage_parts_indirectes)}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-[#1A1C20] text-right">
                    {formatPercentage(benef.pourcentage_votes)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {benef.detention_pouvoir_decision_ag ? 'Oui' : 'Non'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Concentration Analysis */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Top 3 Concentration</div>
          <div className="text-2xl font-bold text-[#1A1C20]">
            {formatPercentage(
              actionnaires
                .slice(0, 3)
                .reduce((sum: number, sh: any) => sum + (sh.pourcentage_parts || 0), 0)
            )}
          </div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Total Actionnaires</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{actionnaires.length}</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Bénéficiaires effectifs</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{beneficiaires.length}</div>
        </div>
      </div>

      {/* Ownership Diagram */}
      {(actionnaires.length > 0 || beneficiaires.length > 0 || (pappers.etablissements && pappers.etablissements.length > 0)) && (
        <div className="mt-6">
          <StructureDiagram companyData={companyData} />
        </div>
      )}
    </div>
  )
}
