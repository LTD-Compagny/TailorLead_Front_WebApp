import { useState, useMemo } from 'react'
import type { CompanyAnalysisData } from '../../data/loadData'

interface EventsNewsTabProps {
  siren: string
  companyData: CompanyAnalysisData
}

export default function EventsNewsTab({ siren: _siren, companyData }: EventsNewsTabProps) {
  const bodaccResults = companyData.data.bodacc?.results || []
  const [filter, setFilter] = useState<'all' | 'bodacc' | 'cfnews'>('all')

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  // Filtrer et trier les événements
  const filteredEvents = useMemo(() => {
    let events = [...bodaccResults]
    
    // Trier par date décroissante
    events.sort((a: any, b: any) => {
      const dateA = new Date(a.dateparution).getTime()
      const dateB = new Date(b.dateparution).getTime()
      return dateB - dateA
    })

    // Pour l'instant, on n'a que BODACC, donc le filtre CFNews ne fait rien
    // Mais la structure est prête pour l'ajout futur de CFNews
    if (filter === 'bodacc') {
      return events
    }
    if (filter === 'cfnews') {
      return [] // Pas de données CFNews pour l'instant
    }
    return events
  }, [bodaccResults, filter])

  return (
    <div className="space-y-4 p-4">
      {/* Filter Control */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <div className="flex items-center gap-4">
          <label className="text-xs text-[#4B4F5C] uppercase">Filtrer par source</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'bodacc' | 'cfnews')}
            className="border border-[#E1E5EB] bg-white text-xs px-2 py-1 text-[#1A1C20] focus:outline-none focus:border-[#3A6FF7]"
          >
            <option value="all">Tous les évènements</option>
            <option value="bodacc">BODACC uniquement</option>
            <option value="cfnews">CFNews uniquement</option>
          </select>
        </div>
      </div>

      {/* BODACC Events */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">BODACC Events</h3>
          <span className="text-xs text-[#4B4F5C]">{filteredEvents.length} events</span>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="p-4 text-sm text-[#4B4F5C]">Aucun événement disponible</div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F5F7FA]">
              <tr className="border-b border-[#E1E5EB]">
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase px-4 py-3">Date</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase px-4 py-3">Type</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase px-4 py-3">Description</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase px-4 py-3">Référence</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase px-4 py-3">Lien</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event: any, index: number) => (
                <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                  <td className="px-4 py-3 text-sm text-[#4B4F5C]">{formatDate(event.dateparution)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">
                    {event.familleavis_lib || event.type || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#4B4F5C]">
                    {event.modificationsgenerales
                      ? JSON.parse(event.modificationsgenerales).descriptif || event.type || 'N/A'
                      : event.type || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#4B4F5C] font-mono text-xs">
                    {event.publicationavis}{event.parution}{event.numeroannonce}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {event.url_complete && (
                      <a
                        href={event.url_complete}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3A6FF7] hover:underline"
                      >
                        Voir
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Event Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Total Events</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{bodaccResults.length}</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Dépôts comptes</div>
          <div className="text-2xl font-bold text-[#1A1C20]">
            {bodaccResults.filter((e: any) => e.familleavis === 'dpc').length}
          </div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Modifications</div>
          <div className="text-2xl font-bold text-[#1A1C20]">
            {bodaccResults.filter((e: any) => e.familleavis === 'modification').length}
          </div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-[#4B4F5C] uppercase mb-2">Créations</div>
          <div className="text-2xl font-bold text-[#3A6FF7]">
            {bodaccResults.filter((e: any) => e.familleavis === 'creation' || e.type === 'Création').length}
          </div>
        </div>
      </div>
    </div>
  )
}
