interface TabsBarProps {
  tabs: string[]
  activeTab: number
  onTabChange: (index: number) => void
}

export default function TabsBar({ tabs, activeTab, onTabChange }: TabsBarProps) {
  return (
    <div className="border-t border-[#E1E5EB] bg-white">
      <div className="px-6 flex items-center">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onTabChange(index)}
            className={`
              px-4 py-3 text-sm font-medium border-b-2 transition-colors
              ${
                activeTab === index
                  ? 'border-[#3A6FF7] text-[#3A6FF7] font-bold'
                  : 'border-transparent text-gray-600 hover:text-[#1A1C20]'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}

