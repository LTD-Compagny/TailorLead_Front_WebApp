import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'
import AIBadge from '../ia/AIBadge'
import 'leaflet/dist/leaflet.css'

// Custom green marker for active establishments
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Custom red marker for closed establishments
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component to update map view
function MapViewController({ establishments }: { establishments: Establishment[] }) {
  const map = useMap()

  useEffect(() => {
    if (establishments.length === 0) return

    // Calculate bounds
    const lats = establishments.map(e => e.latitude)
    const lngs = establishments.map(e => e.longitude)
    
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
  }, [establishments, map])

  return null
}

interface Establishment {
  siret: string
  adresse_ligne_1: string
  code_postal: string
  ville: string
  siege: boolean
  latitude: number
  longitude: number
  effectif?: string
  etablissement_cesse: boolean
  date_cessation?: string | null
  predecesseurs?: Array<{
    siret: string
    date: string
    transfert_siege: boolean
    continuite_economique: boolean
  }>
}

interface EstablishmentsMapProps {
  establishments: Establishment[]
}

export default function EstablishmentsMap({ establishments }: EstablishmentsMapProps) {
  // Filter establishments with coordinates (include both active and closed)
  const validEstablishments = establishments.filter(
    e => e.latitude && e.longitude
  )

  if (validEstablishments.length === 0) {
    return (
      <div className="w-full h-[400px] bg-[#F7F9FC] border border-[#E1E5EB] flex items-center justify-center">
        <p className="text-sm text-[#4B4F5C]">Aucun établissement avec coordonnées GPS trouvé</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Légende */}
      <div className="flex items-center justify-between text-xs text-[#4B4F5C] bg-[#F5F7FA] p-2 border border-[#E1E5EB]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <span>Établissement actif</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <span>Établissement fermé</span>
          </div>
        </div>
        
        <AIBadge 
          className="inline-flex items-center px-3 py-1 text-xs border backdrop-blur-md text-white border-white/20"
          networkSize="sm"
          networkOpacity={0.5}
        >
          💡 Cliquez sur un point pour plus d'infos
        </AIBadge>
      </div>

      {/* Carte */}
      <div className="w-full h-[400px] border border-[#E1E5EB]">
        <MapContainer
          center={[46.6, 2.2]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <MapViewController establishments={validEstablishments} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {validEstablishments.map((establishment) => {
            // Debug log pour voir les données
            if (establishment.etablissement_cesse) {
              console.log('📍 Établissement cessé:', {
                siret: establishment.siret,
                date_cessation: establishment.date_cessation,
                predecesseurs: establishment.predecesseurs
              })
            }
            
            return (
              <Marker
                key={establishment.siret}
                position={[establishment.latitude, establishment.longitude]}
                icon={establishment.etablissement_cesse ? redIcon : greenIcon}
              >
                <Popup>
                  <div className="text-sm" style={{ minWidth: '250px' }}>
                    <div className="font-bold text-[#1A1C20] mb-2">
                      {establishment.etablissement_cesse ? '❌ Établissement fermé' : '✅ Établissement actif'}
                      {establishment.siege && ' • 🏢 Siège Social'}
                    </div>
                    <div className="text-xs text-[#4B4F5C] space-y-1.5">
                      <div><strong>SIRET:</strong> {establishment.siret}</div>
                      <div><strong>Adresse:</strong> {establishment.adresse_ligne_1}</div>
                      <div><strong>Ville:</strong> {establishment.code_postal} {establishment.ville}</div>
                      {establishment.effectif && (
                        <div><strong>Effectif:</strong> {establishment.effectif}</div>
                      )}
                      
                      {/* Informations pour établissement cessé */}
                      {establishment.etablissement_cesse && (
                        <div className="mt-2 pt-2 border-t border-[#E1E5EB]">
                          {establishment.date_cessation && (
                            <div className="text-red-600">
                              <strong>Date de cessation:</strong> {new Date(establishment.date_cessation).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                          {establishment.predecesseurs && establishment.predecesseurs.length > 0 ? (
                            <div className="mt-2">
                              <strong>Prédécesseur:</strong>
                              {establishment.predecesseurs.map((pred, idx) => (
                                <div key={idx} className="ml-2 mt-1 text-[11px] bg-[#F5F7FA] p-1">
                                  • SIRET: {pred.siret}
                                  <br />
                                  • Date: {new Date(pred.date).toLocaleDateString('fr-FR')}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-2 text-[11px] italic">
                              Aucun prédécesseur enregistré
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}

