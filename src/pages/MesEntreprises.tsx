import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'
import AIBadge from '../components/ia/AIBadge'

interface Entreprise {
  siren: string
  nom: string
  ville?: string
  secteur?: string
  ca?: string
  effectif?: string
  dateCreation?: string
  formeJuridique?: string
}

interface Recherche {
  id: string
  nom: string
  dateCreation: string
  dateModification?: string
  entreprises: Entreprise[]
  expanded?: boolean
  showAllEntreprises?: boolean
}

interface ColumnConfig {
  id: string
  label: string
  key: keyof Entreprise | string
  visible: boolean
  order: number
  filter: string
}

export default function MesEntreprises() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'enregistrees' | 'historique' | 'gestion'>('enregistrees')
  const [selectedRechercheGestion, setSelectedRechercheGestion] = useState<string>('')
  const [promptIA, setPromptIA] = useState('')
  const [showMoreColumns, setShowMoreColumns] = useState(false)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Configuration des colonnes avec filtres
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'siren', label: 'SIREN', key: 'siren', visible: true, order: 0, filter: '' },
    { id: 'nom', label: 'Nom', key: 'nom', visible: true, order: 1, filter: '' },
    { id: 'ville', label: 'Ville', key: 'ville', visible: true, order: 2, filter: '' },
    { id: 'secteur', label: 'Secteur', key: 'secteur', visible: true, order: 3, filter: '' },
    { id: 'ca', label: 'CA', key: 'ca', visible: false, order: 4, filter: '' },
    { id: 'effectif', label: 'Effectif', key: 'effectif', visible: false, order: 5, filter: '' },
    { id: 'dateCreation', label: 'Date de création', key: 'dateCreation', visible: false, order: 6, filter: '' },
    { id: 'formeJuridique', label: 'Forme juridique', key: 'formeJuridique', visible: false, order: 7, filter: '' },
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
  
  // Recherches enregistrées
  const [recherchesEnregistrees, setRecherchesEnregistrees] = useState<Recherche[]>([
    {
      id: '1',
      nom: 'Entreprises tech Paris > 50 salariés',
      dateCreation: '2024-05-10',
      dateModification: '2024-05-15',
      entreprises: [
        { siren: '123456789', nom: 'TechCorp SAS', ville: 'Paris', secteur: 'Technologie' },
        { siren: '987654321', nom: 'DataFlow Solutions', ville: 'Paris', secteur: 'Data Science' },
        { siren: '555666777', nom: 'CloudTech Innovations', ville: 'Paris', secteur: 'Cloud Computing' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
    {
      id: '2',
      nom: 'Startups Fintech Lyon',
      dateCreation: '2024-04-20',
      entreprises: [
        { siren: '111222333', nom: 'PayTech Lyon', ville: 'Lyon', secteur: 'Fintech' },
        { siren: '444555666', nom: 'BankTech Solutions', ville: 'Lyon', secteur: 'Fintech' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
    {
      id: '3',
      nom: 'Retail > 100 employés',
      dateCreation: '2024-03-15',
      dateModification: '2024-05-01',
      entreprises: [
        { siren: '777888999', nom: 'RetailPro France', ville: 'Lille', secteur: 'Retail' },
        { siren: '123123123', nom: 'Boutique Moderne', ville: 'Marseille', secteur: 'Retail' },
        { siren: '456456456', nom: 'Commerce Plus', ville: 'Toulouse', secteur: 'Retail' },
        { siren: '789789789', nom: 'ShopChain', ville: 'Bordeaux', secteur: 'Retail' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
  ])
  
  // Historique de recherche
  const [historiqueRecherches, setHistoriqueRecherches] = useState<Recherche[]>([
    {
      id: 'h1',
      nom: 'Entreprises tech Paris > 50 salariés',
      dateCreation: '2024-05-20',
      entreprises: [
        { siren: '111111111', nom: 'AICorp France', ville: 'Paris', secteur: 'IA' },
        { siren: '222222222', nom: 'MachineLearn Pro', ville: 'Paris', secteur: 'IA' },
        { siren: '333333333', nom: 'TechStart SAS', ville: 'Paris', secteur: 'Tech' },
        { siren: '444444444', nom: 'DataFlow Solutions', ville: 'Paris', secteur: 'Data Science' },
        { siren: '555555555', nom: 'CloudTech Innovations', ville: 'Paris', secteur: 'Cloud' },
        { siren: '666666666', nom: 'DevSoft Systems', ville: 'Paris', secteur: 'Software' },
        { siren: '777777777', nom: 'CyberSec Corp', ville: 'Paris', secteur: 'Cybersecurity' },
        { siren: '888888888', nom: 'Blockchain Pro', ville: 'Paris', secteur: 'Blockchain' },
        { siren: '999999999', nom: 'AI Solutions', ville: 'Paris', secteur: 'IA' },
        { siren: '101010101', nom: 'BigData Analytics', ville: 'Paris', secteur: 'Data' },
        { siren: '121212121', nom: 'WebDev Studio', ville: 'Paris', secteur: 'Web' },
        { siren: '131313131', nom: 'MobileApp Corp', ville: 'Paris', secteur: 'Mobile' },
        { siren: '141414141', nom: 'Software Plus', ville: 'Paris', secteur: 'Software' },
        { siren: '151515151', nom: 'TechConsulting', ville: 'Paris', secteur: 'Consulting' },
        { siren: '161616161', nom: 'Digital Services', ville: 'Paris', secteur: 'Digital' },
        { siren: '171717171', nom: 'IT Solutions', ville: 'Paris', secteur: 'IT' },
        { siren: '181818181', nom: 'CodeFactory', ville: 'Paris', secteur: 'Development' },
        { siren: '191919191', nom: 'TechLab Paris', ville: 'Paris', secteur: 'R&D' },
        { siren: '202020202', nom: 'Innovation Hub', ville: 'Paris', secteur: 'Innovation' },
        { siren: '212121212', nom: 'FutureTech SAS', ville: 'Paris', secteur: 'Tech' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
    {
      id: 'h2',
      nom: 'SAS créées après 2020',
      dateCreation: '2024-05-18',
      entreprises: [
        { siren: '333333333', nom: 'Startup2021', ville: 'Paris', secteur: 'Tech' },
        { siren: '444444444', nom: 'NewCo 2022', ville: 'Lyon', secteur: 'Services' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
    {
      id: 'h3',
      nom: 'Entreprises du secteur santé',
      dateCreation: '2024-05-15',
      entreprises: [
        { siren: '555555555', nom: 'HealthTech Solutions', ville: 'Paris', secteur: 'Santé' },
        { siren: '666666666', nom: 'MedTech Innovations', ville: 'Lyon', secteur: 'Santé' },
        { siren: '777777777', nom: 'BioPharma Corp', ville: 'Marseille', secteur: 'Santé' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
    {
      id: 'h4',
      nom: 'Scale-ups avec CA > 5M€',
      dateCreation: '2024-05-12',
      entreprises: [
        { siren: '888888888', nom: 'ScaleUp1', ville: 'Paris', secteur: 'Tech' },
      ],
      expanded: false,
      showAllEntreprises: false,
    },
  ])

  const toggleRecherche = (id: string, isHistorique: boolean) => {
    if (isHistorique) {
      setHistoriqueRecherches(prev =>
        prev.map(r => r.id === id ? { ...r, expanded: !r.expanded, showAllEntreprises: false } : r)
      )
    } else {
      setRecherchesEnregistrees(prev =>
        prev.map(r => r.id === id ? { ...r, expanded: !r.expanded, showAllEntreprises: false } : r)
      )
    }
  }

  const toggleShowAllEntreprises = (id: string, isHistorique: boolean) => {
    if (isHistorique) {
      setHistoriqueRecherches(prev =>
        prev.map(r => r.id === id ? { ...r, showAllEntreprises: !r.showAllEntreprises } : r)
      )
    } else {
      setRecherchesEnregistrees(prev =>
        prev.map(r => r.id === id ? { ...r, showAllEntreprises: !r.showAllEntreprises } : r)
      )
    }
  }

  // Calculer le pourcentage de complétion d'une entreprise
  const getCompletionPercent = (entreprise: Entreprise): number => {
    const fields = ['siren', 'nom', 'ville', 'secteur', 'ca', 'effectif', 'dateCreation', 'formeJuridique']
    const filledFields = fields.filter(field => {
      const value = entreprise[field as keyof Entreprise]
      return value && value.toString().trim() !== ''
    }).length
    return Math.round((filledFields / fields.length) * 100)
  }

  // Filtrer les entreprises avec SIREN valide
  const getValidEntreprises = (entreprises: Entreprise[]): Entreprise[] => {
    return entreprises.filter(ent => ent.siren && ent.siren.trim() !== '')
  }

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <FiltersSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E1E5EB] p-6">
          <h1 className="text-2xl font-bold text-[#1A1C20]">Mes Entreprises</h1>
          <p className="text-sm text-[#4B4F5C] mt-1">Gérez vos recherches enregistrées et consultez votre historique</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Onglets */}
          <div className="flex items-center border-b border-[#E1E5EB] bg-white mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('enregistrees')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'enregistrees'
                  ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                  : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
              }`}
            >
              Mes Recherches enregistrées
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
              Mon historique de recherche
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
              Gestion de la Recherche
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-4">
            {activeTab === 'enregistrees' && (
              // Liste des recherches enregistrées
              recherchesEnregistrees.length > 0 ? (
                recherchesEnregistrees.map((recherche) => (
                  <div key={recherche.id} className="bg-white border border-[#E1E5EB]">
                    <button
                      type="button"
                      onClick={() => toggleRecherche(recherche.id, false)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F7FA] transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#1A1C20] mb-1">{recherche.nom}</h3>
                        <div className="flex items-center gap-4 text-xs text-[#4B4F5C]">
                          <span>Créée le {new Date(recherche.dateCreation).toLocaleDateString('fr-FR')}</span>
                          {recherche.dateModification && (
                            <span>Modifiée le {new Date(recherche.dateModification).toLocaleDateString('fr-FR')}</span>
                          )}
                          <span>{getValidEntreprises(recherche.entreprises).length} entreprise{getValidEntreprises(recherche.entreprises).length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[#4B4F5C] transition-transform ${recherche.expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {recherche.expanded && (
                      <div className="border-t border-[#E1E5EB] p-4 bg-[#F5F7FA]">
                        <div className="space-y-2 mb-4">
                          {(recherche.showAllEntreprises
                            ? recherche.entreprises.filter(ent => ent.siren && ent.siren.trim() !== '')
                            : recherche.entreprises.filter(ent => ent.siren && ent.siren.trim() !== '').slice(0, 5)
                          ).map((entreprise, index) => (
                            <div
                              key={index}
                              className="bg-white border border-[#E1E5EB] p-3 hover:border-[#0d1b2a] transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-[#1A1C20]">{entreprise.nom}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-[#4B4F5C]">
                                    <span>SIREN: {entreprise.siren}</span>
                                    {entreprise.ville && <span>• {entreprise.ville}</span>}
                                    {entreprise.secteur && <span>• {entreprise.secteur}</span>}
                                  </div>
                                </div>
                                <div className="ml-4 text-xs font-medium text-[#1A1C20] whitespace-nowrap">
                                  {getCompletionPercent(entreprise)} % complété
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton pour afficher plus d'entreprises */}
                        {(() => {
                          const entreprisesFiltered = recherche.entreprises.filter(ent => ent.siren && ent.siren.trim() !== '')
                          return entreprisesFiltered.length > 5 && (
                            <button
                              type="button"
                              onClick={() => toggleShowAllEntreprises(recherche.id, false)}
                              className="w-full px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors mb-4"
                            >
                              {recherche.showAllEntreprises
                                ? 'Afficher moins'
                                : `Afficher les ${entreprisesFiltered.length - 5} autres entreprises`}
                            </button>
                          )
                        })()}

                        {/* Boutons d'action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#E1E5EB]">
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Continuer la recherche:', recherche.id)
                              // TODO: Implémenter la fonctionnalité
                            }}
                            className="flex-1 px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                          >
                            Continuer la Recherche
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Qualifier la recherche:', recherche.id)
                              // TODO: Implémenter la fonctionnalité
                            }}
                            className="flex-1 px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors relative group"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <span>Qualifier la Recherche en listing</span>
                              <div className="relative group/info">
                                <svg
                                  className="w-4 h-4 text-[#4B4F5C] cursor-help"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {/* Tooltip */}
                                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 px-3 py-2 bg-[#1A1C20] text-white text-xs whitespace-normal max-w-[250px] opacity-0 group-hover/info:opacity-100 pointer-events-none transition-opacity z-50 rounded">
                                  Transformer la Recherche en Listing afin de créer un Listing avec une ligne par actionnaire et non une ligne par société
                                </div>
                              </div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab('gestion')
                              setSelectedRechercheGestion(recherche.id)
                            }}
                            className="flex-1 px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                          >
                            Modifier ma Recherche
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#E1E5EB] p-8 text-center">
                  <p className="text-sm text-[#4B4F5C]">Aucune recherche enregistrée</p>
                </div>
              )
            )}

            {activeTab === 'historique' && (
              // Liste de l'historique
              historiqueRecherches.length > 0 ? (
                historiqueRecherches.map((recherche) => (
                  <div key={recherche.id} className="bg-white border border-[#E1E5EB]">
                    <button
                      type="button"
                      onClick={() => toggleRecherche(recherche.id, true)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F7FA] transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-[#1A1C20] mb-1">{recherche.nom}</h3>
                        <div className="flex items-center gap-4 text-xs text-[#4B4F5C]">
                          <span>Effectuée le {new Date(recherche.dateCreation).toLocaleDateString('fr-FR')}</span>
                          <span>{getValidEntreprises(recherche.entreprises).length} entreprise{getValidEntreprises(recherche.entreprises).length > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-[#4B4F5C] transition-transform ${recherche.expanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {recherche.expanded && (
                      <div className="border-t border-[#E1E5EB] p-4 bg-[#F5F7FA]">
                        <div className="space-y-2 mb-4">
                          {(recherche.showAllEntreprises
                            ? recherche.entreprises.filter(ent => ent.siren && ent.siren.trim() !== '')
                            : recherche.entreprises.filter(ent => ent.siren && ent.siren.trim() !== '').slice(0, 5)
                          ).map((entreprise, index) => (
                            <div
                              key={index}
                              className="bg-white border border-[#E1E5EB] p-3 hover:border-[#0d1b2a] transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-[#1A1C20]">{entreprise.nom}</h4>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-[#4B4F5C]">
                                    <span>SIREN: {entreprise.siren}</span>
                                    {entreprise.ville && <span>• {entreprise.ville}</span>}
                                    {entreprise.secteur && <span>• {entreprise.secteur}</span>}
                                  </div>
                                </div>
                                <div className="ml-4 text-xs font-medium text-[#1A1C20] whitespace-nowrap">
                                  {getCompletionPercent(entreprise)} % complété
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton pour afficher plus d'entreprises */}
                        {(() => {
                          const entreprisesFiltered = getValidEntreprises(recherche.entreprises)
                          return entreprisesFiltered.length > 5 && (
                            <button
                              type="button"
                              onClick={() => toggleShowAllEntreprises(recherche.id, true)}
                              className="w-full px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors mb-4"
                            >
                              {recherche.showAllEntreprises
                                ? 'Afficher moins'
                                : `Afficher les ${entreprisesFiltered.length - 5} autres entreprises`}
                            </button>
                          )
                        })()}

                        {/* Boutons d'action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#E1E5EB]">
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Continuer la recherche:', recherche.id)
                              // TODO: Implémenter la fonctionnalité
                            }}
                            className="flex-1 px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                          >
                            Continuer la Recherche
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Copier la recherche dans les recherches enregistrées pour la modifier
                              const newRecherche: Recherche = {
                                ...recherche,
                                id: `enr-${Date.now()}`,
                                dateCreation: new Date().toISOString().split('T')[0],
                                expanded: false,
                                showAllEntreprises: false,
                              }
                              setRecherchesEnregistrees(prev => [...prev, newRecherche])
                              setActiveTab('gestion')
                              setSelectedRechercheGestion(newRecherche.id)
                            }}
                            className="flex-1 px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
                          >
                            Modifier ma Recherche
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border border-[#E1E5EB] p-8 text-center">
                  <p className="text-sm text-[#4B4F5C]">Aucune recherche dans l'historique</p>
                </div>
              )
            )}

            {activeTab === 'gestion' && (
              // Onglet Gestion de la Recherche
              <div className={`bg-white border border-[#E1E5EB] ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
                {/* Sélection de la recherche */}
                <div className="p-4 border-b border-[#E1E5EB]">
                  <label className="block text-xs font-medium text-[#1A1C20] mb-2">
                    Sélectionner une recherche
                  </label>
                  <select
                    value={selectedRechercheGestion}
                    onChange={(e) => {
                      setSelectedRechercheGestion(e.target.value)
                      // Réinitialiser les filtres des colonnes
                      setColumns(prev => prev.map(col => ({ ...col, filter: '' })))
                    }}
                    className="w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                  >
                    <option value="">-- Choisir une recherche --</option>
                    {recherchesEnregistrees.map((recherche) => (
                      <option key={recherche.id} value={recherche.id}>
                        {recherche.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedRechercheGestion ? (
                  <div className="p-4">
                    {/* Prompt IA */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={promptIA}
                        onChange={(e) => setPromptIA(e.target.value)}
                        placeholder="Ressors les sociétés sans chiffres d'affaires"
                        className="w-full px-4 py-3 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] bg-white"
                      />
                    </div>

                    {/* Tableau des entreprises */}
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
                            const selectedRecherche = recherchesEnregistrees.find(r => r.id === selectedRechercheGestion)
                            if (!selectedRecherche) return null

                            // Filtrer les entreprises selon les filtres des colonnes
                            let filteredEntreprises = selectedRecherche.entreprises.filter((entreprise) => {
                              return visibleColumns.every(column => {
                                const filterValue = column.filter.toLowerCase()
                                if (!filterValue) return true
                                
                                const value = (entreprise as any)[column.key]?.toLowerCase() || ''
                                return value.includes(filterValue)
                              })
                            })

                            return filteredEntreprises.map((entreprise, index) => (
                              <tr key={`${entreprise.siren}-${entreprise.nom}-${index}`} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                                {visibleColumns.map((column) => (
                                  <td key={column.id} className="px-4 py-3 border-r border-[#E1E5EB]">
                                    <input
                                      type="text"
                                      value={(entreprise as any)[column.key] || ''}
                                      onChange={(e) => {
                                        const newEntreprises = [...selectedRecherche.entreprises]
                                        const entrepriseIndex = newEntreprises.findIndex(
                                          (ent) => ent.siren === entreprise.siren && ent.nom === entreprise.nom
                                        )
                                        if (entrepriseIndex !== -1) {
                                          newEntreprises[entrepriseIndex] = { 
                                            ...newEntreprises[entrepriseIndex], 
                                            [column.key]: e.target.value 
                                          }
                                          setRecherchesEnregistrees(prev =>
                                            prev.map(r => r.id === selectedRechercheGestion
                                              ? { ...r, entreprises: newEntreprises }
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
                                            console.log('Compléter entreprise:', entreprise.siren)
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
                                        const newEntreprises = selectedRecherche.entreprises.filter(
                                          (ent) => !(ent.siren === entreprise.siren && ent.nom === entreprise.nom)
                                        )
                                        setRecherchesEnregistrees(prev =>
                                          prev.map(r => r.id === selectedRechercheGestion
                                            ? { ...r, entreprises: newEntreprises }
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
                                const selectedRecherche = recherchesEnregistrees.find(r => r.id === selectedRechercheGestion)
                                if (!selectedRecherche) return
                                
                                const newEntreprises = [...selectedRecherche.entreprises, { 
                                  siren: '', 
                                  nom: '', 
                                  ville: '', 
                                  secteur: '' 
                                }]
                                setRecherchesEnregistrees(prev =>
                                  prev.map(r => r.id === selectedRechercheGestion
                                    ? { ...r, entreprises: newEntreprises }
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
                    <p className="text-sm text-[#4B4F5C]">Sélectionnez une recherche pour commencer</p>
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

