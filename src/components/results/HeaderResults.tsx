import { useNavigate } from 'react-router-dom'

export default function HeaderResults() {
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-[#E1E5EB]">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1C20]">Résultats de recherche</h1>
          <p className="text-sm text-gray-600 mt-1">Analyse des entreprises correspondantes</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 border border-[#E1E5EB] bg-white text-[#1A1C20] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
        >
          Nouvelle recherche
        </button>
      </div>
    </header>
  )
}

