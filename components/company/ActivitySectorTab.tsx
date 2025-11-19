interface ActivitySectorTabProps {
  siren: string
}

interface Competitor {
  name: string
  siren: string
  turnover: number
  employees: string
  marketShare: number
}

// Mock data
const mockSectorData = {
  primarySector: 'Electrical Equipment Manufacturing',
  secondarySector: 'Energy Management Solutions',
  nafCode: '2711Z',
  description:
    'Schneider Electric operates in the energy management and automation sector, providing integrated solutions for residential, commercial, and industrial applications. The company specializes in electrical distribution, industrial control, and automation systems.',
  marketPosition: 'Market Leader',
  competitors: [
    {
      name: 'ABB Ltd',
      siren: '123456789',
      turnover: 29000000000,
      employees: '105000',
      marketShare: 18.5,
    },
    {
      name: 'Siemens Energy AG',
      siren: '234567890',
      turnover: 31200000000,
      employees: '94000',
      marketShare: 19.8,
    },
    {
      name: 'Eaton Corporation',
      siren: '345678901',
      turnover: 20000000000,
      employees: '92000',
      marketShare: 12.7,
    },
    {
      name: 'Legrand SA',
      siren: '456789012',
      turnover: 8100000000,
      employees: '38000',
      marketShare: 5.2,
    },
  ],
  marketOverview: {
    totalMarketSize: '€157B',
    annualGrowthRate: '6.2%',
    keyDrivers: ['Energy transition', 'Industrial automation', 'Smart buildings', 'IoT integration'],
    mainRegions: ['Europe (38%)', 'North America (32%)', 'Asia-Pacific (24%)', 'Rest of World (6%)'],
  },
}

const formatCurrency = (value: number) => {
  return `€${(value / 1000000).toFixed(0)}M`
}

export default function ActivitySectorTab({ siren }: ActivitySectorTabProps) {
  return (
    <div className="space-y-4">
      {/* Sector Classification */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Sector Classification</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Primary Sector</span>
              <span className="text-sm font-medium text-[#1A1C20]">{mockSectorData.primarySector}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Secondary Sector</span>
              <span className="text-sm font-medium text-[#1A1C20]">{mockSectorData.secondarySector}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">NAF Code</span>
              <span className="text-sm font-medium text-[#1A1C20]">{mockSectorData.nafCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Market Position</span>
              <span className="text-sm font-bold text-[#3A6FF7]">{mockSectorData.marketPosition}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Market Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Market Size</span>
              <span className="text-sm font-bold text-[#1A1C20]">{mockSectorData.marketOverview.totalMarketSize}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Annual Growth Rate</span>
              <span className="text-sm font-bold text-green-600">{mockSectorData.marketOverview.annualGrowthRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Description */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h3 className="text-sm font-bold text-[#1A1C20] mb-3 uppercase">Activity Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{mockSectorData.description}</p>
      </div>

      {/* Key Market Drivers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-3 uppercase">Key Market Drivers</h3>
          <ul className="space-y-2">
            {mockSectorData.marketOverview.keyDrivers.map((driver, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="mr-2">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-3 uppercase">Regional Distribution</h3>
          <ul className="space-y-2">
            {mockSectorData.marketOverview.mainRegions.map((region, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="mr-2">•</span>
                <span>{region}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitors Table */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Main Competitors</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Company Name</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">SIREN</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Turnover</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Employees</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Market Share</th>
            </tr>
          </thead>
          <tbody>
            {mockSectorData.competitors.map((competitor, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{competitor.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{competitor.siren}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-[#1A1C20]">
                  {formatCurrency(competitor.turnover)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{competitor.employees}</td>
                <td className="px-4 py-3 text-sm text-right font-bold text-[#1A1C20]">
                  {competitor.marketShare.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

