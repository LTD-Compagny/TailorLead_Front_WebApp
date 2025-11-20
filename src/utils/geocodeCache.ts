// Cache pour les coordonnées GPS geocodées
const CACHE_KEY = 'tailorlead_geocode_cache'
const CACHE_VERSION = '1.0'
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 jours en millisecondes

interface CachedCoords {
  latitude: number
  longitude: number
  timestamp: number
}

interface GeocodeCache {
  version: string
  data: { [address: string]: CachedCoords }
}

// Générer une clé unique pour une adresse
function getAddressKey(adresse: string, codePostal: string, ville: string): string {
  return `${adresse}|${codePostal}|${ville}`.toLowerCase().trim()
}

// Charger le cache depuis localStorage
function loadCache(): GeocodeCache {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsedCache: GeocodeCache = JSON.parse(cached)
      if (parsedCache.version === CACHE_VERSION) {
        return parsedCache
      }
    }
  } catch (error) {
    console.error('Error loading geocode cache:', error)
  }
  
  return { version: CACHE_VERSION, data: {} }
}

// Sauvegarder le cache dans localStorage
function saveCache(cache: GeocodeCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch (error) {
    console.error('Error saving geocode cache:', error)
  }
}

// Récupérer des coordonnées depuis le cache
export function getCachedCoords(adresse: string, codePostal: string, ville: string): { latitude: number; longitude: number } | null {
  const cache = loadCache()
  const key = getAddressKey(adresse, codePostal, ville)
  const cached = cache.data[key]
  
  if (cached) {
    const now = Date.now()
    if (now - cached.timestamp < CACHE_DURATION) {
      return { latitude: cached.latitude, longitude: cached.longitude }
    }
  }
  
  return null
}

// Mettre en cache des coordonnées
export function setCachedCoords(adresse: string, codePostal: string, ville: string, latitude: number, longitude: number): void {
  const cache = loadCache()
  const key = getAddressKey(adresse, codePostal, ville)
  
  cache.data[key] = {
    latitude,
    longitude,
    timestamp: Date.now()
  }
  
  saveCache(cache)
}

// Nettoyer les entrées expirées
export function cleanExpiredCache(): void {
  const cache = loadCache()
  const now = Date.now()
  let cleaned = false
  
  for (const key in cache.data) {
    if (now - cache.data[key].timestamp >= CACHE_DURATION) {
      delete cache.data[key]
      cleaned = true
    }
  }
  
  if (cleaned) {
    saveCache(cache)
  }
}

