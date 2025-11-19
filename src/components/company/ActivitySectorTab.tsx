import type { CompanyAnalysisData } from '../../data/loadData'
import EstablishmentsMap from './EstablishmentsMap'

interface ActivitySectorTabProps {
  siren: string
  companyData: CompanyAnalysisData
}

export default function ActivitySectorTab({ siren: _siren, companyData }: ActivitySectorTabProps) {
  const pappers = companyData.data.pappers

  return (
    <div className="space-y-4 p-4">
      {/* Section: Classification NAF & secteur */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">
          Classification NAF & secteur
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Code NAF</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.code_naf}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Libellé NAF</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.libelle_code_naf}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Domaine d'activité</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.domaine_activite}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Forme juridique</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.forme_juridique}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Effectif</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.effectif || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#4B4F5C]">Statut</span>
              <span className="text-sm font-bold text-green-600">{pappers.statut_consolide || 'Actif'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Activité & positionnement */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">
          Activité & positionnement
        </h2>
        {pappers.objet_social && (
          <div className="mb-4">
            <div className="text-xs text-[#4B4F5C] uppercase mb-2">Objet social</div>
            <p className="text-sm text-[#1A1C20] leading-relaxed">{pappers.objet_social}</p>
          </div>
        )}

        {/* Activités RNE */}
        {pappers.activites_rne && pappers.activites_rne.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-[#4B4F5C] uppercase mb-2">Activités RNE</div>
            <div className="space-y-1">
              {pappers.activites_rne.map((activite: any, index: number) => (
                <div key={index} className="text-sm text-[#1A1C20]">
                  • {activite.description}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conventions collectives */}
        {pappers.conventions_collectives && pappers.conventions_collectives.length > 0 && (
          <div>
            <div className="text-xs text-[#4B4F5C] uppercase mb-2">Conventions collectives</div>
            <div className="space-y-1">
              {pappers.conventions_collectives.map((conv: any, index: number) => (
                <div key={index} className="text-sm text-[#1A1C20]">
                  • {conv.nom} {conv.idcc && `(IDCC: ${conv.idcc})`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Geographic Footprint */}
      {pappers.etablissements && pappers.etablissements.length > 0 && (
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">
            Empreinte géographique ({pappers.etablissements.length} établissement{pappers.etablissements.length > 1 ? 's' : ''})
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E1E5EB]">
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">SIRET</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Adresse</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Type</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Effectif</th>
              </tr>
            </thead>
            <tbody>
              {pappers.etablissements.map((etab: any, index: number) => (
                <tr key={index} className="border-b border-[#E1E5EB]">
                  <td className="py-2 text-sm font-medium text-[#1A1C20]">
                    {etab.siret_formate || etab.siret}
                  </td>
                  <td className="py-2 text-sm text-[#4B4F5C]">
                    {etab.adresse_ligne_1}, {etab.code_postal} {etab.ville}
                  </td>
                  <td className="py-2 text-sm text-[#4B4F5C]">
                    {etab.siege ? 'Siège' : etab.type_etablissement || 'N/A'}
                  </td>
                  <td className="py-2 text-sm text-[#4B4F5C]">{etab.effectif || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Carte des établissements */}
          <div className="mt-4">
            <EstablishmentsMap establishments={pappers.etablissements} />
          </div>
        </div>
      )}
    </div>
  )
}
