import { Pencil, Trash2, Plus } from "lucide-react";

export default function ConventionTable({ conventions, onEdit, onDelete }) {
  return (
    
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500">
            <th className="px-4 py-3">Numéro de la convention</th>
            <th className="px-4 py-3">Préambule</th>
            <th className="px-4 py-3">Représentant intern</th>
            <th className="px-4 py-3">Représentant externe</th>
            <th className="px-4 py-3">Objet</th>
            <th className="px-4 py-3">Axe de collaboration</th>
            <th className="px-4 py-3">Condition de partenariat</th>
            <th className="px-4 py-3">Condition de financement</th>
            <th className="px-4 py-3">Date de début de la convention</th>
            <th className="px-4 py-3">Date de fin de la convention</th>
            <th className="px-4 py-3">Résiliation</th>
            <th className="px-4 py-3">Règlement des différends</th>
            <th className="px-4 py-3">Droit applicable</th>
            <th className="px-4 py-3">Photo de la convention</th>
            <th className="px-4 py-3">Scan</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {conventions.map((convention) => (
            <tr key={convention.id_conv} className="border-t border-slate-100">
              <td className="px-4 py-4 align-top">
                  {convention.num_conv}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.preambule}
              </td>
              <td className="px-4 py-4 align-top">
                {convention.repres_int}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700 text-center">
                {convention.fct_int }
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.repres_ext}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.fct_ext}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.objet_part}
              </td>
              <td className="px-4 py-4 align-top text-sm">
                {convention.axe_collab}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.cond_part}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.cond_finan}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.date_debut_conv}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.date_fin_conv}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.resiliation}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.confidentialite}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.regle_diff}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.droit_appli}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.photo_conv}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {convention.scan}
              </td>
              <td className="px-4 py-4 align-top text-center">
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={() => onEdit?.(convention)}
                    className="w-8 h-8 inline-flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-colors"
                    aria-label={`Modifier ${convention.num_conv}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDelete?.(convention)}
                    className="w-8 h-8 inline-flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-[#E53E3E] hover:border-[#E53E3E]/40 hover:bg-[#FDECEC] transition-colors"
                    aria-label={`Supprimer ${convention.num_conv}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}