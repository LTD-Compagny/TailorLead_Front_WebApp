import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'

export default function MesReglages() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <FiltersSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E1E5EB] p-6">
          <h1 className="text-2xl font-bold text-[#1A1C20]">Mes Réglages</h1>
          <p className="text-sm text-[#4B4F5C] mt-1">Gérez vos paramètres de compte et vos crédits</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Bannière Mes crédits TailorLead */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB]">
                <h2 className="text-lg font-bold text-[#1A1C20]">Mes crédits TailorLead</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits disponibles</span>
                    <span className="text-lg font-bold text-[#1A1C20]">1 250</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#4B4F5C]">Crédits utilisés ce mois</span>
                    <span className="text-lg font-bold text-[#1A1C20]">380</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bannière Mon compte */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB]">
                <h2 className="text-lg font-bold text-[#1A1C20]">Mon compte</h2>
              </div>
              <div className="p-4">
                {/* Contenu de la bannière Mon compte */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Nom</label>
                    <input
                      type="text"
                      defaultValue="Dupont"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Prénom</label>
                    <input
                      type="text"
                      defaultValue="Jean"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="jean.dupont@example.com"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Téléphone</label>
                    <input
                      type="tel"
                      defaultValue="+33 6 12 34 56 78"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bannière Mon mot de passe */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB]">
                <h2 className="text-lg font-bold text-[#1A1C20]">Mon mot de passe</h2>
              </div>
              <div className="p-4">
                {/* Contenu de la bannière Mon mot de passe */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Mot de passe actuel</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Modifier le mot de passe
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bannière Ajouter un compte */}
            <div className="bg-white border border-[#E1E5EB]">
              <div className="p-4 border-b border-[#E1E5EB]">
                <h2 className="text-lg font-bold text-[#1A1C20]">Ajouter un compte</h2>
              </div>
              <div className="p-4">
                {/* Contenu de la bannière Ajouter un compte */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Nom du compte</label>
                    <input
                      type="text"
                      placeholder="Nom du compte"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1A1C20] mb-2">Mot de passe</label>
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Ajouter le compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

