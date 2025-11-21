import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TabsBar from '../components/company/TabsBar'
import CompanyIdentityTab from '../components/company/CompanyIdentityTab'
import ShareholdersTab from '../components/company/ShareholdersTab'
import FinancialAnalysisTab from '../components/company/FinancialAnalysisTab'
import ActivitySectorTab from '../components/company/ActivitySectorTab'
import EventsNewsTab from '../components/company/EventsNewsTab'
import ConsolidatedAnalysisTab from '../components/company/ConsolidatedAnalysisTab'
import { loadCompanyAnalysis, type CompanyAnalysisData } from '../data/loadData'

export default function Company() {
  const { siren } = useParams<{ siren: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('fiche')
  const [companyData, setCompanyData] = useState<CompanyAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddToRecherche, setShowAddToRecherche] = useState(false)
  const [showSurveiller, setShowSurveiller] = useState(false)
  const [newRechercheName, setNewRechercheName] = useState('')
  
  // Mock données : recherches enregistrées
  const recherchesEnregistrees = [
    { id: '1', nom: 'Entreprises tech Paris > 50 salariés' },
    { id: '2', nom: 'Startups Fintech Lyon' },
    { id: '3', nom: 'Retail > 100 employés' },
  ]
  
  // Mock données : surveillances actives
  const surveillancesActives = [
    { id: 's1', nom: 'Surveillance Tech Paris' },
    { id: 's2', nom: 'Surveillance Fintech' },
    { id: 's3', nom: 'Surveillance Retail' },
  ]

  useEffect(() => {
    if (siren) {
      const loadData = async () => {
        try {
          const data = await loadCompanyAnalysis(siren)
          setCompanyData(data)
          setLoading(false)
        } catch (error) {
          console.error('Error loading company data:', error)
          setLoading(false)
        }
      }
      loadData()
    }
  }, [siren])

  const tabs = [
    { id: 'fiche', label: 'FICHE ENTREPRISE' },
    { id: 'actionnaires', label: 'FICHE ACTIONNAIRES' },
    { id: 'finance', label: 'ANALYSE FINANCIÈRE' },
    { id: 'activite', label: 'ACTIVITÉ / SECTEUR' },
    { id: 'events', label: 'ACTUALITÉS + EVENTS' },
    { id: 'analyse', label: 'ANALYSE GLOBALE CONSOLIDÉE' },
  ]

  const renderTabContent = () => {
    if (!companyData) return null

    switch (activeTab) {
      case 'fiche':
        return <CompanyIdentityTab siren={siren || ''} companyData={companyData} />
      case 'actionnaires':
        return <ShareholdersTab siren={siren || ''} companyData={companyData} />
      case 'finance':
        return <FinancialAnalysisTab siren={siren || ''} companyData={companyData} />
      case 'activite':
        return <ActivitySectorTab siren={siren || ''} companyData={companyData} />
      case 'events':
        return <EventsNewsTab siren={siren || ''} companyData={companyData} />
      case 'analyse':
        return <ConsolidatedAnalysisTab siren={siren || ''} companyData={companyData} />
      default:
        return <CompanyIdentityTab siren={siren || ''} companyData={companyData} />
    }
  }

  const pappersData = companyData?.data?.pappers

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-sm text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (!companyData) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-sm text-red-600">Entreprise non trouvée</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] overflow-hidden">
      {/* Fixed Header */}
      <header className="bg-white border-b border-[#E1E5EB] flex-shrink-0">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1C20]">
              {pappersData?.nom_entreprise || pappersData?.denomination || companyData.entreprise.nom}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>SIREN: {siren || companyData.entreprise.siren}</span>
              <span>•</span>
              <span>{pappersData?.forme_juridique || 'N/A'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/results')}
              className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
            >
              Retour
            </button>
            <button
              onClick={() => setShowAddToRecherche(true)}
              className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
            >
              Add to Recherche
            </button>
            <button
              onClick={() => setShowSurveiller(true)}
              className="px-4 py-2 border border-[#0d1b2a] bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
            >
              Surveiller
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <TabsBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto bg-[#F5F7FA]">
        <div className="p-6">{renderTabContent()}</div>
      </main>

      {/* Modal Add to Recherche */}
      {showAddToRecherche && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/20" 
            onClick={() => setShowAddToRecherche(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#E1E5EB] shadow-lg z-50 w-full max-w-[500px]">
            <div className="p-4 border-b border-[#E1E5EB] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1A1C20]">Ajouter à une Recherche</h3>
              <button
                type="button"
                onClick={() => setShowAddToRecherche(false)}
                className="text-lg text-[#4B4F5C] hover:text-[#1A1C20] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Liste des recherches existantes */}
              <div>
                <h4 className="text-sm font-bold text-[#1A1C20] mb-3">Recherches existantes</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {recherchesEnregistrees.map((recherche) => (
                    <button
                      key={recherche.id}
                      type="button"
                      onClick={() => {
                        console.log('Ajouter à la recherche:', recherche.id)
                        setShowAddToRecherche(false)
                        // TODO: Implémenter l'ajout à la recherche
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors border border-[#E1E5EB]"
                    >
                      {recherche.nom}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-[#E1E5EB] my-4"></div>
              
              {/* Créer une nouvelle recherche */}
              <div>
                <h4 className="text-sm font-bold text-[#1A1C20] mb-3">Créer une nouvelle recherche</h4>
                <input
                  type="text"
                  value={newRechercheName}
                  onChange={(e) => setNewRechercheName(e.target.value)}
                  placeholder="Nom de la recherche"
                  className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white mb-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newRechercheName.trim()) {
                      console.log('Créer nouvelle recherche:', newRechercheName)
                      setNewRechercheName('')
                      setShowAddToRecherche(false)
                      // TODO: Implémenter la création de la recherche
                    }
                  }}
                  className="w-full px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                >
                  Créer et ajouter
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Surveiller */}
      {showSurveiller && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/20" 
            onClick={() => setShowSurveiller(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#E1E5EB] shadow-lg z-50 w-full max-w-[500px]">
            <div className="p-4 border-b border-[#E1E5EB] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1A1C20]">Surveiller cette entreprise</h3>
              <button
                type="button"
                onClick={() => setShowSurveiller(false)}
                className="text-lg text-[#4B4F5C] hover:text-[#1A1C20] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <div>
                <h4 className="text-sm font-bold text-[#1A1C20] mb-3">Ajouter à une surveillance existante</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {surveillancesActives.length > 0 ? (
                    surveillancesActives.map((surveillance) => (
                      <button
                        key={surveillance.id}
                        type="button"
                        onClick={() => {
                          console.log('Ajouter à la surveillance:', surveillance.id)
                          setShowSurveiller(false)
                          // TODO: Implémenter l'ajout à la surveillance
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors border border-[#E1E5EB]"
                      >
                        {surveillance.nom}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-[#4B4F5C] text-center py-4">
                      Aucune surveillance active
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

