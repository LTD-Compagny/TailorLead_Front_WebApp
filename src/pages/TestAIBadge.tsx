import AIBadge from '../components/ia/AIBadge'

export default function TestAIBadge() {
  return (
    <div className="min-h-screen p-10 bg-[#F5F7FA]">
      <h1 className="text-3xl font-bold text-[#1A1C20] mb-8">Test AI Badge</h1>

      <div className="space-y-8">
        {/* Section 1: TailorLead AI Logo */}
        <section className="bg-white border border-[#E1E5EB] p-6">
          <h2 className="text-lg font-semibold text-[#1A1C20] mb-4">TailorLead AI Logo</h2>
          <AIBadge 
            className="inline-flex items-center gap-1.5 px-2 py-1 border border-white/20 backdrop-blur-md bg-[#0d1b2a]"
            networkSize="sm"
            networkOpacity={0.4}
          >
            <div className="flex items-center gap-1.5">
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
        </section>

        {/* Section 2: Score Badges */}
        <section className="bg-white border border-[#E1E5EB] p-6">
          <h2 className="text-lg font-semibold text-[#1A1C20] mb-4">Score Badges</h2>
          <div className="flex gap-4 flex-wrap">
            {/* Score Élevé */}
            <AIBadge
              className="inline-flex items-center px-2 py-1 text-xs font-bold border bg-[#0d1b2a] backdrop-blur-md text-blue-300 border-blue-400/30"
              networkSize="sm"
              networkOpacity={0.35}
            >
              <span>Élevé: 85/100</span>
            </AIBadge>

            {/* Score Moyen */}
            <AIBadge
              className="inline-flex items-center px-2 py-1 text-xs font-bold border bg-[#0d1b2a] backdrop-blur-md text-yellow-300 border-yellow-400/30"
              networkSize="sm"
              networkOpacity={0.35}
            >
              <span>Moyen: 60/100</span>
            </AIBadge>

            {/* Score Faible */}
            <AIBadge
              className="inline-flex items-center px-2 py-1 text-xs font-bold border bg-[#0d1b2a] backdrop-blur-md text-orange-300 border-orange-400/30"
              networkSize="sm"
              networkOpacity={0.35}
            >
              <span>Faible: 35/100</span>
            </AIBadge>
          </div>
        </section>

        {/* Section 3: Analysis Badges */}
        <section className="bg-white border border-[#E1E5EB] p-6">
          <h2 className="text-lg font-semibold text-[#1A1C20] mb-4">Analysis Badges</h2>
          <div className="space-y-4">
            {/* Analyse IA */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.3}
            >
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
              <span className="text-white text-xs font-semibold uppercase tracking-wide">
                Analyse IA de la situation financière
              </span>
            </AIBadge>

            {/* Synthèse IA */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.3}
            >
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
              <span className="text-white text-xs font-semibold uppercase tracking-wide">
                Synthèse IA globale
              </span>
            </AIBadge>

            {/* Valorisation IA */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.3}
            >
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
              <span className="text-white text-xs font-semibold uppercase tracking-wide">
                Valorisation IA estimée
              </span>
            </AIBadge>
          </div>
        </section>

        {/* Section 4: Different Sizes */}
        <section className="bg-white border border-[#E1E5EB] p-6">
          <h2 className="text-lg font-semibold text-[#1A1C20] mb-4">Different Network Sizes</h2>
          <div className="flex gap-4 items-center flex-wrap">
            {/* Small */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.4}
            >
              <span className="text-white text-xs font-semibold">Small Network</span>
            </AIBadge>

            {/* Medium */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="md"
              networkOpacity={0.4}
            >
              <span className="text-white text-sm font-semibold">Medium Network</span>
            </AIBadge>

            {/* Large */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="lg"
              networkOpacity={0.4}
            >
              <span className="text-white text-base font-semibold">Large Network</span>
            </AIBadge>
          </div>
        </section>

        {/* Section 5: Different Opacities */}
        <section className="bg-white border border-[#E1E5EB] p-6">
          <h2 className="text-lg font-semibold text-[#1A1C20] mb-4">Different Network Opacities</h2>
          <div className="flex gap-4 flex-wrap">
            {/* 20% opacity */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.2}
            >
              <span className="text-white text-xs font-semibold">Opacity 20%</span>
            </AIBadge>

            {/* 40% opacity */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.4}
            >
              <span className="text-white text-xs font-semibold">Opacity 40%</span>
            </AIBadge>

            {/* 60% opacity */}
            <AIBadge 
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#3A6FF7]/20 bg-[#0d1b2a] backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.6}
            >
              <span className="text-white text-xs font-semibold">Opacity 60%</span>
            </AIBadge>
          </div>
        </section>

        {/* Section 6: On Dark Background */}
        <section className="bg-[#0d1b2a] border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">On Dark Background</h2>
          <div className="flex gap-4 flex-wrap">
            <AIBadge 
              className="inline-flex items-center gap-1.5 px-2 py-1 border border-white/20 backdrop-blur-md"
              networkSize="sm"
              networkOpacity={0.4}
            >
              <div className="flex items-center gap-1.5">
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

            <AIBadge
              className="inline-flex items-center px-2 py-1 text-xs font-bold border backdrop-blur-md text-blue-300 border-blue-400/30"
              networkSize="sm"
              networkOpacity={0.35}
            >
              <span>Élevé: 85/100</span>
            </AIBadge>
          </div>
        </section>
      </div>
    </div>
  )
}

