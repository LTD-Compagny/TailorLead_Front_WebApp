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
              Back to Results
            </button>
            <button className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors">
              Add to Listing
            </button>
            <button className="px-4 py-2 border border-[#3A6FF7] bg-[#3A6FF7] text-white text-sm font-medium hover:bg-[#2D5AD6] transition-colors">
              Enable Surveillance
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
    </div>
  )
}

