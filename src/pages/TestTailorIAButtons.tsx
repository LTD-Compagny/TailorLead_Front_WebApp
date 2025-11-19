import TailorIAButtonDynamic from '../components/ia/TailorIAButtonDynamic'

export default function TestTailorIAButtons() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 bg-[#F2F5FA] p-10">
      <h1 className="text-3xl font-bold text-[#1A1C20] mb-4">TailorIA Dynamic Buttons</h1>
      
      {/* Buttons Row */}
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <TailorIAButtonDynamic size="xs">IA</TailorIAButtonDynamic>
          <span className="text-xs text-gray-600 font-mono">xs (42×42)</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <TailorIAButtonDynamic size="sm">IA</TailorIAButtonDynamic>
          <span className="text-xs text-gray-600 font-mono">sm (56×56)</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <TailorIAButtonDynamic size="md">IA</TailorIAButtonDynamic>
          <span className="text-xs text-gray-600 font-mono">md (72×72)</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <TailorIAButtonDynamic size="lg">IA</TailorIAButtonDynamic>
          <span className="text-xs text-gray-600 font-mono">lg (88×88)</span>
        </div>
      </div>

      {/* Examples with different content */}
      <div className="border-t border-gray-300 w-full max-w-4xl pt-12">
        <h2 className="text-xl font-semibold text-[#1A1C20] mb-6 text-center">Different Content Examples</h2>
        
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <TailorIAButtonDynamic size="md">AI</TailorIAButtonDynamic>
          <TailorIAButtonDynamic size="md">🤖</TailorIAButtonDynamic>
          <TailorIAButtonDynamic size="md">
            <svg
              width="20"
              height="20"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
                fill="white"
              />
            </svg>
          </TailorIAButtonDynamic>
        </div>
      </div>

      {/* On Dark Background */}
      <div className="border-t border-gray-300 w-full max-w-4xl pt-12">
        <h2 className="text-xl font-semibold text-[#1A1C20] mb-6 text-center">Sur Fond Sombre</h2>
        
        <div className="bg-[#0d1b2a] p-8 rounded-lg flex items-center justify-center gap-8">
          <TailorIAButtonDynamic size="xs">IA</TailorIAButtonDynamic>
          <TailorIAButtonDynamic size="sm">IA</TailorIAButtonDynamic>
          <TailorIAButtonDynamic size="md">IA</TailorIAButtonDynamic>
          <TailorIAButtonDynamic size="lg">IA</TailorIAButtonDynamic>
        </div>
      </div>

      {/* Use Case Examples */}
      <div className="border-t border-gray-300 w-full max-w-4xl pt-12">
        <h2 className="text-xl font-semibold text-[#1A1C20] mb-6 text-center">Real Use Case Examples</h2>
        
        <div className="space-y-6">
          {/* Example 1: Search refinement */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center gap-4">
            <TailorIAButtonDynamic size="sm">IA</TailorIAButtonDynamic>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Affinez votre recherche avec TailorIA..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6D8BF7]"
              />
            </div>
          </div>

          {/* Example 2: IA Score Badge */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center gap-4">
            <span className="text-sm text-gray-600">Score IA:</span>
            <TailorIAButtonDynamic size="xs">85</TailorIAButtonDynamic>
            <span className="text-sm font-bold text-[#1A1C20]">Score élevé détecté</span>
          </div>

          {/* Example 3: IA Indicator */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <TailorIAButtonDynamic size="xs">IA</TailorIAButtonDynamic>
              <h3 className="text-sm font-bold text-[#1A1C20] uppercase">Analyse IA de la situation financière</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Cette entreprise présente une croissance stable avec un chiffre d'affaires en progression constante...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

