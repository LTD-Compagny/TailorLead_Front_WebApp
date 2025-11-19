interface ShareholdersTabProps {
  siren: string
}

interface Shareholder {
  name: string
  type: 'Individual' | 'Corporation' | 'Investment Fund' | 'Family Office'
  ownership: number
  source: string
  lastUpdate: string
}

// Mock data
const mockShareholders: Shareholder[] = [
  {
    name: 'Invesco Ltd',
    type: 'Investment Fund',
    ownership: 5.12,
    source: 'AMF Declaration',
    lastUpdate: '2024-03-15',
  },
  {
    name: 'BlackRock Inc',
    type: 'Investment Fund',
    ownership: 4.87,
    source: 'AMF Declaration',
    lastUpdate: '2024-02-28',
  },
  {
    name: 'The Vanguard Group',
    type: 'Investment Fund',
    ownership: 3.95,
    source: 'AMF Declaration',
    lastUpdate: '2024-01-20',
  },
  {
    name: 'Norges Bank Investment Management',
    type: 'Investment Fund',
    ownership: 2.34,
    source: 'AMF Declaration',
    lastUpdate: '2023-12-31',
  },
  {
    name: 'Capital Research Global Investors',
    type: 'Investment Fund',
    ownership: 2.01,
    source: 'AMF Declaration',
    lastUpdate: '2024-02-15',
  },
  {
    name: 'Amundi Asset Management',
    type: 'Investment Fund',
    ownership: 1.78,
    source: 'AMF Declaration',
    lastUpdate: '2024-03-01',
  },
  {
    name: 'Public Float',
    type: 'Individual',
    ownership: 80.93,
    source: 'Calculated',
    lastUpdate: '2024-03-15',
  },
]

export default function ShareholdersTab({ siren }: ShareholdersTabProps) {
  const totalOwnership = mockShareholders.reduce((sum, sh) => sum + sh.ownership, 0)

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Shareholding Structure</h3>
          <div className="text-sm text-gray-600">
            Total: <span className="font-bold text-[#1A1C20]">{totalOwnership.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      {/* Shareholders Table */}
      <div className="bg-white border border-[#E1E5EB]">
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Name</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Type</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Ownership %</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Source</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {mockShareholders.map((shareholder, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{shareholder.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{shareholder.type}</td>
                <td className="px-4 py-3 text-sm font-bold text-[#1A1C20] text-right">
                  {shareholder.ownership.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{shareholder.source}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{shareholder.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Concentration Analysis */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Top 3 Concentration</div>
          <div className="text-2xl font-bold text-[#1A1C20]">13.94%</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Institutional Ownership</div>
          <div className="text-2xl font-bold text-[#1A1C20]">19.07%</div>
        </div>
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Public Float</div>
          <div className="text-2xl font-bold text-[#1A1C20]">80.93%</div>
        </div>
      </div>
    </div>
  )
}

