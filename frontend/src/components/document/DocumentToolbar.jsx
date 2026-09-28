import { ChevronDown, Search } from "lucide-react";

export default function DocumentToolbar({
  period,
  onPeriodChange,
  filiereFilter,
  onFiliereFilterChange,
  niveauFilter,
  onNiveauFilterChange,
  statutFilter,
  onStatutFilterChange,
  search,
  onSearchChange,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end gap-3">
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Période
        </label>
        <div>
          <input
            type="date"
            value={period}
            onChange={(e) => onPeriodChange("period",e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm text-slate-700 outline-none w-[150px]"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Filière
        </label>
        <div>
          <input
            type="text"
            value={filiereFilter}
            onChange={(e) => onPeriodChange("filiere",e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm text-slate-700 outline-none w-[150px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Niveau
        </label>
        <div className="relative">
          <select
            value={niveauFilter}
            onChange={(e) => onFiliereFilterChange("niveau",e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-700 outline-none cursor-pointer w-44"
          >
            <option value="Tous">Tous les niveaux</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Statut
        </label>
        <div className="relative">
          <select
            value={statutFilter}
            onChange={(e) => onStatutFilterChange("statut",e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-700 outline-none cursor-pointer w-44"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="collecte">Collecté</option>
            <option value="correction">En correction</option>
            <option value="vivier">En vivier</option>
            <option value="envoye">Envoyé</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <div className="lg:ml-auto lg:w-64">
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange("search",e.target.value)}
            placeholder="Rechercher un étudiant"
            className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <Search size={16} className="text-slate-400 shrink-0" />
        </div>
        
      </div>
    </div>
  );
}