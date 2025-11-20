import AIBadge from '../ia/AIBadge'

export default function AISuggestions() {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* TailorLead AI Logo avec fond animé PremiumNetwork */}
      <AIBadge 
        className="flex items-center gap-1.5 px-2 py-1 border border-white/20 backdrop-blur-md"
        networkSize="xs"
        networkOpacity={0.4}
      >
        <div className="flex items-center gap-1.5">
          {/* Logo SVG simple */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
              fill="white"
            />
          </svg>
          <span className="text-white text-[10px] font-bold leading-tight">TailorLead</span>
          <span className="text-white/80 text-[10px] font-medium leading-tight">AI</span>
        </div>
      </AIBadge>
    </div>
  )
}


