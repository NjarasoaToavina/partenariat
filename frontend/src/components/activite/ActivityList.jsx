import { Pencil, Trash2 } from "lucide-react";
import { getEtat } from "../../data/activiteData";
import { fmtDate, fmtTime } from "./activiteUtils";

export default function ActivityList({ items, loading, onEdit, onDelete }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold text-slate-800">
          Activités du mois
        </h2>
        <span className="text-sm text-slate-500">{items.length}</span>
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500">
          {loading ? "Chargement…" : "Aucune activité ce mois-ci."}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((a) => {
            const etat = getEtat(a.etat_activ);
            return (
              <li key={a.id_activ} className="flex items-center gap-3 px-4 py-3">
                <div className="w-24 shrink-0 text-xs text-slate-500">
                  <p className="font-medium capitalize text-slate-700">
                    {fmtDate(a.date_debut_activ)}
                  </p>
                  <p>
                    {fmtTime(a.date_debut_activ)}
                    {a.date_fin_activ && ` – ${fmtTime(a.date_fin_activ)}`}
                  </p>
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                  {a.sujet}
                </p>
                <span
                  className={`hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${etat.chip}`}
                >
                  {etat.label}
                </span>
                <div className="flex shrink-0 items-center">
                  <button
                    onClick={() => onEdit(a)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#0065CD]"
                    aria-label={`Modifier ${a.sujet}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(a)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Supprimer ${a.sujet}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}