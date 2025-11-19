interface Tab {
  id: string
  label: string
}

interface TabsBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function TabsBar({ tabs, activeTab, onTabChange }: TabsBarProps) {
  return (
    <div className="border-t border-[#E1E5EB] bg-white">
      <div className="px-6 flex items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? 'border-[#3A6FF7] text-[#3A6FF7] font-bold'
                  : 'border-transparent text-gray-600 hover:text-[#1A1C20]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
