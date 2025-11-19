interface CompanyIdentityTabProps {
  siren: string
}

interface CompanyIdentity {
  siren: string
  siret: string
  address: {
    street: string
    postalCode: string
    city: string
    country: string
  }
  activity: string
  nafCode: string
  nafLabel: string
  directors: Array<{
    name: string
    role: string
    since: string
  }>
  employeeRange: string
  creationDate: string
  capital: string
  vatNumber: string
  rcs: string
}

// Mock data
const mockData: CompanyIdentity = {
  siren: '542065479',
  siret: '54206547900012',
  address: {
    street: '35 RUE JOSEPH MONIER',
    postalCode: '92500',
    city: 'RUEIL-MALMAISON',
    country: 'FRANCE',
  },
  activity: 'Fabrication de matériel électrique de distribution et de commande',
  nafCode: '2711Z',
  nafLabel: 'Fabrication de moteurs, génératrices et transformateurs électriques',
  directors: [
    { name: 'Jean-Pascal TRICOIRE', role: 'Président', since: '2006' },
    { name: 'Hilary MAXSON', role: 'Directrice Financière', since: '2020' },
    { name: 'Gwenaelle AVICE-HUET', role: 'Directrice Générale Déléguée', since: '2021' },
  ],
  employeeRange: '10000+',
  creationDate: '01/01/1990',
  capital: '2,313,769,500 EUR',
  vatNumber: 'FR82542065479',
  rcs: 'NANTERRE B 542 065 479',
}

export default function CompanyIdentityTab({ siren: _siren }: CompanyIdentityTabProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Identification */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Identification</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2">
            <span className="text-sm text-gray-600">SIREN</span>
            <span className="text-sm font-medium text-[#1A1C20]">{mockData.siren}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-gray-600">SIRET</span>
            <span className="text-sm font-medium text-[#1A1C20]">{mockData.siret}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-gray-600">VAT Number</span>
            <span className="text-sm font-medium text-[#1A1C20]">{mockData.vatNumber}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-gray-600">RCS</span>
            <span className="text-sm font-medium text-[#1A1C20]">{mockData.rcs}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-gray-600">Creation Date</span>
            <span className="text-sm font-medium text-[#1A1C20]">{mockData.creationDate}</span>
          </div>
          <div className="grid grid-cols-2">
            <span className="text-sm text-gray-600">Capital</span>
            <span className="text-sm font-medium text-[#1A1C20]">{mockData.capital}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Registered Address</h3>
        <div className="space-y-2">
          <p className="text-sm text-[#1A1C20]">{mockData.address.street}</p>
          <p className="text-sm text-[#1A1C20]">
            {mockData.address.postalCode} {mockData.address.city}
          </p>
          <p className="text-sm text-[#1A1C20]">{mockData.address.country}</p>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border border-[#E1E5EB] p-4 col-span-2">
        <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Activity</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-4">
            <span className="text-sm text-gray-600">NAF Code</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{mockData.nafCode}</span>
          </div>
          <div className="grid grid-cols-4">
            <span className="text-sm text-gray-600">NAF Label</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{mockData.nafLabel}</span>
          </div>
          <div className="grid grid-cols-4">
            <span className="text-sm text-gray-600">Description</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{mockData.activity}</span>
          </div>
          <div className="grid grid-cols-4">
            <span className="text-sm text-gray-600">Employee Range</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{mockData.employeeRange}</span>
          </div>
        </div>
      </div>

      {/* Directors */}
      <div className="bg-white border border-[#E1E5EB] p-4 col-span-2">
        <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Directors</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase py-2">Name</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase py-2">Role</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase py-2">Since</th>
            </tr>
          </thead>
          <tbody>
            {mockData.directors.map((director, index) => (
              <tr key={index} className="border-b border-[#E1E5EB]">
                <td className="py-2 text-sm font-medium text-[#1A1C20]">{director.name}</td>
                <td className="py-2 text-sm text-gray-600">{director.role}</td>
                <td className="py-2 text-sm text-gray-600">{director.since}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

