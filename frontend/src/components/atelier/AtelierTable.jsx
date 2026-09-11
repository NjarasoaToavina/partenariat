import { CalendarDays, ChevronsUpDown, Eye, MoreVertical } from "lucide-react";
import { StatutBadge, CampusBadge } from "./Badges";
import IntervenantAvatar from "./IntervenantAvatar";

export default function AtelierTable({ ateliers, sortAsc, onToggleSort, onView, onMore }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1100px] border-separate border-spacing-0">
        <thead>
          <tr className="bg-[#0065CD] text-white text-sm">
            <th className="text-left font-semibold px-4 py-3 rounded-l-xl">
              <button
                onClick={onToggleSort}
                className="flex items-center gap-1.5"
              >
                Date
                <ChevronsUpDown size={14} />
              </button>
            </th>
            <th className="text-left font-semibold px-4 py-3">Campus</th>
            <th className="text-left font-semibold px-4 py-3">
              Classe/Filière
            </th>
            <th className="text-left font-semibold px-4 py-3">Nb.groupe</th>
            <th className="text-left font-semibold px-4 py-3">
              Contenu (Thematique)
            </th>
            <th className="text-left font-semibold px-4 py-3">Intervenant</th>
            <th className="text-left font-semibold px-4 py-3">Statut</th>
            <th className="text-left font-semibold px-4 py-3 rounded-r-xl">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {ateliers.map((a) => (
            <tr key={a.id} className="border-b border-slate-100 last:border-b-0">
              <td className="px-4 py-4 align-top">
                <span className="flex items-center gap-2 text-sm text-slate-700 whitespace-nowrap">
                  <CalendarDays size={15} className="text-slate-400" />
                  <span>
                    <span className="block font-semibold text-slate-900">
                      {a.date}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {a.time}
                    </span>
                  </span>
                </span>
              </td>
              <td className="px-4 py-4 align-top">
                <CampusBadge campus={a.campus} />
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                <span className="block font-semibold text-slate-900">
                  {a.classe}
                </span>
                <span className="block text-xs text-slate-400">
                  {a.filiere}
                </span>
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {a.groupes} groupes
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700 max-w-[220px]">
                {a.contenu}
              </td>
              <td className="px-4 py-4 align-top">
                <IntervenantAvatar name={a.intervenant} />
              </td>
              <td className="px-4 py-4 align-top">
                <StatutBadge statut={a.statut} />
              </td>
              <td className="px-4 py-4 align-top">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView?.(a)}
                    className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-colors"
                    aria-label={`Voir l'atelier ${a.contenu}`}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onMore?.(a)}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Plus d'actions"
                  >
                    <MoreVertical size={16} />
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