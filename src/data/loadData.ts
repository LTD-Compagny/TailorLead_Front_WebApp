// Types pour les données de recherche
export interface SearchResult {
  siren: string
  nom_entreprise: string
  denomination: string
  forme_juridique: string
  code_naf: string
  libelle_code_naf: string
  domaine_activite: string
  date_creation: string
  capital: number
  siege: {
    adresse_ligne_1: string
    code_postal: string
    ville: string
  }
  valuation: {
    formatted: {
      display: string
    }
  }
  interestScore: {
    formatted: {
      display: string
      badge: {
        bg: string
        text: string
        border: string
        label: string
      }
    }
  }
}

export interface SearchResultsData {
  export_date: string
  query: string
  total_results: number
  results: SearchResult[]
}

// Types pour les données d'entreprise
export interface CompanyAnalysisData {
  export_date: string
  entreprise: {
    siren: string
    nom: string
  }
  sources: {
    pappers: boolean
    bodacc: boolean
    cfnews: boolean
    cfnewsOperations: boolean
  }
  data: {
    pappers: any
    bodacc: {
      total_count: number
      results: any[]
    }
    cfnews: any
    cfnewsOperations: any
    errors?: any
  }
  valuation_ia?: {
    valuation: string
    metadata: any
  }
  analyse_globale_ia?: {
    report: string
    metadata: any
  }
}

// Cache pour les données chargées
let searchResultsCache: SearchResultsData | null = null
let companyAnalysisCache: CompanyAnalysisData | null = null

// Charger les données de recherche
export const loadSearchResults = async (): Promise<SearchResultsData> => {
  if (searchResultsCache) {
    return searchResultsCache
  }

  try {
    const response = await fetch(
      '/mock/resultats_recherche_quincaillerie_a_paris_de_plus_de_2m_de_ca__2025-11-19.json'
    )
    if (!response.ok) {
      throw new Error('Failed to load search results')
    }
    const data = await response.json()
    searchResultsCache = data as SearchResultsData
    return searchResultsCache
  } catch (error) {
    console.error('Error loading search results:', error)
    // Fallback: retourner une structure vide
    return {
      export_date: '',
      query: '',
      total_results: 0,
      results: [],
    }
  }
}

// Charger les données d'analyse d'entreprise
export const loadCompanyAnalysis = async (_siren: string): Promise<CompanyAnalysisData | null> => {
  if (companyAnalysisCache) {
    return companyAnalysisCache
  }

  try {
    // Le nom du fichier contient des caractères spéciaux, on utilise encodeURIComponent
    const fileName = 'analyse_globale_calliope4m_887831725_2025-11-19 (1).json'
    const response = await fetch(`/mock/${encodeURIComponent(fileName)}`)
    if (!response.ok) {
      throw new Error('Failed to load company analysis')
    }
    const data = await response.json()
    companyAnalysisCache = data as CompanyAnalysisData
    return companyAnalysisCache
  } catch (error) {
    console.error('Error loading company analysis:', error)
    return null
  }
}

