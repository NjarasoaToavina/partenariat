import { Search, Calendar, RotateCcw } from "lucide-react";
import { DOC_TYPE_LABELS, DOC_STATUS_LABELS } from "../../data/documentData";

const selectCls =
  "w-full pl-3 pr-8 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-[#0F2942]/15 focus:border-[#0F2942] transition-colors";

function FilterLabel({ children }) {
  return <label className="text-xs font-medium text-slate-500 mb-1.5 block">{children}</label>;
}

export default function DocumentFilters({ filters, onChange, onReset }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto] gap-4 items-end">
        <div>
          <FilterLabel>Rechercher</FilterLabel>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un etudiant..."
              value={filters.search}
              onChange={(e) => onChange("search", e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#0F2942]/15 focus:border-[#0F2942] transition-colors"
            />
          </div>
        </div>

        <div>
          <FilterLabel>Type de document</FilterLabel>
          <select className={selectCls} value={filters.type} onChange={(e) => onChange("type", e.target.value)}>
            <option value="">Tous les types</option>
            {Object.entries(DOC_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <FilterLabel>Statut</FilterLabel>
          <select className={selectCls} value={filters.status} onChange={(e) => onChange("status", e.target.value)}>
            <option value="">Tous les statuts</option>
            {Object.entries(DOC_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <FilterLabel>Classe / Filière</FilterLabel>
          <select className={selectCls} value={filters.classe} onChange={(e) => onChange("classe", e.target.value)}>
            <option value="">Toutes les classes</option>
            <option>L2 Informatique</option>
            <option>L2 Gestion</option>
            <option>L2 Génie Logiciel</option>
            <option>L2 Réseaux & Télécoms</option>
            <option>L2 Génie Civil</option>
          </select>
        </div>

        <div>
          <FilterLabel>Période d'envoi</FilterLabel>
          <div className="relative">
            <input
              type="text"
              readOnly
              placeholder="Sélectionner une periode"
              value={filters.period}
              className="w-full pl-3 pr-9 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-400 outline-none cursor-pointer"
            />
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-[#0F2942] bg-white border border-slate-200 rounded-lg hover:bg-[#F7FAFC] transition-colors whitespace-nowrap"
        >
          <RotateCcw size={14} /> Réinitialiser
        </button>
      </div>
    </div>
  );
}