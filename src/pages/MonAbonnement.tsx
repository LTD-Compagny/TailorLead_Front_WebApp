import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'

export default function MonAbonnement() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showChangeOffer, setShowChangeOffer] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<'standard' | 'premium' | 'pro'>('premium')

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <FiltersSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E1E5EB] p-6">
          <h1 className="text-2xl font-bold text-[#1A1C20]">Mon abonnement</h1>
          <p className="text-sm text-[#4B4F5C] mt-1">Gérez votre abonnement et vos crédits externes</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Bannière Offre actuelle */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB] flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#1A1C20]">Offre actuelle</h2>
                <button
                  type="button"
                  onClick={() => setShowChangeOffer(true)}
                  className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                >
                  Changer d'offre
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Forfait</span>
                    <span className="text-base font-bold text-[#1A1C20]">Premium - 200€/mois</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits TailorLead</span>
                    <span className="text-base font-bold text-[#1A1C20]">Illimités</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Date de renouvellement</span>
                    <span className="text-sm text-[#1A1C20]">15 janvier 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bannière Mes crédits CFNews */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB]">
                <h2 className="text-lg font-bold text-[#1A1C20]">Mes crédits CFNews</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits disponibles</span>
                    <span className="text-lg font-bold text-[#1A1C20]">250</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits utilisés ce mois</span>
                    <span className="text-lg font-bold text-[#1A1C20]">150</span>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Acheter des crédits CFNews
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bannière Mes crédits Pappers */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB]">
                <h2 className="text-lg font-bold text-[#1A1C20]">Mes crédits Pappers</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits disponibles</span>
                    <span className="text-lg font-bold text-[#1A1C20]">500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits utilisés ce mois</span>
                    <span className="text-lg font-bold text-[#1A1C20]">320</span>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Acheter des crédits Pappers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Changer d'offre */}
      {showChangeOffer && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/20" 
            onClick={() => setShowChangeOffer(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#E1E5EB] shadow-lg z-50 w-full max-w-[800px] max-h-[90vh] overflow-y-auto">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-4 border-b border-[#E1E5EB]">
              <h3 className="text-xl font-bold text-[#1A1C20]">Changer d'offre</h3>
              <button
                type="button"
                onClick={() => setShowChangeOffer(false)}
                className="text-lg text-[#4B4F5C] hover:text-[#1A1C20] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Contenu du modal */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Offre Standard - 50€/mois */}
                <div className={`border-2 p-4 ${selectedOffer === 'standard' ? 'border-[#0d1b2a] bg-[#F5F7FA]' : 'border-[#E1E5EB] bg-white'}`}>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#1A1C20] mb-2">Standard</h4>
                    <div className="text-2xl font-bold text-[#1A1C20] mb-1">50€<span className="text-sm font-normal text-[#4B4F5C]">/mois</span></div>
                    <p className="text-xs text-[#4B4F5C]">Crédits TailorLead limités</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOffer('standard')}
                    className={`w-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedOffer === 'standard'
                        ? 'bg-[#0d1b2a] text-white hover:bg-[#1a2d42]'
                        : 'border border-[#E1E5EB] bg-white text-[#1A1C20] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {selectedOffer === 'standard' ? 'Sélectionné' : 'Sélectionner'}
                  </button>
                </div>

                {/* Offre Premium - 200€/mois */}
                <div className={`border-2 p-4 ${selectedOffer === 'premium' ? 'border-[#0d1b2a] bg-[#F5F7FA]' : 'border-[#E1E5EB] bg-white'}`}>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#1A1C20] mb-2">Premium</h4>
                    <div className="text-2xl font-bold text-[#1A1C20] mb-1">200€<span className="text-sm font-normal text-[#4B4F5C]">/mois</span></div>
                    <p className="text-xs text-[#4B4F5C]">Crédits TailorLead étendus</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOffer('premium')}
                    className={`w-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedOffer === 'premium'
                        ? 'bg-[#0d1b2a] text-white hover:bg-[#1a2d42]'
                        : 'border border-[#E1E5EB] bg-white text-[#1A1C20] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {selectedOffer === 'premium' ? 'Sélectionné' : 'Sélectionner'}
                  </button>
                </div>

                {/* Offre Pro - 500€/mois */}
                <div className={`border-2 p-4 ${selectedOffer === 'pro' ? 'border-[#0d1b2a] bg-[#F5F7FA]' : 'border-[#E1E5EB] bg-white'}`}>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-[#1A1C20] mb-2">Pro</h4>
                    <div className="text-2xl font-bold text-[#1A1C20] mb-1">500€<span className="text-sm font-normal text-[#4B4F5C]">/mois</span></div>
                    <p className="text-xs text-[#4B4F5C]">Crédits TailorLead illimités</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedOffer('pro')}
                    className={`w-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedOffer === 'pro'
                        ? 'bg-[#0d1b2a] text-white hover:bg-[#1a2d42]'
                        : 'border border-[#E1E5EB] bg-white text-[#1A1C20] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {selectedOffer === 'pro' ? 'Sélectionné' : 'Sélectionner'}
                  </button>
                </div>
              </div>

              {/* Bouton Confirmer */}
              <div className="mt-6 pt-4 border-t border-[#E1E5EB] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowChangeOffer(false)}
                  className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Changement d\'offre vers:', selectedOffer)
                    setShowChangeOffer(false)
                    // TODO: Implémenter la logique de changement d'offre
                  }}
                  className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                >
                  Confirmer le changement
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

