import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TabsBar from '../components/company/TabsBar'
import CompanyIdentityTab from '../components/company/CompanyIdentityTab'
import ShareholdersTab from '../components/company/ShareholdersTab'
import FinancialAnalysisTab from '../components/company/FinancialAnalysisTab'
import ActivitySectorTab from '../components/company/ActivitySectorTab'
import EventsNewsTab from '../components/company/EventsNewsTab'
import ConsolidatedAnalysisTab from '../components/company/ConsolidatedAnalysisTab'

// Mock company data
const mockCompanyData = {
  name: 'SCHNEIDER ELECTRIC SE',
  siren: '542065479',
  legalForm: 'SAS',
}

export default function Company() {
  const { siren } = useParams<{ siren: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>('fiche')

  const tabs = [
    { id: 'fiche', label: 'FICHE ENTREPRISE' },
    { id: 'actionnaires', label: 'FICHE ACTIONNAIRES' },
    { id: 'finance', label: 'ANALYSE FINANCIÈRE' },
    { id: 'activite', label: 'ACTIVITÉ / SECTEUR' },
    { id: 'events', label: 'ACTUALITÉS + EVENTS' },
    { id: 'analyse', label: 'ANALYSE GLOBALE CONSOLIDÉE' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fiche':
        return <CompanyIdentityTab siren={siren || ''} />
      case 'actionnaires':
        return <ShareholdersTab siren={siren || ''} />
      case 'finance':
        return <FinancialAnalysisTab siren={siren || ''} />
      case 'activite':
        return <ActivitySectorTab siren={siren || ''} />
      case 'events':
        return <EventsNewsTab siren={siren || ''} />
      case 'analyse':
        return <ConsolidatedAnalysisTab siren={siren || ''} />
      default:
        return <CompanyIdentityTab siren={siren || ''} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Fixed Header */}
      <header className="bg-white border-b border-[#E1E5EB] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1C20]">{mockCompanyData.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>SIREN: {siren || mockCompanyData.siren}</span>
              <span>•</span>
              <span>{mockCompanyData.legalForm}</span>
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

      {/* Main Content */}
      <main className="p-6">{renderTabContent()}</main>
    </div>
  )
}

