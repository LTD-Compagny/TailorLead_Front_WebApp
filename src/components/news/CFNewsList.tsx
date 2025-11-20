export default function CFNewsList() {
  return (
    <div className="relative border border-[#E1E5EB] bg-white p-6">
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-[#4B4F5C] mb-2">À venir</p>
          <p className="text-sm text-[#4B4F5C]">Les actualités CFNews seront bientôt disponibles.</p>
        </div>
      </div>

      {/* Blurred content underneath (placeholder) */}
      <div className="opacity-30 pointer-events-none">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-[#E1E5EB] bg-[#F5F7FA] p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 text-xs font-medium bg-[#3A6FF7] text-white">
                  CFNEWS
                </span>
                <span className="text-xs text-[#4B4F5C]">Date à venir</span>
              </div>
              <h3 className="text-base font-semibold text-[#1A1C20]">
                Actualité CFNews #{i}
              </h3>
              <p className="text-sm text-[#4B4F5C]">
                Contenu des actualités CFNews à venir...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

