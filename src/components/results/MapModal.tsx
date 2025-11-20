import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { SearchResult } from '../../data/loadData'

// Custom blue marker
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface CompanyWithCoords extends SearchResult {
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
      padding: [50, 50], // More padding for the large modal view
      maxZoom: 13, // Don't zoom in too much for single/close locations
      animate: true,
      duration: 0.5
    })
  }, [companies, map])

  return null
}

interface MapModalProps {
  companies: SearchResult[]
  companiesWithCoords: CompanyWithCoords[]
  isOpen: boolean
  onClose: () => void
}

export default function MapModal({ companies, companiesWithCoords, isOpen, onClose }: MapModalProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  if (companiesWithCoords.length === 0) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div 
          className="bg-white w-[90vw] h-[90vh] max-w-[1400px] border border-[#E1E5EB] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-[#E1E5EB]">
            <h2 className="text-lg font-bold text-[#1A1C20]">Carte des résultats</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
            >
              ✕ Fermer
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[#4B4F5C]">Chargement de la carte en cours...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div 
        className="bg-white w-[90vw] h-[90vh] max-w-[1400px] border border-[#E1E5EB] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E1E5EB]">
          <h2 className="text-lg font-bold text-[#1A1C20]">Carte des résultats ({companiesWithCoords.length} localisations)</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#4B4F5C] hover:text-[#1A1C20] hover:bg-[#F5F7FA] transition-colors"
          >
            ✕ Fermer
          </button>
        </div>

        {/* Map */}
        <div className="flex-1 p-4">
          <div className="w-full h-full border border-[#E1E5EB]">
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
              {companiesWithCoords.map((company) => {
                const formatCapital = (capital: number) => {
                  if (capital >= 1000000) {
                    return `${(capital / 1000000).toFixed(1)}M€`
                  }
                  if (capital >= 1000) {
                    return `${(capital / 1000).toFixed(0)}K€`
                  }
                  return `${capital.toFixed(0)}€`
                }

                return (
                  <Marker
                    key={company.siren}
                    position={[company.latitude, company.longitude]}
                    icon={blueIcon}
                  >
                    <Popup minWidth={280}>
                      <div className="text-sm" style={{ minWidth: '280px' }}>
                        {/* En-tête */}
                        <div className="font-bold text-[#1A1C20] mb-2 text-base">
                          {company.nom_entreprise || company.denomination}
                        </div>

                        {/* Informations principales */}
                        <div className="text-xs text-[#4B4F5C] space-y-1.5 mb-3">
                          <div>
                            <strong>SIREN:</strong> {company.siren}
                          </div>
                          <div>
                            <strong>Adresse:</strong> {company.siege.adresse_ligne_1}
                          </div>
                          <div>
                            <strong>Ville:</strong> {company.siege.code_postal} {company.siege.ville}
                          </div>
                          <div>
                            <strong>Forme juridique:</strong> {company.forme_juridique}
                          </div>
                          <div>
                            <strong>NAF:</strong> {company.code_naf} - {company.libelle_code_naf}
                          </div>
                          {company.domaine_activite && (
                            <div>
                              <strong>Domaine:</strong> {company.domaine_activite}
                            </div>
                          )}
                          <div>
                            <strong>Capital:</strong> {formatCapital(company.capital)}
                          </div>
                          <div>
                            <strong>Date de création:</strong>{' '}
                            {new Date(company.date_creation).toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        {/* Valorisation et Score */}
                        <div className="pt-2 border-t border-[#E1E5EB] space-y-2">
                          <div>
                            <div className="text-[10px] text-[#4B4F5C] uppercase mb-1">Valorisation estimée</div>
                            <div className="text-sm font-bold text-[#3A6FF7]">
                              {company.valuation.formatted.display}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-[#4B4F5C] uppercase mb-1">Score d'intérêt</div>
                            <div className="text-xs font-medium text-[#1A1C20]">
                              {company.interestScore.formatted.badge.label}: {company.interestScore.formatted.display}
                            </div>
                          </div>
                        </div>

                        {/* Bouton d'action */}
                        <div className="mt-3 pt-2 border-t border-[#E1E5EB]">
                          <button
                            onClick={() => {
                              navigate(`/company/${company.siren}`)
                              onClose()
                            }}
                            className="w-full px-3 py-2 bg-[#0d1b2a] text-white text-xs font-medium hover:bg-[#1a2d42] transition-colors"
                          >
                            Voir les détails complets
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

