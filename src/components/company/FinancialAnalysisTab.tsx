interface FinancialAnalysisTabProps {
  siren: string
}

interface FinancialData {
  year: number
  turnover: number
  ebitda: number
  netProfit: number
  totalAssets: number
  totalDebt: number
  equity: number
}

// Mock data
const mockFinancials: FinancialData[] = [
  {
    year: 2023,
    turnover: 35900000000,
    ebitda: 6200000000,
    netProfit: 3500000000,
    totalAssets: 58000000000,
    totalDebt: 12000000000,
    equity: 28000000000,
  },
  {
    year: 2022,
    turnover: 34200000000,
    ebitda: 5900000000,
    netProfit: 3200000000,
    totalAssets: 55000000000,
    totalDebt: 13000000000,
    equity: 26000000000,
  },
  {
    year: 2021,
    turnover: 28900000000,
    ebitda: 4800000000,
    netProfit: 2600000000,
    totalAssets: 52000000000,
    totalDebt: 14000000000,
    equity: 24000000000,
  },
]

const formatCurrency = (value: number) => {
  return `€${(value / 1000000).toFixed(0)}M`
}

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`
}

export default function FinancialAnalysisTab({ siren: _siren }: FinancialAnalysisTabProps) {
  const latest = mockFinancials[0]
  const previous = mockFinancials[1]

  const ebitdaMargin = (latest.ebitda / latest.turnover) * 100
  const netMargin = (latest.netProfit / latest.turnover) * 100
  const debtToEquity = (latest.totalDebt / latest.equity) * 100
  const roe = (latest.netProfit / latest.equity) * 100

  const turnoverGrowth = ((latest.turnover - previous.turnover) / previous.turnover) * 100
  const ebitdaGrowth = ((latest.ebitda - previous.ebitda) / previous.ebitda) * 100

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Turnover 2023</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.turnover)}</div>
          <div className={`text-xs mt-1 ${turnoverGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {turnoverGrowth >= 0 ? '+' : ''}{turnoverGrowth.toFixed(1)}% YoY
          </div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">EBITDA 2023</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.ebitda)}</div>
          <div className={`text-xs mt-1 ${ebitdaGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {ebitdaGrowth >= 0 ? '+' : ''}{ebitdaGrowth.toFixed(1)}% YoY
          </div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Net Profit 2023</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.netProfit)}</div>
          <div className="text-xs text-gray-600 mt-1">Margin: {formatPercentage(netMargin)}</div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <div className="text-xs text-gray-600 uppercase mb-2">Total Debt</div>
          <div className="text-2xl font-bold text-[#1A1C20]">{formatCurrency(latest.totalDebt)}</div>
          <div className="text-xs text-gray-600 mt-1">D/E: {formatPercentage(debtToEquity)}</div>
        </div>
      </div>

      {/* Financial Ratios */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Profitability Ratios</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">EBITDA Margin</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(ebitdaMargin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Net Margin</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(netMargin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ROE</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(roe)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E1E5EB] p-4">
          <h3 className="text-sm font-bold text-[#1A1C20] mb-4 uppercase">Leverage Ratios</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Debt / Equity</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatPercentage(debtToEquity)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Debt / EBITDA</span>
              <span className="text-sm font-bold text-[#1A1C20]">{(latest.totalDebt / latest.ebitda).toFixed(2)}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Equity</span>
              <span className="text-sm font-bold text-[#1A1C20]">{formatCurrency(latest.equity)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Historical Financials</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Year</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Turnover</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">EBITDA</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Net Profit</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Total Assets</th>
              <th className="text-right text-xs font-bold text-gray-600 uppercase px-4 py-3">Total Debt</th>
            </tr>
          </thead>
          <tbody>
            {mockFinancials.map((data, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{data.year}</td>
                <td className="px-4 py-3 text-sm text-right font-medium text-[#1A1C20]">
                  {formatCurrency(data.turnover)}
                </td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(data.ebitda)}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(data.netProfit)}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(data.totalAssets)}</td>
                <td className="px-4 py-3 text-sm text-right text-gray-600">{formatCurrency(data.totalDebt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

