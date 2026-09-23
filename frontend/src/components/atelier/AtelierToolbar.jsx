import { ChevronDown, Search } from "lucide-react";

export default function AtelierToolbar({
  periodStart,
  onPeriodStartChange,
  periodEnd,
  onPeriodEndChange,
  campusFilter,
  onCampusFilterChange,
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
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={periodStart}
            onChange={(e) => onPeriodStartChange(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm text-slate-700 outline-none w-[150px]"
          />
          <span className="text-slate-400 text-sm">au</span>
          <input
            type="date"
            value={periodEnd}
            onChange={(e) => onPeriodEndChange(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm text-slate-700 outline-none w-[150px]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          Campus
        </label>
        <div className="relative">
          <select
            value={campusFilter}
            onChange={(e) => onCampusFilterChange(e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-700 outline-none cursor-pointer w-44"
          >
            <option value="Tous">Tous les campus</option>
            <option value="ESMIA">ESMIA</option>
            <option value="BEATI">BEATI</option>
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
            onChange={(e) => onStatutFilterChange(e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-700 outline-none cursor-pointer w-44"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Réalisé">Réalisé</option>
            <option value="Planifié">Planifié</option>
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un atelier..."
            className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
          <Search size={16} className="text-slate-400 shrink-0" />
        </div>
        
      </div>
    </div>
  );
}