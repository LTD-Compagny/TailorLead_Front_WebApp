import type { CompanyAnalysisData } from '../../data/loadData'

interface CompanyIdentityTabProps {
  siren: string
  companyData: CompanyAnalysisData
}

export default function CompanyIdentityTab({ siren: _siren, companyData }: CompanyIdentityTabProps) {
  const pappers = companyData.data.pappers
  const siege = pappers.siege

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  return (
    <div className="space-y-4 p-4">
      {/* Section: Identité */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">Identité</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">SIREN</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.siren_formate || pappers.siren}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">SIRET</span>
              <span className="text-sm font-medium text-[#1A1C20]">{siege.siret_formate || siege.siret}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">VAT Number</span>
              <span className="text-sm font-medium text-[#1A1C20]">
                {pappers.numero_tva_intracommunautaire || 'N/A'}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">RCS</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.numero_rcs || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">Date de création</span>
              <span className="text-sm font-medium text-[#1A1C20]">{formatDate(pappers.date_creation)}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">Capital</span>
              <span className="text-sm font-medium text-[#1A1C20]">
                {pappers.capital_formate || `${pappers.capital?.toLocaleString('fr-FR')} ${pappers.devise_capital || 'EUR'}`}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">Effectif</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.effectif || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4B4F5C]">Forme juridique</span>
              <span className="text-sm font-medium text-[#1A1C20]">{pappers.forme_juridique || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Localisation */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">Localisation</h2>
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#1A1C20]">{siege.adresse_ligne_1}</p>
          {siege.adresse_ligne_2 && <p className="text-sm text-[#1A1C20]">{siege.adresse_ligne_2}</p>}
          <p className="text-sm text-[#1A1C20]">
            {siege.code_postal} {siege.ville}
          </p>
          <p className="text-sm text-[#4B4F5C]">{siege.pays}</p>
          {siege.latitude && siege.longitude && (
            <div className="mt-2 text-xs text-[#4B4F5C]">
              GPS: {siege.latitude.toFixed(6)}, {siege.longitude.toFixed(6)}
            </div>
          )}
        </div>
      </div>

      {/* Section: Activité */}
      <div className="bg-white border border-[#E1E5EB] p-4">
        <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">Activité</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-4">
            <span className="text-sm text-[#4B4F5C]">Code NAF</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{pappers.code_naf}</span>
          </div>
          <div className="grid grid-cols-4">
            <span className="text-sm text-[#4B4F5C]">Libellé NAF</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{pappers.libelle_code_naf}</span>
          </div>
          <div className="grid grid-cols-4">
            <span className="text-sm text-[#4B4F5C]">Domaine d'activité</span>
            <span className="text-sm font-medium text-[#1A1C20] col-span-3">{pappers.domaine_activite}</span>
          </div>
          {pappers.objet_social && (
            <div className="grid grid-cols-4">
              <span className="text-sm text-[#4B4F5C]">Objet social</span>
              <span className="text-sm font-medium text-[#1A1C20] col-span-3">{pappers.objet_social}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section: Gouvernance */}
      {pappers.representants && pappers.representants.length > 0 && (
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">Gouvernance</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E1E5EB]">
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Nom</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Rôle</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Depuis</th>
              </tr>
            </thead>
            <tbody>
              {pappers.representants.map((rep: any, index: number) => (
                <tr key={index} className="border-b border-[#E1E5EB]">
                  <td className="py-2 text-sm font-medium text-[#1A1C20]">
                    {rep.nom_complet || rep.denomination || 'N/A'}
                  </td>
                  <td className="py-2 text-sm text-[#4B4F5C]">
                    {rep.qualite || rep.qualites?.join(', ') || 'N/A'}
                  </td>
                  <td className="py-2 text-sm text-[#4B4F5C]">
                    {formatDate(rep.date_prise_de_poste)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Section: Établissements */}
      {pappers.etablissements && pappers.etablissements.length > 0 && (
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">
            Établissements ({pappers.etablissements.length})
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
        </div>
      )}

      {/* Section: Documents officiels */}
      {pappers.comptes && pappers.comptes.length > 0 && (
        <div className="bg-white border border-[#E1E5EB] p-4">
          <h2 className="text-sm font-semibold text-[#1A1C20] uppercase tracking-wide mb-4">Documents officiels</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E1E5EB]">
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Année</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Date clôture</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Type</th>
                <th className="text-left text-xs font-bold text-[#4B4F5C] uppercase py-2">Documents</th>
              </tr>
            </thead>
            <tbody>
              {pappers.comptes.map((compte: any, index: number) => (
                <tr key={index} className="border-b border-[#E1E5EB]">
                  <td className="py-2 text-sm font-medium text-[#1A1C20]">{compte.annee_cloture}</td>
                  <td className="py-2 text-sm text-[#4B4F5C]">{compte.date_cloture}</td>
                  <td className="py-2 text-sm text-[#4B4F5C]">{compte.type_comptes}</td>
                  <td className="py-2 text-sm text-[#4B4F5C]">
                    {compte.disponible && (
                      <span className="text-[#3A6FF7]">PDF</span>
                    )}
                    {compte.disponible_xlsx && (
                      <span className="text-[#3A6FF7] ml-2">XLSX</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
