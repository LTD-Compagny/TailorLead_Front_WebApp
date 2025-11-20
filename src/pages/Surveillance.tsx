import { useState } from 'react'
import FiltersSidebar from '../components/results/FiltersSidebar'

interface Surveillance {
  id: string
  nom: string
  description?: string
  dateCreation: string
  active: boolean
  nbAlertes: number
  canauxAlerte: ('mail' | 'tailorlead')[]
}

export default function Surveillance() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [rechercheExpanded, setRechercheExpanded] = useState(false)
  const [listingExpanded, setListingExpanded] = useState(false)
  const [selectedSurveillance, setSelectedSurveillance] = useState<Surveillance | null>(null)
  const [selectedListing, setSelectedListing] = useState<Surveillance | null>(null)
  const [isEditMode, setIsEditMode] = useState(false) // true si on édite une surveillance existante
  const [isListingEditMode, setIsListingEditMode] = useState(false) // true si on édite un listing existant
  const [filtersEditable, setFiltersEditable] = useState(false) // true si les filtres peuvent être modifiés
  const [listingEditable, setListingEditable] = useState(false) // true si le listing peut être modifié
  const [contactEditable, setContactEditable] = useState(false)
  const [listingContactEditable, setListingContactEditable] = useState(false)
  const [notificationOptionsEditable, setNotificationOptionsEditable] = useState(false)
  const [listingNotificationOptionsEditable, setListingNotificationOptionsEditable] = useState(false)
  const [activeTab, setActiveTab] = useState<'recherche' | 'contact' | 'alertes'>('recherche')
  const [activeListingTab, setActiveListingTab] = useState<'listing' | 'contact' | 'alertes'>('listing')
  
  // Filtres pour la surveillance
  const [filters, setFilters] = useState({
    caMin: '',
    effectifMin: '',
    secteur: '',
    dateCreationMin: '',
    formeJuridique: '',
    codeNAF: ''
  })
  
  const [appliedFilters, setAppliedFilters] = useState<string[]>([])
  const [appliedFiltersValues, setAppliedFiltersValues] = useState<Record<string, string>>({})
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [selectedAdditionalFilters, setSelectedAdditionalFilters] = useState<string[]>([])
  
  // Liste des filtres supplémentaires disponibles
  const additionalFilters = [
    { id: 'trancheEffectif', label: 'Tranche d\'effectif', type: 'text' },
    { id: 'trancheCA', label: 'Tranche de CA', type: 'text' },
    { id: 'region', label: 'Région', type: 'text' },
    { id: 'departement', label: 'Département', type: 'text' },
    { id: 'codePostal', label: 'Code postal', type: 'text' },
    { id: 'activitePrincipale', label: 'Activité principale', type: 'text' },
    { id: 'statut', label: 'Statut', type: 'text' },
    { id: 'dateDerniereModification', label: 'Date dernière modification', type: 'date' },
    { id: 'capitalMin', label: 'Capital minimum', type: 'number' },
    { id: 'capitalMax', label: 'Capital maximum', type: 'number' }
  ]
  
  const [excludeListings, setExcludeListings] = useState(false)
  
  // Données du listing (pour les surveillances de listing)
  const [listingData, setListingData] = useState({
    nom: '',
    description: '',
    entreprises: [] as string[],
  })
  
  // Contact pour le listing
  const [listingContact, setListingContact] = useState({
    canaux: {
      mail: false,
      whatsapp: false,
      slack: false,
    },
    mails: [] as string[],
    whatsappNumbers: [] as string[],
    slackUrls: [] as string[],
  })
  
  // Options de notification pour le listing
  const [listingNotificationOptions, setListingNotificationOptions] = useState({
    parEvenement: false,
    resumeHeurePrecise: false,
    heureResume: '',
    resumeAvantHeure: false,
    nbEvenementsMax: '',
  })
  
  // Alertes pour les listings
  const [listingAlertes, setListingAlertes] = useState<Alerte[]>([])
  
  // Historique des alertes
  interface Alerte {
    id: string
    date: string
    titre: string
    description: string
    canal: 'mail' | 'whatsapp' | 'slack' | 'in-app'
    statut: 'envoyé' | 'échec'
  }
  
  const [alertes, setAlertes] = useState<Alerte[]>([
    {
      id: '1',
      date: '2024-05-15T10:30:00',
      titre: 'Nouvelle entreprise trouvée : TechStart SAS',
      description: 'Une entreprise correspondant à vos critères a été trouvée',
      canal: 'mail',
      statut: 'envoyé',
    },
    {
      id: '2',
      date: '2024-05-14T15:45:00',
      titre: 'Résumé quotidien - 5 nouvelles entreprises',
      description: 'Résumé des 5 entreprises trouvées aujourd\'hui',
      canal: 'slack',
      statut: 'envoyé',
    },
    {
      id: '3',
      date: '2024-05-14T09:00:00',
      titre: 'Modification détectée : Acme Corp',
      description: 'Des modifications ont été détectées sur cette entreprise',
      canal: 'whatsapp',
      statut: 'envoyé',
    },
    {
      id: '4',
      date: '2024-05-13T14:20:00',
      titre: 'Alerte urgente : 10+ événements détectés',
      description: 'Le nombre d\'événements a dépassé le seuil, résumé envoyé',
      canal: 'in-app',
      statut: 'envoyé',
    },
  ])
  
  // Contact pour la surveillance
  const [contact, setContact] = useState({
    canaux: {
      mail: false,
      whatsapp: false,
      slack: false,
    },
    mails: [] as string[],
    whatsappNumbers: [] as string[],
    slackUrls: [] as string[],
  })
  
  // Options de notification
  const [notificationOptions, setNotificationOptions] = useState({
    parEvenement: false,
    resumeHeurePrecise: false,
    heureResume: '',
    resumeAvantHeure: false,
    nbEvenementsMax: '',
  })

  // Données mock - à remplacer par des vraies données
  const [surveillancesRecherche, setSurveillancesRecherche] = useState<Surveillance[]>([
    {
      id: '1',
      nom: 'Entreprises Tech Paris avec CA > 5M€',
      description: 'Surveillance des entreprises du secteur technologie à Paris avec un chiffre d\'affaires supérieur à 5 millions d\'euros',
      dateCreation: '2024-01-15',
      active: true,
      nbAlertes: 24,
      canauxAlerte: ['mail', 'tailorlead'],
    },
    {
      id: '2',
      nom: 'Startups IA créées après 2020',
      description: 'Surveillance des startups dans le domaine de l\'intelligence artificielle créées après 2020',
      dateCreation: '2024-02-20',
      active: true,
      nbAlertes: 12,
      canauxAlerte: ['mail'],
    },
    {
      id: '3',
      nom: 'SAS avec effectif > 30 salariés',
      description: 'Recherche de sociétés SAS avec un effectif supérieur à 30 salariés',
      dateCreation: '2024-03-10',
      active: false,
      nbAlertes: 0,
      canauxAlerte: ['tailorlead'],
    },
  ])

  const [surveillancesListing, setSurveillancesListing] = useState<Surveillance[]>([
    {
      id: '4',
      nom: 'Liste des entreprises vendues à Mistral AI',
      description: 'Surveillance des acquisitions réalisées par Mistral AI dans le secteur de la tech',
      dateCreation: '2024-01-05',
      active: true,
      nbAlertes: 8,
      canauxAlerte: ['mail', 'tailorlead'],
    },
    {
      id: '5',
      nom: 'Entreprises du secteur Retail à Lyon',
      description: 'Listing des entreprises du secteur du retail situées à Lyon et sa région',
      dateCreation: '2024-02-14',
      active: true,
      nbAlertes: 15,
      canauxAlerte: ['mail'],
    },
    {
      id: '6',
      nom: 'Startups Fintech Paris',
      description: 'Surveillance des startups fintech basées à Paris',
      dateCreation: '2024-04-01',
      active: true,
      nbAlertes: 3,
      canauxAlerte: ['tailorlead'],
    },
    {
      id: '7',
      nom: 'Entreprises avec code NAF 6201Z',
      description: 'Listing des entreprises avec le code NAF 6201Z (programmation informatique)',
      dateCreation: '2024-03-25',
      active: false,
      nbAlertes: 0,
      canauxAlerte: ['mail', 'tailorlead'],
    },
  ])
  
  // Liste des listings disponibles pour créer une surveillance
  interface AvailableListing {
    id: string
    nom: string
    description: string
    entreprises: string[]
  }
  
  const availableListings: AvailableListing[] = [
    {
      id: 'available-1',
      nom: 'Liste des entreprises vendues à Mistral AI',
      description: 'Entreprises acquises par Mistral AI dans le secteur de la tech',
      entreprises: ['SIREN123456789', 'SIREN987654321', 'SIREN555666777'],
    },
    {
      id: 'available-2',
      nom: 'Entreprises du secteur Retail à Lyon',
      description: 'Entreprises du secteur retail situées à Lyon et sa région',
      entreprises: ['SIREN111222333', 'SIREN444555666'],
    },
    {
      id: 'available-3',
      nom: 'Startups Fintech Paris',
      description: 'Startups fintech basées à Paris',
      entreprises: ['SIREN777888999', 'SIREN888999000'],
    },
    {
      id: 'available-4',
      nom: 'Entreprises avec code NAF 6201Z',
      description: 'Entreprises avec le code NAF 6201Z (programmation informatique)',
      entreprises: ['SIREN123123123', 'SIREN456456456', 'SIREN789789789'],
    },
    {
      id: 'available-5',
      nom: 'Scale-ups IA en France',
      description: 'Entreprises françaises spécialisées en intelligence artificielle',
      entreprises: ['SIREN111111111', 'SIREN222222222'],
    },
    {
      id: 'available-6',
      nom: 'SAS de plus de 50 salariés',
      description: 'Sociétés SAS avec un effectif supérieur à 50 salariés',
      entreprises: ['SIREN333333333', 'SIREN444444444', 'SIREN555555555'],
    },
  ]
  
  // Mock des entreprises dans les listings (pour affichage)
  const listingEntreprises: Record<string, string[]> = {
    '4': ['SIREN123456789', 'SIREN987654321', 'SIREN555666777'],
    '5': ['SIREN111222333', 'SIREN444555666'],
    '6': ['SIREN777888999'],
    '7': ['SIREN123123123'],
  }
  
  // Mock des entreprises avec leurs noms (pour les alertes)
  const entrepriseNames: Record<string, string> = {
    'SIREN123456789': 'TechStart SAS',
    'SIREN987654321': 'DataFlow Solutions',
    'SIREN555666777': 'CloudTech Innovations',
    'SIREN111222333': 'RetailPro Lyon',
    'SIREN444555666': 'Boutique Moderne',
    'SIREN777888999': 'PayTech Paris',
    'SIREN123123123': 'DevSoft Systems',
  }
  
  // Mock des alertes pour les listings (spécifiques aux entreprises du listing)
  const listingAlertesMock: Record<string, Alerte[]> = {
    '4': [
      {
        id: 'l1',
        date: '2024-05-15T10:30:00',
        titre: 'Modification de statut : TechStart SAS',
        description: 'TechStart SAS (SIREN123456789) a changé son statut juridique de SAS à SASU',
        canal: 'mail',
        statut: 'envoyé',
      },
      {
        id: 'l2',
        date: '2024-05-14T14:20:00',
        titre: 'Changement de dirigeant : DataFlow Solutions',
        description: 'DataFlow Solutions (SIREN987654321) a un nouveau directeur général',
        canal: 'mail',
        statut: 'envoyé',
      },
      {
        id: 'l3',
        date: '2024-05-13T09:15:00',
        titre: 'Acquisition : CloudTech Innovations',
        description: 'CloudTech Innovations (SIREN555666777) a été acquise par TechCorp International',
        canal: 'mail',
        statut: 'envoyé',
      },
    ],
    '5': [
      {
        id: 'l4',
        date: '2024-05-14T15:45:00',
        titre: 'Cession d\'entité : RetailPro Lyon',
        description: 'RetailPro Lyon (SIREN111222333) a cédé une filiale à Retail Group Europe',
        canal: 'mail',
        statut: 'envoyé',
      },
      {
        id: 'l5',
        date: '2024-05-13T11:30:00',
        titre: 'Modification de statut : Boutique Moderne',
        description: 'Boutique Moderne (SIREN444555666) a changé son statut de SARL à SAS',
        canal: 'mail',
        statut: 'envoyé',
      },
    ],
    '6': [
      {
        id: 'l6',
        date: '2024-05-12T16:00:00',
        titre: 'Changement de dirigeant : PayTech Paris',
        description: 'PayTech Paris (SIREN777888999) a un nouveau président du conseil d\'administration',
        canal: 'tailorlead',
        statut: 'envoyé',
      },
    ],
    '7': [],
  }
  
  const [selectedAvailableListing, setSelectedAvailableListing] = useState<AvailableListing | null>(null)

  const handleAddSurveillance = (type: 'recherche' | 'listing') => {
    if (type === 'listing') {
      const newListing: Surveillance = {
        id: 'new',
        nom: '',
        dateCreation: new Date().toISOString().split('T')[0],
        active: true,
        nbAlertes: 0,
        canauxAlerte: [],
      }
      setSelectedListing(newListing)
      setIsListingEditMode(false)
      setListingEditable(true)
      setListingContactEditable(true)
      setListingNotificationOptionsEditable(true)
      setActiveListingTab('listing')
      setSelectedAvailableListing(null)
      setListingData({
        nom: '',
        description: '',
        entreprises: [],
      })
      setListingContact({
        canaux: {
          mail: false,
          whatsapp: false,
          slack: false,
        },
        mails: [],
        whatsappNumbers: [],
        slackUrls: [],
      })
      setListingNotificationOptions({
        parEvenement: false,
        resumeHeurePrecise: false,
        heureResume: '',
        resumeAvantHeure: false,
        nbEvenementsMax: '',
      })
      setListingAlertes([])
      return
    }
    
    console.log(`Ajouter une surveillance de ${type}`)
    // Créer une nouvelle surveillance vide pour le mode ajout
    const newSurveillance: Surveillance = {
      id: 'new',
      nom: `Nouvelle surveillance de ${type}`,
      dateCreation: new Date().toISOString().split('T')[0],
      active: true,
      nbAlertes: 0,
      canauxAlerte: [],
    }
    setSelectedSurveillance(newSurveillance)
    setIsEditMode(false) // Mode ajout = champs libres
    setFiltersEditable(true)
    setActiveTab('recherche')
    // Réinitialiser les filtres
    setFilters({
      caMin: '',
      effectifMin: '',
      secteur: '',
      dateCreationMin: '',
      formeJuridique: '',
      codeNAF: ''
    })
    setAppliedFilters([])
    setAppliedFiltersValues({})
    setExcludeListings(false)
  }

  return (
    <div className="flex h-screen bg-[#F7F9FC]">
      {/* Sidebar */}
      <FiltersSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-[#E1E5EB] p-6">
          <h1 className="text-2xl font-bold text-[#1A1C20]">Mes Surveillances</h1>
          <p className="text-sm text-[#4B4F5C] mt-1">Gérez vos surveillances d'entreprises et de secteurs</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mes Surveillances de Recherche */}
          <div className="bg-white border border-[#E1E5EB]">
            <button
              type="button"
              onClick={() => setRechercheExpanded(!rechercheExpanded)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F7FA] transition-colors"
            >
              <span className="text-lg font-bold text-[#1A1C20]">Mes Surveillances de Recherche</span>
              <svg
                className={`w-5 h-5 text-[#4B4F5C] transition-transform ${rechercheExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {rechercheExpanded && (
              <div className="border-t border-[#E1E5EB] p-4 space-y-4">
                {surveillancesRecherche.length > 0 ? (
                  surveillancesRecherche.map((surveillance) => (
                    <div
                      key={surveillance.id}
                      onClick={() => {
                        setSelectedSurveillance(surveillance)
                        setIsEditMode(true) // Mode édition = filtres figés
                        setFiltersEditable(false) // Filtres figés par défaut
                        setActiveTab('recherche')
                        // Initialiser les filtres avec des valeurs pré-remplies (exemple)
                        // TODO: Remplacer par les vraies valeurs de la surveillance
                        setFilters({
                          caMin: '5000000',
                          effectifMin: '30',
                          secteur: 'Tech',
                          dateCreationMin: '2020-01-01',
                          formeJuridique: 'SAS',
                          codeNAF: '6201Z'
                        })
                        setAppliedFilters(['trancheCA', 'region']) // Exemple de filtres appliqués
                        setAppliedFiltersValues({ trancheCA: '5M-10M', region: 'Île-de-France' })
                        setExcludeListings(false)
                        // Initialiser les contacts avec des valeurs d'exemple
                        setContact({
                          canaux: {
                            mail: true,
                            whatsapp: false,
                            slack: true,
                          },
                          mails: ['contact@example.com', 'admin@example.com'],
                          whatsappNumbers: [],
                          slackUrls: ['https://hooks.slack.com/services/xxx'],
                        })
                        setContactEditable(false)
                      }}
                      className="bg-[#F5F7FA] border border-[#E1E5EB] p-4 hover:border-[#0d1b2a] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#1A1C20] mb-1">{surveillance.nom}</h3>
                          {surveillance.description && (
                            <p className="text-sm text-[#4B4F5C] mb-2">{surveillance.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-[#4B4F5C]">
                              Créée le {new Date(surveillance.dateCreation).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-[#4B4F5C] font-medium">
                              {surveillance.nbAlertes} alerte{surveillance.nbAlertes > 1 ? 's' : ''} envoyée{surveillance.nbAlertes > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-1">
                            {surveillance.canauxAlerte.includes('mail') && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                                Mail
                              </span>
                            )}
                            {surveillance.canauxAlerte.includes('tailorlead') && (
                              <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 border border-purple-200">
                                In-App
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 ${
                              surveillance.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {surveillance.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#4B4F5C] text-center py-4">
                    Aucune surveillance de recherche enregistrée
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleAddSurveillance('recherche')}
                  className="w-full px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                >
                  Ajouter une Surveillance
                </button>
              </div>
            )}
          </div>

          {/* Mes Surveillances de Listing */}
          <div className="bg-white border border-[#E1E5EB]">
            <button
              type="button"
              onClick={() => setListingExpanded(!listingExpanded)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#F5F7FA] transition-colors"
            >
              <span className="text-lg font-bold text-[#1A1C20]">Mes Surveillances de Listing</span>
              <svg
                className={`w-5 h-5 text-[#4B4F5C] transition-transform ${listingExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {listingExpanded && (
              <div className="border-t border-[#E1E5EB] p-4 space-y-4">
                {surveillancesListing.length > 0 ? (
                  surveillancesListing.map((surveillance) => (
                    <div
                      key={surveillance.id}
                      onClick={() => {
                        setSelectedListing(surveillance)
                        setIsListingEditMode(true)
                        setListingEditable(false)
                        setListingContactEditable(false)
                        setListingNotificationOptionsEditable(false)
                        setActiveListingTab('listing')
                        setListingData({
                          nom: surveillance.nom,
                          description: surveillance.description || '',
                          entreprises: listingEntreprises[surveillance.id] || [],
                        })
                        setListingContact({
                          canaux: {
                            mail: surveillance.canauxAlerte.includes('mail'),
                            whatsapp: surveillance.canauxAlerte.includes('whatsapp'),
                            slack: surveillance.canauxAlerte.includes('slack'),
                          },
                          mails: surveillance.canauxAlerte.includes('mail') ? ['contact@example.com'] : [],
                          whatsappNumbers: surveillance.canauxAlerte.includes('whatsapp') ? ['+33612345678'] : [],
                          slackUrls: surveillance.canauxAlerte.includes('slack') ? ['https://hooks.slack.com/services/xxx'] : [],
                        })
                        setListingNotificationOptions({
                          parEvenement: false,
                          resumeHeurePrecise: false,
                          heureResume: '',
                          resumeAvantHeure: false,
                          nbEvenementsMax: '',
                        })
                        // Charger les alertes pour ce listing
                        setListingAlertes(listingAlertesMock[surveillance.id] || [])
                        
                        // Mettre à jour le nom du listing sélectionné dans selectedListing
                        if (selectedListing) {
                          setSelectedListing({
                            ...selectedListing,
                            nom: surveillance.nom,
                          })
                        }
                      }}
                      className="bg-[#F5F7FA] border border-[#E1E5EB] p-4 hover:border-[#0d1b2a] transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-[#1A1C20] mb-1">{surveillance.nom}</h3>
                          {surveillance.description && (
                            <p className="text-sm text-[#4B4F5C] mb-2">{surveillance.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-[#4B4F5C]">
                              Créée le {new Date(surveillance.dateCreation).toLocaleDateString('fr-FR')}
                            </p>
                            <p className="text-xs text-[#4B4F5C] font-medium">
                              {listingEntreprises[surveillance.id]?.length || 0} entreprise{(listingEntreprises[surveillance.id]?.length || 0) > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-[#4B4F5C] font-medium">
                              {surveillance.nbAlertes} alerte{surveillance.nbAlertes > 1 ? 's' : ''} envoyée{surveillance.nbAlertes > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-1">
                            {surveillance.canauxAlerte.includes('mail') && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200">
                                Mail
                              </span>
                            )}
                            {surveillance.canauxAlerte.includes('tailorlead') && (
                              <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-800 border border-purple-200">
                                In-App
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs px-2 py-1 ${
                              surveillance.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {surveillance.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#4B4F5C] text-center py-4">
                    Aucune surveillance de listing enregistrée
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleAddSurveillance('listing')}
                  className="w-full px-4 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                >
                  Ajouter une Surveillance
                </button>
              </div>
            )}
          </div>

          {/* Modal de modification de surveillance */}
          {selectedSurveillance && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => {
                setSelectedSurveillance(null)
                setIsEditMode(false)
                setFiltersEditable(false)
                setContactEditable(false)
                setNotificationOptionsEditable(false)
              }}
            >
              <div
                className="bg-white w-[90vw] max-w-[900px] max-h-[90vh] flex flex-col border border-[#E1E5EB]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header du modal */}
                <div className="flex items-center justify-between p-6 border-b border-[#E1E5EB]">
                  <h2 className="text-xl font-bold text-[#1A1C20]">{selectedSurveillance.nom}</h2>
                  <button
              onClick={() => {
                setSelectedSurveillance(null)
                setIsEditMode(false)
                setFiltersEditable(false)
                setContactEditable(false)
                setNotificationOptionsEditable(false)
              }}
                    className="px-3 py-1 text-sm text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                  >
                    ✕ Fermer
                  </button>
                </div>

                {/* Onglets */}
                <div className="flex items-center border-b border-[#E1E5EB] bg-white">
                  <button
                    type="button"
                    onClick={() => setActiveTab('recherche')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'recherche'
                        ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                        : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    Ma Recherche
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === 'contact'
                        ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                        : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    Mon contact
                  </button>
                  {/* Onglet Alertes - uniquement si la surveillance existe déjà */}
                  {surveillancesRecherche.some(s => s.id === selectedSurveillance?.id) && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('alertes')}
                      className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'alertes'
                          ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                          : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      Alertes
                    </button>
                  )}
                </div>

                {/* Contenu des onglets */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === 'recherche' ? (
                    <div className="space-y-6">
                      {/* Filtres Classiques */}
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs text-[#4B4F5C] italic">Filtres de recherche</span>
                          {isEditMode && !filtersEditable && (
                            <button
                              type="button"
                              onClick={() => setFiltersEditable(true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                              title="Modifier les filtres"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>
                          )}
                          {isEditMode && filtersEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                setFiltersEditable(false)
                                // Ici, vous pourriez sauvegarder les modifications
                                console.log('Enregistrer les modifications des filtres', {
                                  filters,
                                  appliedFilters,
                                  appliedFiltersValues,
                                  excludeListings,
                                })
                              }}
                              className="px-3 py-1 text-xs bg-[#0d1b2a] text-white font-medium hover:bg-[#1a2d42] transition-colors"
                              title="Enregistrer les modifications"
                            >
                              Enregistrer les modifications
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {/* CA Minimum */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              CA Minimum (€)
                            </label>
                            <input
                              type="number"
                              value={filters.caMin}
                              onChange={(e) => setFilters({ ...filters, caMin: e.target.value })}
                              disabled={isEditMode && !filtersEditable}
                              readOnly={isEditMode && !filtersEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isEditMode && !filtersEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="5000000"
                            />
                          </div>

                          {/* Effectif Minimum */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Effectif Minimum
                            </label>
                            <input
                              type="number"
                              value={filters.effectifMin}
                              onChange={(e) => setFilters({ ...filters, effectifMin: e.target.value })}
                              disabled={isEditMode && !filtersEditable}
                              readOnly={isEditMode && !filtersEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isEditMode && !filtersEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="30"
                            />
                          </div>

                          {/* Secteur */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Secteur
                            </label>
                            <input
                              type="text"
                              value={filters.secteur}
                              onChange={(e) => setFilters({ ...filters, secteur: e.target.value })}
                              disabled={isEditMode && !filtersEditable}
                              readOnly={isEditMode && !filtersEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isEditMode && !filtersEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="Tech"
                            />
                          </div>

                          {/* Date de création */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Date de création (min)
                            </label>
                            <input
                              type="date"
                              value={filters.dateCreationMin}
                              onChange={(e) => setFilters({ ...filters, dateCreationMin: e.target.value })}
                              disabled={isEditMode && !filtersEditable}
                              readOnly={isEditMode && !filtersEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isEditMode && !filtersEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                            />
                          </div>

                          {/* Forme juridique */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Forme juridique
                            </label>
                            <input
                              type="text"
                              value={filters.formeJuridique}
                              onChange={(e) => setFilters({ ...filters, formeJuridique: e.target.value })}
                              disabled={isEditMode && !filtersEditable}
                              readOnly={isEditMode && !filtersEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isEditMode && !filtersEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="SAS"
                            />
                          </div>

                          {/* Code NAF */}
                          <div className="relative">
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Code NAF
                            </label>
                            <input
                              type="text"
                              value={filters.codeNAF}
                              onChange={(e) => setFilters({ ...filters, codeNAF: e.target.value })}
                              disabled={isEditMode && !filtersEditable}
                              readOnly={isEditMode && !filtersEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isEditMode && !filtersEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="6201Z"
                            />
                          </div>

                          {/* Filtres supplémentaires appliqués - intégrés dans la même grille */}
                          {appliedFilters.map((filterId) => {
                            const filter = additionalFilters.find(f => f.id === filterId)
                            return filter ? (
                              <div key={filterId} className="relative">
                                <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                                  {filter.label}
                                </label>
                                <input
                                  type={filter.type}
                                  value={appliedFiltersValues[filterId] || ''}
                                  onChange={(e) =>
                                    setAppliedFiltersValues({
                                      ...appliedFiltersValues,
                                      [filterId]: e.target.value,
                                    })
                                  }
                                  disabled={isEditMode && !filtersEditable}
                                  readOnly={isEditMode && !filtersEditable}
                                  className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                    isEditMode && !filtersEditable
                                      ? 'bg-[#F5F7FA] cursor-not-allowed'
                                      : 'bg-white'
                                  }`}
                                  placeholder={filter.label}
                                />
                                {(!isEditMode || filtersEditable) && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAppliedFilters(appliedFilters.filter(id => id !== filterId))
                                      const newValues = { ...appliedFiltersValues }
                                      delete newValues[filterId]
                                      setAppliedFiltersValues(newValues)
                                    }}
                                    className="absolute top-6 right-2 text-[#4B4F5C] hover:text-[#1A1C20] text-xs"
                                    title="Supprimer ce filtre"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ) : null
                          })}
                        </div>
                        </div>

                        {/* Option Exclure les sociétés dans mes Listings */}
                      <div className="border-t border-[#E1E5EB] pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={excludeListings}
                            onChange={(e) => setExcludeListings(e.target.checked)}
                            disabled={isEditMode && !filtersEditable}
                            className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                              isEditMode && !filtersEditable
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer'
                            }`}
                          />
                          <span className="text-sm text-[#1A1C20] font-medium">
                            Exclure les sociétés présentes dans un de mes Listings
                          </span>
                        </label>
                      </div>

                      {/* Plus de filtres */}
                      <div className="border-t border-[#E1E5EB] pt-4">
                        <button
                          type="button"
                          onClick={() => setShowMoreFilters(!showMoreFilters)}
                          disabled={isEditMode && !filtersEditable}
                          className={`px-4 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm font-medium transition-colors ${
                            isEditMode && !filtersEditable
                              ? 'bg-[#F5F7FA] cursor-not-allowed opacity-50'
                              : 'bg-white hover:bg-[#F5F7FA]'
                          }`}
                        >
                          {showMoreFilters ? 'Moins de filtres' : 'Plus de filtres'}
                        </button>

                        {showMoreFilters && (
                          <div className="mt-4 p-4 border border-[#E1E5EB] bg-[#F5F7FA]">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold text-[#1A1C20]">Filtres supplémentaires</h3>
                              {selectedAdditionalFilters.length > 0 && (!isEditMode || filtersEditable) && (
                                <button
                                  onClick={() => {
                                    setAppliedFilters([...appliedFilters, ...selectedAdditionalFilters])
                                    // Initialiser les valeurs vides pour les nouveaux filtres
                                    const newValues = { ...appliedFiltersValues }
                                    selectedAdditionalFilters.forEach(filterId => {
                                      newValues[filterId] = ''
                                    })
                                    setAppliedFiltersValues(newValues)
                                    setSelectedAdditionalFilters([])
                                  }}
                                  className="px-3 py-1.5 bg-[#0d1b2a] text-white text-xs font-medium hover:bg-[#1a2d42] transition-colors"
                                >
                                  Ajouter les Filtres
                                </button>
                              )}
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {additionalFilters
                                .filter(f => !appliedFilters.includes(f.id))
                                .map((filter) => (
                                  <label
                                    key={filter.id}
                                    className="flex items-center gap-2 p-2 hover:bg-white transition-colors cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedAdditionalFilters.includes(filter.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedAdditionalFilters([...selectedAdditionalFilters, filter.id])
                                        } else {
                                          setSelectedAdditionalFilters(selectedAdditionalFilters.filter(id => id !== filter.id))
                                        }
                                      }}
                                      className="w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-[#0d1b2a]"
                                    />
                                    <span className="text-sm text-[#1A1C20]">{filter.label}</span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : activeTab === 'alertes' ? (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-[#1A1C20] mb-2">Historique des alertes</h3>
                        <p className="text-sm text-[#4B4F5C]">
                          {alertes.length} alerte{alertes.length > 1 ? 's' : ''} envoyée{alertes.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      {alertes.length > 0 ? (
                        <div className="space-y-3">
                          {alertes.map((alerte) => (
                            <div
                              key={alerte.id}
                              className="bg-[#F5F7FA] border border-[#E1E5EB] p-4 hover:border-[#0d1b2a] transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-base font-bold text-[#1A1C20]">{alerte.titre}</h4>
                                    <span
                                      className={`text-xs px-2 py-0.5 ${
                                        alerte.canal === 'mail'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : alerte.canal === 'whatsapp'
                                          ? 'bg-green-100 text-green-800 border border-green-200'
                                          : alerte.canal === 'slack'
                                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                                      }`}
                                    >
                                      {alerte.canal === 'mail'
                                        ? 'Mail'
                                        : alerte.canal === 'whatsapp'
                                        ? 'WhatsApp'
                                        : alerte.canal === 'slack'
                                        ? 'Slack'
                                        : 'In-App'}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-0.5 ${
                                        alerte.statut === 'envoyé'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {alerte.statut === 'envoyé' ? 'Envoyé' : 'Échec'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#4B4F5C] mb-2">{alerte.description}</p>
                                  <p className="text-xs text-[#4B4F5C]">
                                    {new Date(alerte.date).toLocaleString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-sm text-[#4B4F5C]">Aucune alerte envoyée pour cette surveillance</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Header avec bouton modifier si mode édition */}
                      {isEditMode && (
                        <div className="flex items-center justify-between border-b border-[#E1E5EB] pb-4">
                          <label className="block text-xs font-medium text-[#1A1C20]">
                            Configuration des contacts
                          </label>
                          {!contactEditable && (
                            <button
                              type="button"
                              onClick={() => setContactEditable(true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                              title="Modifier les contacts"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>
                          )}
                          {contactEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                setContactEditable(false)
                                // Ici, vous pourriez sauvegarder les modifications
                                console.log('Enregistrer les modifications des contacts', {
                                  contact,
                                  notificationOptions,
                                })
                              }}
                              className="px-3 py-1 text-xs bg-[#0d1b2a] text-white font-medium hover:bg-[#1a2d42] transition-colors"
                              title="Enregistrer les modifications"
                            >
                              Enregistrer les modifications
                            </button>
                          )}
                        </div>
                      )}

                      {/* Choix des canaux */}
                      <div>
                        <label className="block text-xs font-medium text-[#1A1C20] mb-3">
                          Canaux de notification
                        </label>
                        <div className="space-y-4">
                          {/* Mail */}
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={contact.canaux.mail}
                                onChange={(e) =>
                                  setContact({
                                    ...contact,
                                    canaux: { ...contact.canaux, mail: e.target.checked },
                                    // Si on décoche, garder les mails mais les rendre non actifs
                                  })
                                }
                                disabled={isEditMode && !contactEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isEditMode && !contactEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">Mail</span>
                            </label>
                            {contact.canaux.mail && (
                              <div className="mt-2 space-y-2">
                                {contact.mails.map((mail, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="email"
                                      value={mail}
                                      onChange={(e) => {
                                        const newMails = [...contact.mails]
                                        newMails[index] = e.target.value
                                        setContact({ ...contact, mails: newMails })
                                      }}
                                      disabled={isEditMode && !contactEditable}
                                      readOnly={isEditMode && !contactEditable}
                                      className={`flex-1 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                        isEditMode && !contactEditable
                                          ? 'bg-[#F5F7FA] cursor-not-allowed'
                                          : 'bg-white'
                                      }`}
                                      placeholder="email@example.com"
                                    />
                                    {(!isEditMode || contactEditable) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newMails = contact.mails.filter((_, i) => i !== index)
                                          setContact({ ...contact, mails: newMails })
                                          if (newMails.length === 0) {
                                            setContact({
                                              ...contact,
                                              canaux: { ...contact.canaux, mail: false },
                                              mails: [],
                                            })
                                          }
                                        }}
                                        className="px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {(!isEditMode || contactEditable) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setContact({
                                        ...contact,
                                        mails: [...contact.mails, ''],
                                      })
                                    }
                                    className="text-xs text-[#3A6FF7] hover:text-[#0d1b2a] font-medium"
                                  >
                                    + Ajouter un email
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* WhatsApp */}
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={contact.canaux.whatsapp}
                                onChange={(e) =>
                                  setContact({
                                    ...contact,
                                    canaux: { ...contact.canaux, whatsapp: e.target.checked },
                                  })
                                }
                                disabled={isEditMode && !contactEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isEditMode && !contactEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">WhatsApp</span>
                            </label>
                            {contact.canaux.whatsapp && (
                              <div className="mt-2 space-y-2">
                                {contact.whatsappNumbers.map((number, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="tel"
                                      value={number}
                                      onChange={(e) => {
                                        const newNumbers = [...contact.whatsappNumbers]
                                        newNumbers[index] = e.target.value
                                        setContact({ ...contact, whatsappNumbers: newNumbers })
                                      }}
                                      disabled={isEditMode && !contactEditable}
                                      readOnly={isEditMode && !contactEditable}
                                      className={`flex-1 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                        isEditMode && !contactEditable
                                          ? 'bg-[#F5F7FA] cursor-not-allowed'
                                          : 'bg-white'
                                      }`}
                                      placeholder="+33 6 12 34 56 78"
                                    />
                                    {(!isEditMode || contactEditable) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newNumbers = contact.whatsappNumbers.filter((_, i) => i !== index)
                                          setContact({ ...contact, whatsappNumbers: newNumbers })
                                          if (newNumbers.length === 0) {
                                            setContact({
                                              ...contact,
                                              canaux: { ...contact.canaux, whatsapp: false },
                                              whatsappNumbers: [],
                                            })
                                          }
                                        }}
                                        className="px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {(!isEditMode || contactEditable) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setContact({
                                        ...contact,
                                        whatsappNumbers: [...contact.whatsappNumbers, ''],
                                      })
                                    }
                                    className="text-xs text-[#3A6FF7] hover:text-[#0d1b2a] font-medium"
                                  >
                                    + Ajouter un numéro
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Slack */}
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={contact.canaux.slack}
                                onChange={(e) =>
                                  setContact({
                                    ...contact,
                                    canaux: { ...contact.canaux, slack: e.target.checked },
                                  })
                                }
                                disabled={isEditMode && !contactEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isEditMode && !contactEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">Slack</span>
                            </label>
                            {contact.canaux.slack && (
                              <div className="mt-2 space-y-2">
                                {contact.slackUrls.map((url, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="url"
                                      value={url}
                                      onChange={(e) => {
                                        const newUrls = [...contact.slackUrls]
                                        newUrls[index] = e.target.value
                                        setContact({ ...contact, slackUrls: newUrls })
                                      }}
                                      disabled={isEditMode && !contactEditable}
                                      readOnly={isEditMode && !contactEditable}
                                      className={`flex-1 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                        isEditMode && !contactEditable
                                          ? 'bg-[#F5F7FA] cursor-not-allowed'
                                          : 'bg-white'
                                      }`}
                                      placeholder="https://hooks.slack.com/services/..."
                                    />
                                    {(!isEditMode || contactEditable) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newUrls = contact.slackUrls.filter((_, i) => i !== index)
                                          setContact({ ...contact, slackUrls: newUrls })
                                          if (newUrls.length === 0) {
                                            setContact({
                                              ...contact,
                                              canaux: { ...contact.canaux, slack: false },
                                              slackUrls: [],
                                            })
                                          }
                                        }}
                                        className="px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {(!isEditMode || contactEditable) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setContact({
                                        ...contact,
                                        slackUrls: [...contact.slackUrls, ''],
                                      })
                                    }
                                    className="text-xs text-[#3A6FF7] hover:text-[#0d1b2a] font-medium"
                                  >
                                    + Ajouter une URL Slack
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Options de notification */}
                      <div className="border-t border-[#E1E5EB] pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-medium text-[#1A1C20]">
                            Options de notification
                          </label>
                          {isEditMode && !notificationOptionsEditable && (
                            <button
                              type="button"
                              onClick={() => setNotificationOptionsEditable(true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                              title="Modifier les options de notification"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>
                          )}
                          {isEditMode && notificationOptionsEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                setNotificationOptionsEditable(false)
                                // Ici, vous pourriez sauvegarder les modifications
                                console.log('Enregistrer les modifications des options de notification', {
                                  notificationOptions,
                                })
                              }}
                              className="px-3 py-1 text-xs bg-[#0d1b2a] text-white font-medium hover:bg-[#1a2d42] transition-colors"
                              title="Enregistrer les modifications"
                            >
                              Enregistrer les modifications
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          {/* Notification par événement */}
                          <label className={`flex items-center gap-2 ${
                            isEditMode && !notificationOptionsEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}>
                            <input
                              type="checkbox"
                              checked={notificationOptions.parEvenement}
                              onChange={(e) =>
                                setNotificationOptions({
                                  ...notificationOptions,
                                  parEvenement: e.target.checked,
                                })
                              }
                              disabled={isEditMode && !notificationOptionsEditable}
                              className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                isEditMode && !notificationOptionsEditable
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'cursor-pointer'
                              }`}
                            />
                            <span className="text-sm text-[#1A1C20] font-medium">
                              Notification par événement
                            </span>
                          </label>

                          {/* Résumé à une heure précise */}
                          <div>
                          <label className={`flex items-center gap-2 ${
                            isEditMode && !notificationOptionsEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}>
                            <input
                              type="checkbox"
                              checked={notificationOptions.resumeHeurePrecise}
                              onChange={(e) =>
                                setNotificationOptions({
                                  ...notificationOptions,
                                  resumeHeurePrecise: e.target.checked,
                                })
                              }
                              disabled={isEditMode && !notificationOptionsEditable}
                              className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                isEditMode && !notificationOptionsEditable
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'cursor-pointer'
                              }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">
                                Résumé à une heure précise
                              </span>
                            </label>
                            {notificationOptions.resumeHeurePrecise && (
                              <input
                                type="time"
                                value={notificationOptions.heureResume}
                                onChange={(e) =>
                                  setNotificationOptions({
                                    ...notificationOptions,
                                    heureResume: e.target.value,
                                  })
                                }
                                disabled={isEditMode && !notificationOptionsEditable}
                                readOnly={isEditMode && !notificationOptionsEditable}
                                className={`mt-2 w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                  isEditMode && !notificationOptionsEditable
                                    ? 'bg-[#F5F7FA] cursor-not-allowed'
                                    : 'bg-white'
                                }`}
                              />
                            )}
                          </div>

                          {/* Résumé avant l'heure si événements excèdent X */}
                          <div>
                            <label className={`flex items-center gap-2 ${
                              isEditMode && !notificationOptionsEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}>
                              <input
                                type="checkbox"
                                checked={notificationOptions.resumeAvantHeure}
                                onChange={(e) =>
                                  setNotificationOptions({
                                    ...notificationOptions,
                                    resumeAvantHeure: e.target.checked,
                                  })
                                }
                                disabled={isEditMode && !notificationOptionsEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isEditMode && !notificationOptionsEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">
                                Si les événements excèdent X alors envoi d'un résumé avant l'heure précise
                              </span>
                            </label>
                            {notificationOptions.resumeAvantHeure && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-[#4B4F5C]">Si les événements excèdent</span>
                                <input
                                  type="number"
                                  value={notificationOptions.nbEvenementsMax}
                                  onChange={(e) =>
                                    setNotificationOptions({
                                      ...notificationOptions,
                                      nbEvenementsMax: e.target.value,
                                    })
                                  }
                                  disabled={isEditMode && !notificationOptionsEditable}
                                  readOnly={isEditMode && !notificationOptionsEditable}
                                  className={`w-20 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                    isEditMode && !notificationOptionsEditable
                                      ? 'bg-[#F5F7FA] cursor-not-allowed'
                                      : 'bg-white'
                                  }`}
                                  placeholder="10"
                                />
                                <span className="text-xs text-[#4B4F5C]">événements</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton Enregistrer en bas - uniquement pour les nouvelles surveillances */}
                {!isEditMode && (
                  <div className="border-t border-[#E1E5EB] p-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Enregistrer la nouvelle surveillance', {
                          filters,
                          contact,
                          excludeListings,
                          appliedFilters,
                          appliedFiltersValues,
                          notificationOptions,
                        })
                        
                        // Ici, vous enverriez les données au backend pour créer la surveillance
                        // Après création, fermer le modal
                    setSelectedSurveillance(null)
                    setIsEditMode(false)
                    setFiltersEditable(false)
                    setContactEditable(false)
                    setNotificationOptionsEditable(false)
                      }}
                      className="px-6 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Enregistrer la Surveillance
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal de modification de listing */}
          {selectedListing && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => {
                setSelectedListing(null)
                setIsListingEditMode(false)
                setListingEditable(false)
                setListingContactEditable(false)
                setListingNotificationOptionsEditable(false)
              }}
            >
              <div
                className="bg-white w-[90vw] max-w-[900px] max-h-[90vh] flex flex-col border border-[#E1E5EB]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header du modal */}
                <div className="flex items-center justify-between p-6 border-b border-[#E1E5EB]">
                  <h2 className="text-xl font-bold text-[#1A1C20]">{selectedListing.nom || 'Nouveau listing'}</h2>
                  <button
                    onClick={() => {
                      setSelectedListing(null)
                      setIsListingEditMode(false)
                      setListingEditable(false)
                      setListingContactEditable(false)
                      setListingNotificationOptionsEditable(false)
                    }}
                    className="px-3 py-1 text-sm text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                  >
                    ✕ Fermer
                  </button>
                </div>

                {/* Onglets */}
                <div className="flex items-center border-b border-[#E1E5EB] bg-white">
                  <button
                    type="button"
                    onClick={() => setActiveListingTab('listing')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeListingTab === 'listing'
                        ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                        : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    Mon Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveListingTab('contact')}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeListingTab === 'contact'
                        ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                        : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    Mon contact
                  </button>
                  {/* Onglet Alertes - uniquement si le listing existe déjà */}
                  {surveillancesListing.some(l => l.id === selectedListing?.id) && (
                    <button
                      type="button"
                      onClick={() => setActiveListingTab('alertes')}
                      className={`px-6 py-3 text-sm font-medium transition-colors ${
                        activeListingTab === 'alertes'
                          ? 'bg-[#0d1b2a] text-white border-b-2 border-[#0d1b2a]'
                          : 'text-[#4B4F5C] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      Alertes
                    </button>
                  )}
                </div>

                {/* Contenu des onglets */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeListingTab === 'listing' ? (
                    <div className="space-y-6">
                      {/* Si nouveau listing : afficher la liste de sélection */}
                      {!isListingEditMode ? (
                        <div>
                          <label className="block text-xs font-medium text-[#1A1C20] mb-3">
                            Choisir un listing
                          </label>
                          <div className="border border-[#E1E5EB] bg-[#F5F7FA] max-h-[400px] overflow-y-auto">
                            {availableListings.map((listing) => (
                              <div
                                key={listing.id}
                                onClick={() => {
                                  setSelectedAvailableListing(listing)
                                  setListingData({
                                    nom: listing.nom,
                                    description: listing.description,
                                    entreprises: listing.entreprises,
                                  })
                                  if (selectedListing) {
                                    setSelectedListing({
                                      ...selectedListing,
                                      nom: listing.nom,
                                    })
                                  }
                                }}
                                className={`p-4 border-b border-[#E1E5EB] cursor-pointer transition-colors hover:bg-white ${
                                  selectedAvailableListing?.id === listing.id
                                    ? 'bg-white border-l-4 border-l-[#0d1b2a]'
                                    : 'bg-transparent'
                                }`}
                              >
                                <h4 className="text-sm font-bold text-[#1A1C20] mb-1">{listing.nom}</h4>
                                <p className="text-xs text-[#4B4F5C] mb-2">{listing.description}</p>
                                <p className="text-xs text-[#4B4F5C]">
                                  {listing.entreprises.length} entreprise{listing.entreprises.length > 1 ? 's' : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Si listing existant : afficher le bouton modifier
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs text-[#4B4F5C] italic">Informations du listing</span>
                          {!listingEditable && (
                            <button
                              type="button"
                              onClick={() => setListingEditable(true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                              title="Modifier le listing"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>
                          )}
                          {listingEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                setListingEditable(false)
                                console.log('Enregistrer les modifications du listing', {
                                  listingData,
                                })
                              }}
                              className="px-3 py-1 text-xs bg-[#0d1b2a] text-white font-medium hover:bg-[#1a2d42] transition-colors"
                              title="Enregistrer les modifications"
                            >
                              Enregistrer les modifications
                            </button>
                          )}
                        </div>
                      )}

                      {/* Informations du listing (nom et description) */}
                      {selectedAvailableListing || isListingEditMode ? (
                        <div className="space-y-4">
                          {/* Nom du listing */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Nom du listing
                            </label>
                            <input
                              type="text"
                              value={listingData.nom}
                              onChange={(e) => {
                                setListingData({ ...listingData, nom: e.target.value })
                                if (selectedListing) {
                                  setSelectedListing({ ...selectedListing, nom: e.target.value })
                                }
                              }}
                              disabled={isListingEditMode && !listingEditable}
                              readOnly={isListingEditMode && !listingEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isListingEditMode && !listingEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="Nom du listing"
                            />
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Description
                            </label>
                            <textarea
                              value={listingData.description}
                              onChange={(e) => setListingData({ ...listingData, description: e.target.value })}
                              disabled={isListingEditMode && !listingEditable}
                              readOnly={isListingEditMode && !listingEditable}
                              className={`w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                isListingEditMode && !listingEditable
                                  ? 'bg-[#F5F7FA] cursor-not-allowed'
                                  : 'bg-white'
                              }`}
                              placeholder="Description du listing"
                              rows={3}
                            />
                          </div>

                          {/* Liste des entreprises (en lecture seule pour les nouveaux listings) */}
                          <div>
                            <label className="block text-xs font-medium text-[#1A1C20] mb-1">
                              Entreprises dans le listing ({listingData.entreprises.length})
                            </label>
                            <div className="border border-[#E1E5EB] bg-[#F5F7FA] p-4 max-h-[300px] overflow-y-auto">
                              {listingData.entreprises.length > 0 ? (
                                <div className="space-y-2">
                                  {listingData.entreprises.map((entreprise, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 border border-[#E1E5EB]">
                                      <span className="text-sm text-[#1A1C20]">
                                        {entreprise} {entrepriseNames[entreprise] ? `(${entrepriseNames[entreprise]})` : ''}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-[#4B4F5C] text-center py-4">Aucune entreprise dans ce listing</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : activeListingTab === 'alertes' ? (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-[#1A1C20] mb-2">Historique des alertes</h3>
                        <p className="text-sm text-[#4B4F5C]">
                          {listingAlertes.length} alerte{listingAlertes.length > 1 ? 's' : ''} envoyée{listingAlertes.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      {listingAlertes.length > 0 ? (
                        <div className="space-y-3">
                          {listingAlertes.map((alerte) => (
                            <div
                              key={alerte.id}
                              className="bg-[#F5F7FA] border border-[#E1E5EB] p-4 hover:border-[#0d1b2a] transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-base font-bold text-[#1A1C20]">{alerte.titre}</h4>
                                    <span
                                      className={`text-xs px-2 py-0.5 ${
                                        alerte.canal === 'mail'
                                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                          : alerte.canal === 'whatsapp'
                                          ? 'bg-green-100 text-green-800 border border-green-200'
                                          : alerte.canal === 'slack'
                                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                                      }`}
                                    >
                                      {alerte.canal === 'mail'
                                        ? 'Mail'
                                        : alerte.canal === 'whatsapp'
                                        ? 'WhatsApp'
                                        : alerte.canal === 'slack'
                                        ? 'Slack'
                                        : 'In-App'}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-0.5 ${
                                        alerte.statut === 'envoyé'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                    >
                                      {alerte.statut === 'envoyé' ? 'Envoyé' : 'Échec'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#4B4F5C] mb-2">{alerte.description}</p>
                                  <p className="text-xs text-[#4B4F5C]">
                                    {new Date(alerte.date).toLocaleString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-sm text-[#4B4F5C]">Aucune alerte envoyée pour ce listing</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Header avec bouton modifier si mode édition */}
                      {isListingEditMode && (
                        <div className="flex items-center justify-between border-b border-[#E1E5EB] pb-4">
                          <label className="block text-xs font-medium text-[#1A1C20]">
                            Configuration des contacts
                          </label>
                          {!listingContactEditable && (
                            <button
                              type="button"
                              onClick={() => setListingContactEditable(true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                              title="Modifier les contacts"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>
                          )}
                          {listingContactEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                setListingContactEditable(false)
                                console.log('Enregistrer les modifications des contacts', {
                                  listingContact,
                                  listingNotificationOptions,
                                })
                              }}
                              className="px-3 py-1 text-xs bg-[#0d1b2a] text-white font-medium hover:bg-[#1a2d42] transition-colors"
                              title="Enregistrer les modifications"
                            >
                              Enregistrer les modifications
                            </button>
                          )}
                        </div>
                      )}

                      {/* Choix des canaux - identique à la surveillance */}
                      <div>
                        <label className="block text-xs font-medium text-[#1A1C20] mb-3">
                          Canaux de notification
                        </label>
                        <div className="space-y-4">
                          {/* Mail */}
                          <div>
                            <label className={`flex items-center gap-2 ${
                              isListingEditMode && !listingContactEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}>
                              <input
                                type="checkbox"
                                checked={listingContact.canaux.mail}
                                onChange={(e) =>
                                  setListingContact({
                                    ...listingContact,
                                    canaux: { ...listingContact.canaux, mail: e.target.checked },
                                  })
                                }
                                disabled={isListingEditMode && !listingContactEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isListingEditMode && !listingContactEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">Mail</span>
                            </label>
                            {listingContact.canaux.mail && (
                              <div className="mt-2 space-y-2">
                                {listingContact.mails.map((mail, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="email"
                                      value={mail}
                                      onChange={(e) => {
                                        const newMails = [...listingContact.mails]
                                        newMails[index] = e.target.value
                                        setListingContact({ ...listingContact, mails: newMails })
                                      }}
                                      disabled={isListingEditMode && !listingContactEditable}
                                      readOnly={isListingEditMode && !listingContactEditable}
                                      className={`flex-1 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                        isListingEditMode && !listingContactEditable
                                          ? 'bg-[#F5F7FA] cursor-not-allowed'
                                          : 'bg-white'
                                      }`}
                                      placeholder="email@example.com"
                                    />
                                    {(!isListingEditMode || listingContactEditable) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newMails = listingContact.mails.filter((_, i) => i !== index)
                                          setListingContact({ ...listingContact, mails: newMails })
                                          if (newMails.length === 0) {
                                            setListingContact({
                                              ...listingContact,
                                              canaux: { ...listingContact.canaux, mail: false },
                                              mails: [],
                                            })
                                          }
                                        }}
                                        className="px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {(!isListingEditMode || listingContactEditable) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setListingContact({
                                        ...listingContact,
                                        mails: [...listingContact.mails, ''],
                                      })
                                    }
                                    className="text-xs text-[#3A6FF7] hover:text-[#0d1b2a] font-medium"
                                  >
                                    + Ajouter un email
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* WhatsApp */}
                          <div>
                            <label className={`flex items-center gap-2 ${
                              isListingEditMode && !listingContactEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}>
                              <input
                                type="checkbox"
                                checked={listingContact.canaux.whatsapp}
                                onChange={(e) =>
                                  setListingContact({
                                    ...listingContact,
                                    canaux: { ...listingContact.canaux, whatsapp: e.target.checked },
                                  })
                                }
                                disabled={isListingEditMode && !listingContactEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isListingEditMode && !listingContactEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">WhatsApp</span>
                            </label>
                            {listingContact.canaux.whatsapp && (
                              <div className="mt-2 space-y-2">
                                {listingContact.whatsappNumbers.map((number, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="tel"
                                      value={number}
                                      onChange={(e) => {
                                        const newNumbers = [...listingContact.whatsappNumbers]
                                        newNumbers[index] = e.target.value
                                        setListingContact({ ...listingContact, whatsappNumbers: newNumbers })
                                      }}
                                      disabled={isListingEditMode && !listingContactEditable}
                                      readOnly={isListingEditMode && !listingContactEditable}
                                      className={`flex-1 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                        isListingEditMode && !listingContactEditable
                                          ? 'bg-[#F5F7FA] cursor-not-allowed'
                                          : 'bg-white'
                                      }`}
                                      placeholder="+33 6 12 34 56 78"
                                    />
                                    {(!isListingEditMode || listingContactEditable) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newNumbers = listingContact.whatsappNumbers.filter((_, i) => i !== index)
                                          setListingContact({ ...listingContact, whatsappNumbers: newNumbers })
                                          if (newNumbers.length === 0) {
                                            setListingContact({
                                              ...listingContact,
                                              canaux: { ...listingContact.canaux, whatsapp: false },
                                              whatsappNumbers: [],
                                            })
                                          }
                                        }}
                                        className="px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {(!isListingEditMode || listingContactEditable) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setListingContact({
                                        ...listingContact,
                                        whatsappNumbers: [...listingContact.whatsappNumbers, ''],
                                      })
                                    }
                                    className="text-xs text-[#3A6FF7] hover:text-[#0d1b2a] font-medium"
                                  >
                                    + Ajouter un numéro
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Slack */}
                          <div>
                            <label className={`flex items-center gap-2 ${
                              isListingEditMode && !listingContactEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}>
                              <input
                                type="checkbox"
                                checked={listingContact.canaux.slack}
                                onChange={(e) =>
                                  setListingContact({
                                    ...listingContact,
                                    canaux: { ...listingContact.canaux, slack: e.target.checked },
                                  })
                                }
                                disabled={isListingEditMode && !listingContactEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isListingEditMode && !listingContactEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">Slack</span>
                            </label>
                            {listingContact.canaux.slack && (
                              <div className="mt-2 space-y-2">
                                {listingContact.slackUrls.map((url, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <input
                                      type="url"
                                      value={url}
                                      onChange={(e) => {
                                        const newUrls = [...listingContact.slackUrls]
                                        newUrls[index] = e.target.value
                                        setListingContact({ ...listingContact, slackUrls: newUrls })
                                      }}
                                      disabled={isListingEditMode && !listingContactEditable}
                                      readOnly={isListingEditMode && !listingContactEditable}
                                      className={`flex-1 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                        isListingEditMode && !listingContactEditable
                                          ? 'bg-[#F5F7FA] cursor-not-allowed'
                                          : 'bg-white'
                                      }`}
                                      placeholder="https://hooks.slack.com/services/..."
                                    />
                                    {(!isListingEditMode || listingContactEditable) && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newUrls = listingContact.slackUrls.filter((_, i) => i !== index)
                                          setListingContact({ ...listingContact, slackUrls: newUrls })
                                          if (newUrls.length === 0) {
                                            setListingContact({
                                              ...listingContact,
                                              canaux: { ...listingContact.canaux, slack: false },
                                              slackUrls: [],
                                            })
                                          }
                                        }}
                                        className="px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20]"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                ))}
                                {(!isListingEditMode || listingContactEditable) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setListingContact({
                                        ...listingContact,
                                        slackUrls: [...listingContact.slackUrls, ''],
                                      })
                                    }
                                    className="text-xs text-[#3A6FF7] hover:text-[#0d1b2a] font-medium"
                                  >
                                    + Ajouter une URL Slack
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Options de notification */}
                      <div className="border-t border-[#E1E5EB] pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-xs font-medium text-[#1A1C20]">
                            Options de notification
                          </label>
                          {isListingEditMode && !listingNotificationOptionsEditable && (
                            <button
                              type="button"
                              onClick={() => setListingNotificationOptionsEditable(true)}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
                              title="Modifier les options de notification"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Modifier
                            </button>
                          )}
                          {isListingEditMode && listingNotificationOptionsEditable && (
                            <button
                              type="button"
                              onClick={() => {
                                setListingNotificationOptionsEditable(false)
                                console.log('Enregistrer les modifications des options de notification', {
                                  listingNotificationOptions,
                                })
                              }}
                              className="px-3 py-1 text-xs bg-[#0d1b2a] text-white font-medium hover:bg-[#1a2d42] transition-colors"
                              title="Enregistrer les modifications"
                            >
                              Enregistrer les modifications
                            </button>
                          )}
                        </div>
                        <div className="space-y-4">
                          {/* Notification par événement */}
                          <label className={`flex items-center gap-2 ${
                            isListingEditMode && !listingNotificationOptionsEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}>
                            <input
                              type="checkbox"
                              checked={listingNotificationOptions.parEvenement}
                              onChange={(e) =>
                                setListingNotificationOptions({
                                  ...listingNotificationOptions,
                                  parEvenement: e.target.checked,
                                })
                              }
                              disabled={isListingEditMode && !listingNotificationOptionsEditable}
                              className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                isListingEditMode && !listingNotificationOptionsEditable
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'cursor-pointer'
                              }`}
                            />
                            <span className="text-sm text-[#1A1C20] font-medium">
                              Notification par événement
                            </span>
                          </label>

                          {/* Résumé à une heure précise */}
                          <div>
                            <label className={`flex items-center gap-2 ${
                              isListingEditMode && !listingNotificationOptionsEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}>
                              <input
                                type="checkbox"
                                checked={listingNotificationOptions.resumeHeurePrecise}
                                onChange={(e) =>
                                  setListingNotificationOptions({
                                    ...listingNotificationOptions,
                                    resumeHeurePrecise: e.target.checked,
                                  })
                                }
                                disabled={isListingEditMode && !listingNotificationOptionsEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isListingEditMode && !listingNotificationOptionsEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">
                                Résumé à une heure précise
                              </span>
                            </label>
                            {listingNotificationOptions.resumeHeurePrecise && (
                              <input
                                type="time"
                                value={listingNotificationOptions.heureResume}
                                onChange={(e) =>
                                  setListingNotificationOptions({
                                    ...listingNotificationOptions,
                                    heureResume: e.target.value,
                                  })
                                }
                                disabled={isListingEditMode && !listingNotificationOptionsEditable}
                                readOnly={isListingEditMode && !listingNotificationOptionsEditable}
                                className={`mt-2 w-full px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                  isListingEditMode && !listingNotificationOptionsEditable
                                    ? 'bg-[#F5F7FA] cursor-not-allowed'
                                    : 'bg-white'
                                }`}
                              />
                            )}
                          </div>

                          {/* Résumé avant l'heure si événements excèdent X */}
                          <div>
                            <label className={`flex items-center gap-2 ${
                              isListingEditMode && !listingNotificationOptionsEditable ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}>
                              <input
                                type="checkbox"
                                checked={listingNotificationOptions.resumeAvantHeure}
                                onChange={(e) =>
                                  setListingNotificationOptions({
                                    ...listingNotificationOptions,
                                    resumeAvantHeure: e.target.checked,
                                  })
                                }
                                disabled={isListingEditMode && !listingNotificationOptionsEditable}
                                className={`w-4 h-4 border border-[#E1E5EB] text-[#0d1b2a] focus:ring-2 focus:ring-[#0d1b2a] focus:ring-offset-0 ${
                                  isListingEditMode && !listingNotificationOptionsEditable
                                    ? 'cursor-not-allowed opacity-50'
                                    : 'cursor-pointer'
                                }`}
                              />
                              <span className="text-sm text-[#1A1C20] font-medium">
                                Si les événements excèdent X alors envoi d'un résumé avant l'heure précise
                              </span>
                            </label>
                            {listingNotificationOptions.resumeAvantHeure && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-[#4B4F5C]">Si les événements excèdent</span>
                                <input
                                  type="number"
                                  value={listingNotificationOptions.nbEvenementsMax}
                                  onChange={(e) =>
                                    setListingNotificationOptions({
                                      ...listingNotificationOptions,
                                      nbEvenementsMax: e.target.value,
                                    })
                                  }
                                  disabled={isListingEditMode && !listingNotificationOptionsEditable}
                                  readOnly={isListingEditMode && !listingNotificationOptionsEditable}
                                  className={`w-20 px-3 py-2 border border-[#E1E5EB] text-[#1A1C20] text-sm focus:outline-none focus:border-[#0d1b2a] ${
                                    isListingEditMode && !listingNotificationOptionsEditable
                                      ? 'bg-[#F5F7FA] cursor-not-allowed'
                                      : 'bg-white'
                                  }`}
                                  placeholder="10"
                                />
                                <span className="text-xs text-[#4B4F5C]">événements</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bouton Enregistrer en bas - uniquement pour les nouveaux listings */}
                {!isListingEditMode && (
                  <div className="border-t border-[#E1E5EB] p-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Enregistrer le nouveau listing', {
                          listingData,
                          listingContact,
                          listingNotificationOptions,
                        })
                        
                        // Ici, vous enverriez les données au backend pour créer le listing
                        // Après création, fermer le modal
                        setSelectedListing(null)
                        setIsListingEditMode(false)
                        setListingEditable(false)
                        setListingContactEditable(false)
                        setListingNotificationOptionsEditable(false)
                      }}
                      className="px-6 py-2 bg-[#0d1b2a] text-white text-sm font-medium hover:bg-[#1a2d42] transition-colors"
                    >
                      Enregistrer le Listing
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
