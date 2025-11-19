'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TabsBar from '@/components/company/TabsBar'
import CompanyIdentityTab from '@/components/company/CompanyIdentityTab'
import ShareholdersTab from '@/components/company/ShareholdersTab'
import FinancialAnalysisTab from '@/components/company/FinancialAnalysisTab'
import ActivitySectorTab from '@/components/company/ActivitySectorTab'
import EventsNewsTab from '@/components/company/EventsNewsTab'
import ConsolidatedAnalysisTab from '@/components/company/ConsolidatedAnalysisTab'

// Mock company data
const mockCompanyData = {
  name: 'SCHNEIDER ELECTRIC SE',
  siren: '542065479',
  legalForm: 'SAS',
}

export default function CompanyPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    'Fiche entreprise',
    'Fiche actionnaires',
    'Analyse financière',
    'Activité / secteur',
    'Actualités + events',
    'Analyse globale consolidée',
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CompanyIdentityTab siren={params.siren as string} />
      case 1:
        return <ShareholdersTab siren={params.siren as string} />
      case 2:
        return <FinancialAnalysisTab siren={params.siren as string} />
      case 3:
        return <ActivitySectorTab siren={params.siren as string} />
      case 4:
        return <EventsNewsTab siren={params.siren as string} />
      case 5:
        return <ConsolidatedAnalysisTab siren={params.siren as string} />
      default:
        return <CompanyIdentityTab siren={params.siren as string} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Fixed Header */}
      <header className="bg-white border-b border-[#E1E5EB] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#1A1C20]">
              {mockCompanyData.name}
            </h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>SIREN: {mockCompanyData.siren}</span>
              <span>•</span>
              <span>{mockCompanyData.legalForm}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
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

