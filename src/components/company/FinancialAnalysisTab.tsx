import type { CompanyAnalysisData } from '../../data/loadData'
import AIBadge from '../ia/AIBadge'

interface FinancialAnalysisTabProps {
  siren: string
  companyData: CompanyAnalysisData
}

export default function FinancialAnalysisTab({ siren: _siren, companyData }: FinancialAnalysisTabProps) {
  const finances = companyData.data.pappers.finances || []
  const financesSorted = [...finances].sort((a: any, b: any) => b.annee - a.annee)

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M€`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K€`
    }
    return `${value.toFixed(0)}€`
  }

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  if (financesSorted.length === 0) {
    return (
      <div className="bg-white border border-[#E1E5EB] p-4">
        <div className="text-sm text-gray-600">Aucune donnée financière disponible</div>
      </div>
    )
  }

  const latest = financesSorted[0]
  const previous = financesSorted[1]

  const turnoverGrowth = previous
    ? ((latest.chiffre_affaires - previous.chiffre_affaires) / previous.chiffre_affaires) * 100
    : null

  // Extraire l'analyse IA financière
  const analyseGlobale = companyData.analyse_globale_ia?.report || ''
  const extractFinancialAnalysis = () => {
    if (!analyseGlobale) return null
    
    // Chercher les sections financières dans le rapport
    const financialKeywords = ['rentabilité', 'endettement', 'trésorerie', 'marge', 'CA', 'chiffre d\'affaires', 'résultat', 'EBITDA']
    const sentences = analyseGlobale.split(/[.!?]\s+/)
    const financialSentences = sentences.filter((s: string) => 
      financialKeywords.some(keyword => s.toLowerCase().includes(keyword.toLowerCase()))
    )
    
    if (financialSentences.length > 0) {
      return financialSentences.slice(0, 3).join('. ') + '.'
    }
    
    // Fallback: prendre le premier paragraphe
    const firstParagraph = analyseGlobale.split('\n\n')[0] || analyseGlobale.substring(0, 300)
    return firstParagraph.length > 300 ? firstParagraph.substring(0, 300) + '...' : firstParagraph
  }

  const financialAnalysisText = extractFinancialAnalysis()

  return (
    <div className="space-y-4 p-4">
      {/* IA Financial Analysis Block */}
      {financialAnalysisText && (
        <section className="border border-[#E1E5EB] bg-white p-4 space-y-2">
          <AIBadge 
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md mb-2"
            networkSize="sm"
            networkOpacity={0.3}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
                fill="white"
              />
            </svg>
            <span className="text-white text-xs font-semibold uppercase tracking-wide">
              Analyse IA de la situation financière
            </span>
          </AIBadge>
          <p className="text-xs text-[#4B4F5C] leading-relaxed">
            {financialAnalysisText}
          </p>
        </section>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Chiffre d'affaires {latest.annee}</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.chiffre_affaires)}</div>
          {turnoverGrowth !== null && (
            <div className={`text-xs mt-1 ${turnoverGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {turnoverGrowth >= 0 ? '+' : ''}{turnoverGrowth.toFixed(1)}% YoY
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Résultat net {latest.annee}</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.resultat)}</div>
          <div className="text-xs text-[#4B4F5C] mt-1">Marge: {formatPercentage(latest.marge_nette)}</div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">EBITDA {latest.annee}</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.excedent_brut_exploitation)}</div>
          <div className="text-xs text-[#4B4F5C] mt-1">Marge: {formatPercentage(latest.taux_marge_EBITDA)}</div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Fonds propres {latest.annee}</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.fonds_propres)}</div>
          <div className="text-xs text-[#4B4F5C] mt-1">ROE: {formatPercentage(latest.rentabilite_fonds_propres)}</div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Profitability Ratios</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Marge brute</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(latest.taux_marge_brute)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Marge EBITDA</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(latest.taux_marge_EBITDA)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Marge opérationnelle</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(latest.taux_marge_operationnelle)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Marge nette</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(latest.marge_nette)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">ROE</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(latest.rentabilite_fonds_propres)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Leverage & Liquidity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Ratio d'endettement</span>
              <span className="text-sm font-bold text-[#1A1C20]">{latest.ratio_endettement?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Autonomie financière</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(latest.autonomie_financiere)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Liquidité générale</span>
              <span className="text-sm font-bold text-[#1A1C20]">{latest.liquidite_generale?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">BFR (jours CA)</span>
              <span className="text-sm font-bold text-[#1A1C20]">{latest.BFR_jours_CA?.toFixed(1) || 'N/A'} jours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Trésorerie</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatCurrency(latest.tresorerie)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Historical Financials</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Année</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">CA</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Résultat</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">EBITDA</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Fonds propres</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Dettes</th>
            </tr>
          </thead>
          <tbody>
            {financesSorted.map((data: any, index: number) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{data.annee}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-[#1A1C20]">
                  {formatCurrency(data.chiffre_affaires)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-[#4B4F5C]">{formatCurrency(data.resultat)}</td>
                <td className="px-4 py-3 text-sm text-right text-[#4B4F5C]">
                  {formatCurrency(data.excedent_brut_exploitation)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-[#4B4F5C]">{formatCurrency(data.fonds_propres)}</td>
                <td className="px-4 py-3 text-sm text-right text-[#4B4F5C]">
                  {formatCurrency(data.dettes_financieres)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
