import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import { getCachedCoords, setCachedCoords } from '../../utils/geocodeCache'
import 'leaflet/dist/leaflet.css'

// Custom blue marker
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [15, 24],
  iconAnchor: [7, 24],
  popupAnchor: [1, -20],
  shadowSize: [24, 24]
})

interface Company {
  siren: string
  nom_entreprise: string
  siege: {
    adresse_ligne_1: string
    code_postal: string
    ville: string
  }
}

interface CompanyWithCoords extends Company {
  latitude: number
  longitude: number
}

function MapViewController({ companies }: { companies: CompanyWithCoords[] }) {
  const map = useMap()

  useEffect(() => {
    if (companies.length === 0) return

    // Use fitBounds for automatic optimal zoom
    const bounds = L.latLngBounds(
      companies.map(c => [c.latitude, c.longitude] as L.LatLngTuple)
    )

    // Add padding to avoid markers being cut off at edges
    map.fitBounds(bounds, {
      padding: [30, 30], // Padding in pixels
      maxZoom: 13, // Don't zoom in too much for single/close locations
      animate: true,
      duration: 0.5
    })
  }, [companies, map])

  return null
}

interface MiniResultsMapProps {
  companies: Company[]
  onOpenFullMap: () => void
  onCompaniesGeocoded: (companies: CompanyWithCoords[]) => void
}

export default function MiniResultsMap({ companies, onOpenFullMap, onCompaniesGeocoded }: MiniResultsMapProps) {
  const [companiesWithCoords, setCompaniesWithCoords] = useState<CompanyWithCoords[]>([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const geocodeCompanies = async () => {
      setLoading(true)
      const results: CompanyWithCoords[] = []

      for (const company of companies) {
        try {
          // Check cache first
          const cached = getCachedCoords(
            company.siege.adresse_ligne_1,
            company.siege.code_postal,
            company.siege.ville
          )
          
          if (cached) {
            // Use cached coordinates
            results.push({
              ...company,
              latitude: cached.latitude,
              longitude: cached.longitude
            })
            console.log(`✅ Cache hit for ${company.nom_entreprise}`)
          } else {
            // Geocode and cache
            const address = `${company.siege.adresse_ligne_1}, ${company.siege.code_postal} ${company.siege.ville}, France`
            
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
              {
                headers: {
                  'User-Agent': 'TailorLead/1.0'
                }
              }
            )
            
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const data = await response.json()
            
            if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat)
              const lon = parseFloat(data[0].lon)
              
              // Save to cache
              setCachedCoords(
                company.siege.adresse_ligne_1,
                company.siege.code_postal,
                company.siege.ville,
                lat,
                lon
              )
              
              results.push({
                ...company,
                latitude: lat,
                longitude: lon
              })
              console.log(`🌍 Geocoded ${company.nom_entreprise}`)
            }
          }
        } catch (error) {
          console.error(`Geocoding error for ${company.nom_entreprise}:`, error)
        }
      }

      setCompaniesWithCoords(results)
      onCompaniesGeocoded(results) // Pass to parent
      setLoading(false)
    }

    if (companies.length > 0) {
      geocodeCompanies()
    }
  }, [companies, onCompaniesGeocoded])

  if (loading) {
    return (
      <div className="w-full h-full bg-[#F7F9FC] border border-[#E1E5EB] flex items-center justify-center">
        <p className="text-xs text-[#4B4F5C]">Chargement...</p>
      </div>
    )
  }

  if (companiesWithCoords.length === 0) {
    return (
      <div className="w-full h-full bg-[#F7F9FC] border border-[#E1E5EB] flex items-center justify-center">
        <p className="text-xs text-[#4B4F5C]">Aucune localisation</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpenFullMap}
    >
      {/* Mini Map */}
      <div className="w-full h-full border border-[#E1E5EB] relative z-10">
        <MapContainer
          center={[46.6, 2.2]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <MapViewController companies={companiesWithCoords} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {companiesWithCoords.map((company) => (
            <Marker
              key={company.siren}
              position={[company.latitude, company.longitude]}
              icon={blueIcon}
            />
          ))}
        </MapContainer>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-all">
          <div className="bg-white px-4 py-2 border border-[#E1E5EB] text-sm font-medium text-[#1A1C20]">
            📍 Afficher la carte
          </div>
        </div>
      )}
    </div>
  )
}

