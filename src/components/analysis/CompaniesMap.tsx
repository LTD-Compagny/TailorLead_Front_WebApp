import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in react-leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Custom blue marker
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to update map view dynamically
function MapViewController({ companies }: { companies: FoundCompany[] }) {
  const map = useMap()

  useEffect(() => {
    if (companies.length === 0) return

    // Calculate bounds
    const lats = companies.map(c => c.latitude!)
    const lngs = companies.map(c => c.longitude!)
    
    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs)
    const maxLng = Math.max(...lngs)
    
    const centerLat = (minLat + maxLat) / 2
    const centerLng = (minLng + maxLng) / 2
    
    // Calculate distance to determine zoom
    const latDiff = maxLat - minLat
    const lngDiff = maxLng - minLng
    const maxDiff = Math.max(latDiff, lngDiff)
    
    // Determine zoom based on spread
    let zoom = 13 // Default for single location or very close locations
    if (maxDiff > 5) zoom = 6  // Country level
    else if (maxDiff > 1) zoom = 8  // Region level
    else if (maxDiff > 0.5) zoom = 10 // City area
    else if (maxDiff > 0.1) zoom = 12 // District level
    
    // Update map view
    map.setView([centerLat, centerLng], zoom)
  }, [companies, map])

  return null
}

interface FoundCompany {
  siren: string
  nom: string
  latitude: number | null
  longitude: number | null
  ville?: string
  raw: any
}

interface CompaniesMapProps {
  companies: FoundCompany[]
}

export default function CompaniesMap({ companies }: CompaniesMapProps) {
  const navigate = useNavigate()

  // Filter companies with valid coordinates
  const companiesWithCoords = companies.filter(
    c => c.latitude !== null && c.longitude !== null
  )

  if (companiesWithCoords.length === 0) {
    return (
      <div className="w-full h-[500px] bg-[#F7F9FC] border border-[#E1E5EB] flex items-center justify-center">
        <p className="text-sm text-[#4B4F5C]">Aucune entreprise avec coordonnées GPS trouvée</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] border border-[#E1E5EB]">
      <MapContainer
        center={[46.6, 2.2]}
        zoom={6}
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
            position={[company.latitude!, company.longitude!]}
            icon={blueIcon}
            eventHandlers={{
              click: () => {
                navigate(`/company/${company.siren}`)
              }
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-[#1A1C20]">{company.nom}</div>
                <div className="text-xs text-[#4B4F5C]">SIREN: {company.siren}</div>
                {company.ville && <div className="text-xs text-[#4B4F5C]">{company.ville}</div>}
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

