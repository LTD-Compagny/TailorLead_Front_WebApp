import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Custom blue marker
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

// Component to update map view dynamically
function MapViewController({ companies }: { companies: CompanyWithCoords[] }) {
  const map = useMap()

  useEffect(() => {
    if (companies.length === 0) return

    const lats = companies.map(c => c.latitude)
    const lngs = companies.map(c => c.longitude)
    
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    
    const centerLat = (minLat + maxLat) / 2
    const centerLng = (minLng + maxLng) / 2
    
    const latDiff = maxLat - minLat
    const lngDiff = maxLng - minLng
    const maxDiff = Math.max(latDiff, lngDiff)
    
    let zoom = 13
    if (maxDiff > 5) zoom = 6
    else if (maxDiff > 1) zoom = 8
    else if (maxDiff > 0.5) zoom = 10
    else if (maxDiff > 0.1) zoom = 12
    
    map.setView([centerLat, centerLng], zoom)
  }, [companies, map])

  return null
}

interface ResultsMapProps {
  companies: Company[]
}

export default function ResultsMap({ companies }: ResultsMapProps) {
  const navigate = useNavigate()
  const [companiesWithCoords, setCompaniesWithCoords] = useState<CompanyWithCoords[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const geocodeCompanies = async () => {
      setLoading(true)
      const results: CompanyWithCoords[] = []

      for (const company of companies) {
        try {
          const address = `${company.siege.adresse_ligne_1}, ${company.siege.code_postal} ${company.siege.ville}, France`
          
          // Nominatim API (OpenStreetMap) - Gratuit
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
            {
              headers: {
                'User-Agent': 'TailorLead/1.0'
              }
            }
          )
          
          // Respect rate limit (1 request per second)
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const data = await response.json()
          
          if (data && data.length > 0) {
            results.push({
              ...company,
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon)
            })
          }
        } catch (error) {
          console.error(`Geocoding error for ${company.nom_entreprise}:`, error)
        }
      }

      setCompaniesWithCoords(results)
      setLoading(false)
    }

    if (companies.length > 0) {
      geocodeCompanies()
    }
  }, [companies])

  if (loading) {
    return (
      <div className="w-full h-[400px] bg-[#F7F9FC] border border-[#E1E5EB] flex items-center justify-center">
        <p className="text-sm text-[#4B4F5C]">Chargement de la carte...</p>
      </div>
    )
  }

  if (companiesWithCoords.length === 0) {
    return (
      <div className="w-full h-[400px] bg-[#F7F9FC] border border-[#E1E5EB] flex items-center justify-center">
        <p className="text-sm text-[#4B4F5C]">Aucune entreprise géolocalisée</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[400px] border border-[#E1E5EB]">
      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <MapViewController companies={companiesWithCoords} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {companiesWithCoords.map((company) => (
          <Marker
            key={company.siren}
            position={[company.latitude, company.longitude]}
            icon={blueIcon}
            eventHandlers={{
              click: () => {
                navigate(`/company/${company.siren}`)
              }
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-[#1A1C20]">{company.nom_entreprise}</div>
                <div className="text-xs text-[#4B4F5C]">SIREN: {company.siren}</div>
                <div className="text-xs text-[#4B4F5C]">{company.siege.adresse_ligne_1}</div>
                <div className="text-xs text-[#4B4F5C]">{company.siege.code_postal} {company.siege.ville}</div>
                <button
                  onClick={() => navigate(`/company/${company.siren}`)}
                  className="mt-2 px-3 py-1 bg-[#0d1b2a] text-white text-xs hover:bg-[#1a2d42] transition-colors"
                >
                  Voir détails
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

