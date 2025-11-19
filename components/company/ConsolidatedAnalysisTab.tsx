interface ConsolidatedAnalysisTabProps {
  siren: string
}

interface RiskIndicator {
  category: string
  score: number
  status: 'Low' | 'Medium' | 'High'
  details: string
}

interface GrowthSignal {
  indicator: string
  trend: 'Positive' | 'Neutral' | 'Negative'
  value: string
  commentary: string
}

interface AcquisitionSignal {
  signal: string
  strength: 'Strong' | 'Moderate' | 'Weak'
  lastDetected: string
}

// Mock data
const mockRiskIndicators: RiskIndicator[] = [
  {
    category: 'Financial Health',
    score: 85,
    status: 'Low',
    details: 'Strong balance sheet, healthy cash flow, low debt ratio',
  },
  {
    category: 'Market Position',
    score: 92,
    status: 'Low',
    details: 'Market leader with sustained competitive advantage',
  },
  {
    category: 'Regulatory Compliance',
    score: 78,
    status: 'Low',
    details: 'No recent compliance issues, strong governance',
  },
  {
    category: 'Operational Risk',
    score: 65,
    status: 'Medium',
    details: 'Supply chain exposure, geographic concentration',
  },
]

const mockGrowthSignals: GrowthSignal[] = [
  {
    indicator: 'Revenue Growth',
    trend: 'Positive',
    value: '+4.97% YoY',
    commentary: 'Consistent growth driven by data center and sustainability segments',
  },
  {
    indicator: 'Market Expansion',
    trend: 'Positive',
    value: '3 new markets',
    commentary: 'Recent entry into Southeast Asia and Latin America',
  },
  {
    indicator: 'R&D Investment',
    trend: 'Positive',
    value: '€1.8B (5% of revenue)',
    commentary: 'Increased focus on AI and IoT solutions',
  },
  {
    indicator: 'Employee Headcount',
    trend: 'Neutral',
    value: '+2.3%',
    commentary: 'Steady hiring with focus on digital talent',
  },
]

const mockAcquisitionSignals: AcquisitionSignal[] = [
  {
    signal: 'High acquisition activity (3 deals in 18 months)',
    strength: 'Strong',
    lastDetected: '2024-03-20',
  },
  {
    signal: 'Increased cash reserves',
    strength: 'Moderate',
    lastDetected: '2024-02-28',
  },
  {
    signal: 'Strategic partnership announcements',
    strength: 'Moderate',
    lastDetected: '2024-03-10',
  },
  {
    signal: 'Board changes focused on M&A expertise',
    strength: 'Weak',
    lastDetected: '2024-01-15',
  },
]

const mockManagementChanges = [
  {
    date: '2024-01-20',
    change: 'CFO Appointment',
    person: 'Hilary Maxson',
    impact: 'Positive',
  },
  {
    date: '2023-11-05',
    change: 'Board Member Addition',
    person: 'Linda Fayne Levinson',
    impact: 'Neutral',
  },
]

export default function ConsolidatedAnalysisTab({ siren }: ConsolidatedAnalysisTabProps) {
  const globalRiskScore = Math.round(
    mockRiskIndicators.reduce((sum, r) => sum + r.score, 0) / mockRiskIndicators.length
  )

  const getRiskColor = (status: string) => {
    const colors = {
      Low: 'text-green-600',
      Medium: 'text-yellow-600',
      High: 'text-red-600',
    }
    return colors[status as keyof typeof colors] || colors.Medium
  }

  const getTrendColor = (trend: string) => {
    const colors = {
      Positive: 'text-green-600',
      Neutral: 'text-gray-600',
      Negative: 'text-red-600',
    }
    return colors[trend as keyof typeof colors] || colors.Neutral
  }

  const getStrengthColor = (strength: string) => {
    const colors = {
      Strong: 'bg-green-100 text-green-700 border-green-200',
      Moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Weak: 'bg-gray-100 text-gray-700 border-gray-200',
    }
    return colors[strength as keyof typeof colors] || colors.Weak
  }

  return (
    <div className="space-y-4">
      {/* Global Risk Score */}
      <div className="bg-white border border-[#E1E5EB] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1A1C20] mb-2 uppercase">Global Risk Score</h3>
            <p className="text-sm text-gray-600">Consolidated assessment based on multiple indicators</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-green-600">{globalRiskScore}</div>
            <div className="text-sm text-gray-600 mt-1">/ 100 (Low Risk)</div>
          </div>
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Risk Breakdown</h3>
        </div>
        <div className="p-4 space-y-4">
          {mockRiskIndicators.map((risk, index) => (
            <div key={index} className="border border-[#E1E5EB] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#1A1C20]">{risk.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#1A1C20]">{risk.score}/100</span>
                  <span className={`text-sm font-bold ${getRiskColor(risk.status)}`}>{risk.status} Risk</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{risk.details}</p>
              <div className="mt-2 h-2 bg-[#F5F7FA] border border-[#E1E5EB]">
                <div
                  className="h-full bg-green-600"
                  style={{ width: `${risk.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Indicators */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Growth Indicators</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Indicator</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Trend</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Value</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Commentary</th>
            </tr>
          </thead>
          <tbody>
            {mockGrowthSignals.map((signal, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{signal.indicator}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-bold ${getTrendColor(signal.trend)}`}>{signal.trend}</span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-[#1A1C20]">{signal.value}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{signal.commentary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acquisition Signals */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Acquisition Signals</h3>
        </div>
        <div className="p-4 space-y-3">
          {mockAcquisitionSignals.map((signal, index) => (
            <div key={index} className="flex items-center justify-between border border-[#E1E5EB] p-3">
              <span className="text-sm text-[#1A1C20]">{signal.signal}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-600">{signal.lastDetected}</span>
                <span className={`inline-block px-2 py-1 text-xs font-medium border ${getStrengthColor(signal.strength)}`}>
                  {signal.strength}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management Changes */}
      <div className="bg-white border border-[#E1E5EB]">
        <div className="px-4 py-3 border-b border-[#E1E5EB]">
          <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Recent Management Changes</h3>
        </div>
        <table className="w-full">
          <thead className="bg-[#F5F7FA]">
            <tr className="border-b border-[#E1E5EB]">
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Date</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Change Type</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Person</th>
              <th className="text-left text-xs font-bold text-gray-600 uppercase px-4 py-3">Impact</th>
            </tr>
          </thead>
          <tbody>
            {mockManagementChanges.map((change, index) => (
              <tr key={index} className="border-b border-[#E1E5EB] hover:bg-[#F5F7FA]">
                <td className="px-4 py-3 text-sm text-gray-600">{change.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1A1C20]">{change.change}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{change.person}</td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-bold ${getTrendColor(change.impact)}`}>{change.impact}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

