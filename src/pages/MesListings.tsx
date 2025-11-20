import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'
import AIBadge from '../components/ia/AIBadge'

interface PersonnePhysique {
  id: string
  civilite?: string
  nom: string
  prenom?: string
  entreprise?: string
  role?: string
  siren?: string
  ville?: string
  dateNaissance?: string
  email?: string
  telephone?: string
  participation?: string
}

interface Listing {
  id: string
  nom: string
  dateCreation: string
  dateModification?: string
  personnes: PersonnePhysique[]
  expanded?: boolean
  showAllPersonnes?: boolean
}

interface ColumnConfig {
  id: string
  label: string
  key: keyof PersonnePhysique | string
  visible: boolean
  order: number
  filter: string
}

export default function MesListings() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'enregistres' | 'historique' | 'gestion'>('enregistres')
  const [selectedListingGestion, setSelectedListingGestion] = useState<string>('')
  const [promptIA, setPromptIA] = useState('')
  const [showMoreColumns, setShowMoreColumns] = useState(false)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Configuration des colonnes avec filtres
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'civilite', label: 'Civilité', key: 'civilite', visible: true, order: 0, filter: '' },
    { id: 'nom', label: 'Nom', key: 'nom', visible: true, order: 1, filter: '' },
    { id: 'prenom', label: 'Prénom', key: 'prenom', visible: true, order: 2, filter: '' },
    { id: 'entreprise', label: 'Entreprise', key: 'entreprise', visible: true, order: 3, filter: '' },
    { id: 'role', label: 'Rôle', key: 'role', visible: true, order: 4, filter: '' },
    { id: 'siren', label: 'SIREN', key: 'siren', visible: false, order: 5, filter: '' },
    { id: 'ville', label: 'Ville', key: 'ville', visible: false, order: 6, filter: '' },
    { id: 'participation', label: 'Participation (%)', key: 'participation', visible: false, order: 7, filter: '' },
    { id: 'dateNaissance', label: 'Date de naissance', key: 'dateNaissance', visible: false, order: 8, filter: '' },
    { id: 'email', label: 'Email', key: 'email', visible: false, order: 9, filter: '' },
    { id: 'telephone', label: 'Téléphone', key: 'telephone', visible: false, order: 10, filter: '' },
  ])
  
  // Colonnes disponibles pour ajout
  const availableColumns = columns.filter(col => !col.visible)
  
  // Fonctions pour gérer les colonnes
  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible, filter: col.visible ? col.filter : '' } : col
    ))
  }
  
  const updateColumnFilter = (columnId: string, filterValue: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, filter: filterValue } : col
    ))
  }
  
  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleDrop = (targetColumnId: string) => {
    if (!draggedColumn || draggedColumn === targetColumnId) return
    
    const draggedCol = columns.find(col => col.id === draggedColumn)
    const targetCol = columns.find(col => col.id === targetColumnId)
    
    if (!draggedCol || !targetCol) return
    
    const newOrder = targetCol.order
    const oldOrder = draggedCol.order
    
    setColumns(prev => prev.map(col => {
      if (col.id === draggedColumn) {
        return { ...col, order: newOrder }
      } else if (col.id === targetColumnId) {
        return { ...col, order: oldOrder }
      } else if (oldOrder < newOrder && col.order > oldOrder && col.order <= newOrder) {
        return { ...col, order: col.order - 1 }
      } else if (oldOrder > newOrder && col.order >= newOrder && col.order < oldOrder) {
        return { ...col, order: col.order + 1 }
      }
      return col
    }))
    
    setDraggedColumn(null)
  }
  
  const visibleColumns = columns.filter(col => col.visible).sort((a, b) => a.order - b.order)
  
  // Listings enregistrés
  const [listingsEnregistres, setListingsEnregistres] = useState<Listing[]>([
    {
      id: '1',
      nom: 'Actionnaires TechCorp SAS',
      dateCreation: '2024-05-10',
      dateModification: '2024-05-15',
      personnes: [
        { id: 'p1', civilite: 'Monsieur', nom: 'Dupont', prenom: 'Jean', entreprise: 'TechCorp SAS', role: 'PDG', siren: '123456789', ville: 'Paris', participation: '45' },
        { id: 'p2', civilite: 'Madame', nom: 'Martin', prenom: 'Sophie', entreprise: 'TechCorp SAS', role: 'Actionnaire', siren: '123456789', ville: 'Lyon', participation: '30' },
        { id: 'p3', civilite: 'Monsieur', nom: 'Bernard', prenom: 'Pierre', entreprise: 'TechCorp SAS', role: 'Directeur Technique', siren: '123456789', ville: 'Paris', participation: '15' },
      ],
      expanded: false,
      showAllPersonnes: false,
    },
    {
      id: '2',
      nom: 'Dirigeants Fintech Lyon',
      dateCreation: '2024-04-20',
      personnes: [
        { id: 'p4', civilite: 'Monsieur', nom: 'Leroy', prenom: 'Marc', entreprise: 'PayTech Lyon', role: 'PDG', siren: '111222333', ville: 'Lyon' },
        { id: 'p5', civilite: 'Madame', nom: 'Moreau', prenom: 'Catherine', entreprise: 'BankTech Solutions', role: 'Directrice Financière', siren: '444555666', ville: 'Lyon' },
      ],
      expanded: false,
      showAllPersonnes: false,
    },
  ])
  
  // Historique de listings
  const [historiqueListings, setHistoriqueListings] = useState<Listing[]>([
    {
      id: 'h1',
      nom: 'Actionnaires entreprises tech Paris',
      dateCreation: '2024-05-20',
      personnes: [
        { id: 'p6', civilite: 'Monsieur', nom: 'Petit', prenom: 'Luc', entreprise: 'AICorp France', role: 'Actionnaire', siren: '111111111', ville: 'Paris', participation: '25' },
        { id: 'p7', civilite: 'Madame', nom: 'Robert', prenom: 'Marie', entreprise: 'MachineLearn Pro', role: 'Co-fondatrice', siren: '222222222', ville: 'Paris', participation: '50' },
        { id: 'p8', civilite: 'Monsieur', nom: 'Garcia', prenom: 'Antoine', entreprise: 'TechStart SAS', role: 'PDG', siren: '333333333', ville: 'Paris' },
      ],
      expanded: false,
      showAllPersonnes: false,
    },
  ])

  const toggleListing = (id: string, isHistorique: boolean) => {
    if (isHistorique) {
      setHistoriqueListings(prev =>
        prev.map(r => r.id === id ? { ...r, expanded: !r.expanded, showAllPersonnes: false } : r)
      )
    } else {
      setListingsEnregistres(prev =>
        prev.map(r => r.id === id ? { ...r, expanded: !r.expanded, showAllPersonnes: false } : r)
      )
    }
  }

  const toggleShowAllPersonnes = (id: string, isHistorique: boolean) => {
    if (isHistorique) {
      setHistoriqueListings(prev =>
        prev.map(r => r.id === id ? { ...r, showAllPersonnes: !r.showAllPersonnes } : r)
      )
    } else {
      setListingsEnregistres(prev =>
        prev.map(r => r.id === id ? { ...r, showAllPersonnes: !r.showAllPersonnes } : r)
      )
    }
  }

  // Calculer le pourcentage de complétion d'une personne
  const getCompletionPercent = (personne: PersonnePhysique): number => {
    const fields = ['civilite', 'nom', 'prenom', 'entreprise', 'role', 'siren', 'ville', 'participation', 'dateNaissance', 'email', 'telephone']
    const filledFields = fields.filter(field => {
      const value = personne[field as keyof PersonnePhysique]
      return value && value.toString().trim() !== ''
    }).length
    return Math.round((filledFields / fields.length) * 100)
  }

  // Filtrer les personnes avec nom valide
  const getValidPersonnes = (personnes: PersonnePhysique[]): PersonnePhysique[] => {
    return personnes.filter(p => p.nom && p.nom.trim() !== '')
  }

  // Obtenir le nom complet d'une personne
  const getFullName = (personne: PersonnePhysique): string => {
    const parts = []
    if (personne.civilite) parts.push(personne.civilite)
    if (personne.prenom) parts.push(personne.prenom)
    if (personne.nom) parts.push(personne.nom)
    return parts.join(' ') || personne.nom || ''
  }

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <FiltersSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E1E5EB] p-6">
          <h1 className="text-2xl font-bold text-[#1A1C20]">Mes Listings</h1>
          <p className="text-sm text-[#4B4F5C] mt-1">Gérez vos listings enregistrés et consultez votre historique</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Onglets */}
          <div className="flex items-center border-b border-[#E1E5EB] bg-white mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('enregistres')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'enregistres'
                  ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                  : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
              }`}
            >
              Mes Listings enregistrés
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('historique')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'historique'
                  ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                  : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
              }`}
            >
              Mon historique de listing
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gestion')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'gestion'
                  ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                  : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
              }`}
            >
              Gestion du Listing
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-4">
            {activeTab === 'enregistres' && (
              // Liste des listings enregistrés
              listingsEnregistres.length > 0 ? (
                listingsEnregistres.map((listing) => (
                  <div key={listing.id} className="bg-white border border-[#E1E5EB]">
                    <button
                      type="button"
                      onClick={() => toggleListing(listing.id, false)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F7FA] transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#1A1C20] mb-1">{listing.nom}</h3>
                        <div className="flex items-center gap-4 text-xs text-[#4B4F5C]">
                          <span>Créé le {new Date(listing.dateCreation).toLocaleDateString('fr-FR')}</span>
                          {listing.dateModification && (
                            <span>Modifié le {new Date(listing.dateModification).toLocaleDateString('fr-FR')}</span>
                          )}
                          <span>{getValidPersonnes(listing.personnes).length} personne{getValidPersonnes(listing.personnes).length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[#4B4F5C] transition-transform ${listing.expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {listing.expanded && (
                      <div className="border-t border-[#E1E5EB] p-4 bg-[#F5F7FA]">
                        <div className="space-y-2 mb-4">
                          {(listing.showAllPersonnes
                            ? listing.personnes.filter(p => p.nom && p.nom.trim() !== '')
                            : listing.personnes.filter(p => p.nom && p.nom.trim() !== '').slice(0, 5)
                          ).map((personne, index) => (
                            <div
                              key={personne.id || index}
                              className="bg-white border border-[#E1E5EB] p-3 hover:border-[#0d1b2a] transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-[#1A1C20]">{getFullName(personne)}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-[#4B4F5C]">
                                    {personne.role && <span>• {personne.role}</span>}
                                    {personne.entreprise && <span>• {personne.entreprise}</span>}
                                    {personne.siren && <span>• SIREN: {personne.siren}</span>}
                                    {personne.ville && <span>• {personne.ville}</span>}
                                  </div>
                                </div>
                                <div className="ml-4 text-xs font-medium text-[#1A1C20] whitespace-nowrap">
                                  {getCompletionPercent(personne)} % complété
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton pour afficher plus de personnes */}
                        {(() => {
                          const personnesFiltered = listing.personnes.filter(p => p.nom && p.nom.trim() !== '')
                          return personnesFiltered.length > 5 && (
                            <button
                              type="button"
                              onClick={() => toggleShowAllPersonnes(listing.id, false)}
                              className="w-full px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors mb-4"
                            >
                              {listing.showAllPersonnes
                                ? 'Afficher moins'
                                : `Afficher les ${personnesFiltered.length - 5} autres personnes`}
                            </button>
                          )
                        })()}

                        {/* Boutons d'action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#E1E5EB]">
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Continuer le listing:', listing.id)
                              // TODO: Implémenter la fonctionnalité
                            }}
                            className="flex-1 px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                          >
                            Continuer le Listing
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('gestion')
                              setSelectedListingGestion(listing.id)
                            }}
                            className="flex-1 px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                          >
                            Modifier mon Listing
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#E1E5EB] p-8 text-center">
                  <p className="text-sm text-[#4B4F5C]">Aucun listing enregistré</p>
                </div>
              )
            )}

            {activeTab === 'historique' && (
              // Liste de l'historique
              historiqueListings.length > 0 ? (
                historiqueListings.map((listing) => (
                  <div key={listing.id} className="bg-white border border-[#E1E5EB]">
                    <button
                      type="button"
                      onClick={() => toggleListing(listing.id, true)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F7FA] transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#1A1C20] mb-1">{listing.nom}</h3>
                        <div className="flex items-center gap-4 text-xs text-[#4B4F5C]">
                          <span>Effectué le {new Date(listing.dateCreation).toLocaleDateString('fr-FR')}</span>
                          <span>{getValidPersonnes(listing.personnes).length} personne{getValidPersonnes(listing.personnes).length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[#4B4F5C] transition-transform ${listing.expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {listing.expanded && (
                      <div className="border-t border-[#E1E5EB] p-4 bg-[#F5F7FA]">
                        <div className="space-y-2 mb-4">
                          {(listing.showAllPersonnes
                            ? listing.personnes.filter(p => p.nom && p.nom.trim() !== '')
                            : listing.personnes.filter(p => p.nom && p.nom.trim() !== '').slice(0, 5)
                          ).map((personne, index) => (
                            <div
                              key={personne.id || index}
                              className="bg-white border border-[#E1E5EB] p-3 hover:border-[#0d1b2a] transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-[#1A1C20]">{getFullName(personne)}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-[#4B4F5C]">
                                    {personne.role && <span>• {personne.role}</span>}
                                    {personne.entreprise && <span>• {personne.entreprise}</span>}
                                    {personne.siren && <span>• SIREN: {personne.siren}</span>}
                                    {personne.ville && <span>• {personne.ville}</span>}
                                  </div>
                                </div>
                                <div className="ml-4 text-xs font-medium text-[#1A1C20] whitespace-nowrap">
                                  {getCompletionPercent(personne)} % complété
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton pour afficher plus de personnes */}
                        {(() => {
                          const personnesFiltered = getValidPersonnes(listing.personnes)
                          return personnesFiltered.length > 5 && (
                            <button
                              type="button"
                              onClick={() => toggleShowAllPersonnes(listing.id, true)}
                              className="w-full px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors mb-4"
                            >
                              {listing.showAllPersonnes
                                ? 'Afficher moins'
                                : `Afficher les ${personnesFiltered.length - 5} autres personnes`}
                            </button>
                          )
                        })()}

                        {/* Boutons d'action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#E1E5EB]">
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Continuer le listing:', listing.id)
                              // TODO: Implémenter la fonctionnalité
                            }}
                            className="flex-1 px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                          >
                            Continuer le Listing
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Copier le listing dans les listings enregistrés pour le modifier
                              const newListing: Listing = {
                                ...listing,
                                id: `list-${Date.now()}`,
                                dateCreation: new Date().toISOString().split('T')[0],
                                expanded: false,
                                showAllPersonnes: false,
                              }
                              setListingsEnregistres(prev => [...prev, newListing])
                              setActiveTab('gestion')
                              setSelectedListingGestion(newListing.id)
                            }}
                            className="flex-1 px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                          >
                            Modifier mon Listing
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#E1E5EB] p-8 text-center">
                  <p className="text-sm text-[#4B4F5C]">Aucun listing dans l'historique</p>
                </div>
              )
            )}

            {activeTab === 'gestion' && (
              // Onglet Gestion du Listing
              <div className={`bg-white border border-[#E1E5EB] ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
                {/* Sélection du listing */}
                <div className="p-4 border-b border-[#E1E5EB]">
                  <label className="block text-xs font-medium text-[#1A1C20] mb-2">
                    Sélectionner un listing
                  </label>
                  <select
                    value={selectedListingGestion}
                    onChange={(e) => {
                      setSelectedListingGestion(e.target.value)
                      // Réinitialiser les filtres des colonnes
                      setColumns(prev => prev.map(col => ({ ...col, filter: '' })))
                    }}
                    className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                  >
                    <option value="">-- Choisir un listing --</option>
                    {listingsEnregistres.map((listing) => (
                      <option key={listing.id} value={listing.id}>
                        {listing.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedListingGestion ? (
                  <div className="p-4">
                    {/* Prompt IA */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={promptIA}
                        onChange={(e) => setPromptIA(e.target.value)}
                        placeholder="Ressors les personnes sans rôle défini"
                        className="w-full px-4 py-3 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                      />
                    </div>

                    {/* Tableau des personnes */}
                    <div className="relative border border-[#E1E5EB] overflow-x-auto">
                      {/* Bouton Agrandir au-dessus du tableau */}
                      <div className="bg-[#F5F7FA] border-b border-[#E1E5EB] px-4 py-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setIsFullscreen(!isFullscreen)
                          }}
                          className="px-2 py-1 text-xs text-[#3A6FF7] hover:text-[#0d1b2a] hover:bg-[#F5F7FA] transition-colors"
                        >
                          {isFullscreen ? 'Réduire' : 'Agrandir'}
                        </button>
                      </div>
                      <table className="w-full border-collapse">
                        <thead>
                          {/* Ligne des filtres */}
                          <tr className="bg-[#F5F7FA] border-b border-[#E1E5EB]">
                            {visibleColumns.map((column) => (
                              <th
                                key={column.id}
                                draggable
                                onDragStart={() => handleDragStart(column.id)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(column.id)}
                                className={`px-4 py-2 border-r border-[#E1E5EB] cursor-move ${
                                  draggedColumn === column.id ? 'opacity-50' : ''
                                }`}
                              >
                                <input
                                  type="text"
                                  value={column.filter}
                                  onChange={(e) => updateColumnFilter(column.id, e.target.value)}
                                  placeholder={`Filtrer ${column.label}...`}
                                  className="w-full px-2 py-1 border border-[#E1E5EB] text-[#1A1C20] text-xs focus:outline-none focus:border-[#0d1b2a] bg-white"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </th>
                            ))}
                            <th className="px-4 py-2 text-center border-l border-[#E1E5EB]">
                              {availableColumns.length > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMoreColumns(true)
                                  }}
                                  className="px-2 py-1 text-xs text-[#3A6FF7] hover:text-[#0d1b2a] hover:bg-[#F5F7FA] transition-colors"
                                >
                                  + Colonnes
                                </button>
                              )}
                            </th>
                          </tr>
                          {/* Ligne des en-têtes */}
                          <tr className="bg-[#F5F7FA] border-b border-[#E1E5EB]">
                            {visibleColumns.map((column) => (
                              <th
                                key={column.id}
                                draggable
                                onDragStart={() => handleDragStart(column.id)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(column.id)}
                                className={`px-4 py-3 text-left text-xs font-bold text-[#1A1C20] border-r border-[#E1E5EB] cursor-move ${
                                  draggedColumn === column.id ? 'opacity-50' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {/* Petits points en carré pour indiquer le drag */}
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex gap-0.5">
                                      <span className="w-1 h-1 rounded-full bg-[#4B4F5C]"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#4B4F5C]"></span>
                                    </div>
                                    <div className="flex gap-0.5">
                                      <span className="w-1 h-1 rounded-full bg-[#4B4F5C]"></span>
                                      <span className="w-1 h-1 rounded-full bg-[#4B4F5C]"></span>
                                    </div>
                                  </div>
                                  <span>{column.label}</span>
                                </div>
                              </th>
                            ))}
                            <th className="px-4 py-3 text-center text-xs font-bold text-[#1A1C20] border-l border-[#E1E5EB]">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const selectedListing = listingsEnregistres.find(r => r.id === selectedListingGestion)
                            if (!selectedListing) return null

                            // Filtrer les personnes selon les filtres des colonnes
                            let filteredPersonnes = selectedListing.personnes.filter((personne) => {
                              return visibleColumns.every(column => {
                                const filterValue = column.filter.toLowerCase()
                                if (!filterValue) return true
                                
                                const value = (personne as any)[column.key]?.toLowerCase() || ''
                                return value.includes(filterValue)
                              })
                            })

                            return filteredPersonnes.map((personne, index) => (
                              <tr key={personne.id || index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                                {visibleColumns.map((column) => (
                                  <td key={column.id} className="px-4 py-3 border-r border-[#E1E5EB]">
                                    <input
                                      type="text"
                                      value={(personne as any)[column.key] || ''}
                                      onChange={(e) => {
                                        const newPersonnes = [...selectedListing.personnes]
                                        const personneIndex = newPersonnes.findIndex(
                                          (p) => p.id === personne.id
                                        )
                                        if (personneIndex !== -1) {
                                          newPersonnes[personneIndex] = { 
                                            ...newPersonnes[personneIndex], 
                                            [column.key]: e.target.value 
                                          }
                                          setListingsEnregistres(prev =>
                                            prev.map(r => r.id === selectedListingGestion
                                              ? { ...r, personnes: newPersonnes }
                                              : r
                                            )
                                          )
                                        }
                                      }}
                                      placeholder={column.label}
                                      className="w-full px-2 py-1 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                                    />
                                  </td>
                                ))}
                                <td className="px-4 py-3 text-center border-l border-[#E1E5EB]">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="particles-container relative inline-block min-w-[80px] min-h-[28px] rounded overflow-hidden">
                                      <AIBadge 
                                        networkSize="xs" 
                                        networkOpacity={1}
                                        className="w-full h-full"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            console.log('Compléter personne:', personne.id)
                                            // TODO: Implémenter la fonctionnalité de complétion
                                          }}
                                          className="px-2 py-1 text-xs text-white font-medium hover:opacity-90 transition-opacity relative z-10 w-full h-full"
                                        >
                                          Compléter
                                        </button>
                                      </AIBadge>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newPersonnes = selectedListing.personnes.filter(
                                          (p) => p.id !== personne.id
                                        )
                                        setListingsEnregistres(prev =>
                                          prev.map(r => r.id === selectedListingGestion
                                            ? { ...r, personnes: newPersonnes }
                                            : r
                                          )
                                        )
                                      }}
                                      className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                                      title="Supprimer"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          })()}
                        </tbody>
                      </table>
                      
                      {/* Bouton Ajouter une ligne */}
                      <div className="p-4 border-t border-[#E1E5EB] bg-white">
                        <div className="particles-container relative inline-block min-w-[140px] min-h-[36px] rounded overflow-hidden">
                          <AIBadge 
                            networkSize="xs" 
                            networkOpacity={1}
                            className="w-full h-full"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                const selectedListing = listingsEnregistres.find(r => r.id === selectedListingGestion)
                                if (!selectedListing) return
                                
                                const newPersonnes = [...selectedListing.personnes, { 
                                  id: `p-${Date.now()}-${Math.random()}`,
                                  nom: '',
                                  prenom: '',
                                  entreprise: '',
                                  role: ''
                                }]
                                setListingsEnregistres(prev =>
                                  prev.map(r => r.id === selectedListingGestion
                                    ? { ...r, personnes: newPersonnes }
                                    : r
                                  )
                                )
                              }}
                              className="px-4 py-2 text-sm text-white font-medium hover:opacity-90 transition-opacity relative z-10 w-full h-full"
                            >
                              + Ajouter une ligne
                            </button>
                          </AIBadge>
                        </div>
                      </div>
                      
                      {/* Menu pour afficher plus de colonnes */}
                      {showMoreColumns && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowMoreColumns(false)}
                          />
                          <div className="absolute right-4 top-4 bg-white border border-[#E1E5EB] shadow-lg z-20 p-4 min-w-[200px]">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-bold text-[#1A1C20]">Colonnes disponibles</h4>
                              <button
                                type="button"
                                onClick={() => setShowMoreColumns(false)}
                                className="text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="space-y-2">
                              {availableColumns.map((column) => (
                                <label key={column.id} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={column.visible}
                                    onChange={() => toggleColumnVisibility(column.id)}
                                    className="w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-xs text-[#1A1C20]">{column.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-[#4B4F5C]">Sélectionnez un listing pour commencer</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

