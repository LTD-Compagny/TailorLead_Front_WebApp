import type { CompanyAnalysisData } from '../../data/loadData'

interface ConsolidatedAnalysisTabProps {
  siren: string
  companyData: CompanyAnalysisData
}

export default function ConsolidatedAnalysisTab({ siren: _siren, companyData }: ConsolidatedAnalysisTabProps) {
  const valuationIA = companyData.valuation_ia
  const analyseGlobale = companyData.analyse_globale_ia

  // Extraire les sections du rapport
  const extractSections = (report: string) => {
    const sections: {
      summary?: string
      pointsForts: string[]
      pointsFaibles: string[]
      opportunites: string[]
      risques: string[]
    } = {
      pointsForts: [],
      pointsFaibles: [],
      opportunites: [],
      risques: [],
    }

    // Extraire le résumé (premier paragraphe)
    const paragraphs = report.split('\n\n')
    if (paragraphs.length > 0) {
      sections.summary = paragraphs[0].substring(0, 400)
    }

    // Chercher les sections structurées
    const lines = report.split('\n')
    let currentSection: 'pointsForts' | 'pointsFaibles' | 'opportunites' | 'risques' | null = null

    lines.forEach((line: string) => {
      const lowerLine = line.toLowerCase()
      if (lowerLine.includes('points forts') || lowerLine.includes('forces')) {
        currentSection = 'pointsForts'
      } else if (lowerLine.includes('points faibles') || lowerLine.includes('faiblesses')) {
        currentSection = 'pointsFaibles'
      } else if (lowerLine.includes('opportunités') || lowerLine.includes('opportunites')) {
        currentSection = 'opportunites'
      } else if (lowerLine.includes('risques') || lowerLine.includes('risque')) {
        currentSection = 'risques'
      } else if (currentSection && line.trim().startsWith('-')) {
        sections[currentSection].push(line.trim().substring(1).trim())
      } else if (currentSection && line.trim().startsWith('•')) {
        sections[currentSection].push(line.trim().substring(1).trim())
      }
    })

    // Fallback: extraire des phrases clés si pas de structure
    if (sections.pointsForts.length === 0) {
      const positiveKeywords = ['rentable', 'croissance', 'solide', 'fort', 'bon', 'positif', 'augmentation']
      const sentences = report.split(/[.!?]\s+/)
      sections.pointsForts = sentences
        .filter((s: string) => positiveKeywords.some(kw => s.toLowerCase().includes(kw)))
        .slice(0, 3)
    }

    if (sections.pointsFaibles.length === 0) {
      const negativeKeywords = ['baisse', 'diminution', 'faible', 'risque', 'dépendance', 'vulnérable']
      const sentences = report.split(/[.!?]\s+/)
      sections.pointsFaibles = sentences
        .filter((s: string) => negativeKeywords.some(kw => s.toLowerCase().includes(kw)))
        .slice(0, 3)
    }

    return sections
  }

  const sections = analyseGlobale ? extractSections(analyseGlobale.report) : null

  // Extraire la valorisation
  const extractValuation = () => {
    if (!valuationIA?.valuation) return null

    // Chercher une fourchette de valorisation dans le texte
    const valuationText = valuationIA.valuation
    const match = valuationText.match(/(\d+[.,]\d+)\s*M€\s*[-–]\s*(\d+[.,]\d+)\s*M€/i)
    if (match) {
      return `${match[1]} M€ – ${match[2]} M€`
    }

    // Fallback: prendre les premières lignes
    return valuationText.split('\n')[0] || valuationText.substring(0, 200)
  }

  const valuationDisplay = extractValuation()

  return (
    <div className="space-y-4 p-4">
      {/* Bloc 1: Résumé IA global */}
      {sections?.summary && (
        <section className="border border-[#E1E5EB] bg-white p-4 space-y-2">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide">
            Synthèse IA globale
          </h2>
          <p className="text-xs text-[#4B4F5C] leading-relaxed">{sections.summary}</p>
        </section>
      )}

      {/* Bloc 2: Points forts / Points faibles */}
      {(sections?.pointsForts.length > 0 || sections?.pointsFaibles.length > 0) && (
        <section className="grid grid-cols-2 gap-4">
          <div className="border border-[#E1E5EB] bg-white p-4">
            <h3 className="text-xs font-semibold text-[#1A1C20] mb-2 uppercase">Points forts</h3>
            {sections.pointsForts.length > 0 ? (
              <ul className="text-xs text-[#4B4F5C] space-y-1 list-disc list-inside">
                {sections.pointsForts.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#4B4F5C]">Aucun point fort identifié</p>
            )}
          </div>
          <div className="border border-[#E1E5EB] bg-white p-4">
            <h3 className="text-xs font-semibold text-[#1A1C20] mb-2 uppercase">Points faibles</h3>
            {sections.pointsFaibles.length > 0 ? (
              <ul className="text-xs text-[#4B4F5C] space-y-1 list-disc list-inside">
                {sections.pointsFaibles.map((point: string, index: number) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#4B4F5C]">Aucun point faible identifié</p>
            )}
          </div>
        </section>
      )}

      {/* Bloc 3: Opportunités / Risques */}
      {(sections?.opportunites.length > 0 || sections?.risques.length > 0) && (
        <section className="grid grid-cols-2 gap-4">
          <div className="border border-[#E1E5EB] bg-white p-4">
            <h3 className="text-xs font-semibold text-[#1A1C20] mb-2 uppercase">Opportunités</h3>
            {sections.opportunites.length > 0 ? (
              <ul className="text-xs text-[#4B4F5C] space-y-1 list-disc list-inside">
                {sections.opportunites.map((opp: string, index: number) => (
                  <li key={index}>{opp}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#4B4F5C]">Aucune opportunité identifiée</p>
            )}
          </div>
          <div className="border border-[#E1E5EB] bg-white p-4">
            <h3 className="text-xs font-semibold text-[#1A1C20] mb-2 uppercase">Risques</h3>
            {sections.risques.length > 0 ? (
              <ul className="text-xs text-[#4B4F5C] space-y-1 list-disc list-inside">
                {sections.risques.map((risque: string, index: number) => (
                  <li key={index}>{risque}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#4B4F5C]">Aucun risque identifié</p>
            )}
          </div>
        </section>
      )}

      {/* Bloc 4: Triggers & signaux */}
      {analyseGlobale && (
        <section className="border border-[#E1E5EB] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">
            Triggers & signaux
          </h2>
          <div className="space-y-2">
            {/* Extraire les signaux du rapport */}
            <div className="text-xs text-[#4B4F5C]">
              {analyseGlobale.report.includes('Changement') && (
                <div className="mb-2">• Changements de dirigeants récents</div>
              )}
              {analyseGlobale.report.includes('augmentation') && (
                <div className="mb-2">• Augmentation de capital</div>
              )}
              {analyseGlobale.report.includes('acquisition') && (
                <div className="mb-2">• Activité d'acquisition</div>
              )}
              {analyseGlobale.report.includes('croissance') && (
                <div className="mb-2">• Signaux de croissance</div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bloc 5: Valorisation IA */}
      {valuationDisplay && (
        <section className="border border-[#E1E5EB] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-2">
            Valorisation IA estimée
          </h2>
          <p className="text-base font-semibold text-[#1A1C20] mb-2">{valuationDisplay}</p>
          <p className="text-[11px] text-[#4B4F5C]">
            Fourchette indicative basée sur effectifs, secteur, capital, localisation, etc.
          </p>
          {valuationIA?.metadata && (
            <div className="mt-3 pt-3 border-t border-[#E1E5EB]">
              <div className="text-[10px] text-[#4B4F5C]">
                Analyse effectuée avec {valuationIA.metadata.model} en {valuationIA.metadata.analysis_time_seconds}s
              </div>
            </div>
          )}
        </section>
      )}

      {/* Rapport complet (optionnel, en bas) */}
      {analyseGlobale && (
        <section className="border border-[#E1E5EB] bg-white p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">
            Rapport complet
          </h2>
          <div className="text-xs text-[#4B4F5C] leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto">
            {analyseGlobale.report}
          </div>
        </section>
      )}
    </div>
  )
}
