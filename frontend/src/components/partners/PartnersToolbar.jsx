import { Search, ChevronDown, Plus } from "lucide-react";

export default function PartnersToolbar({
  search,
  onSearchChange,
  campusFilter,
  onCampusFilterChange,
  statusFilter,
  onStatusFilterChange,
  onAddPartner,
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
      <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un partenaire"
          className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={campusFilter}
            onChange={(e) => onCampusFilterChange(e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl bg-white pl-4 pr-9 py-2.5 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="Tous">Campus : Tous</option>
            <option value="ESMIA">Campus : ESMIA</option>
            <option value="BEATI">Campus : BEATI</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="appearance-none border border-slate-200 rounded-xl bg-white pl-4 pr-9 py-2.5 text-sm font-semibold text-slate-700 outline-none cursor-pointer"
          >
            <option value="Tous">Statut : Tous</option>
            <option value="Signé">Statut : Signé</option>
            <option value="Renouvelé">Statut : Renouvelé</option>
            <option value="En cours">Statut : En cours</option>
            <option value="Officieux">Statut : Officieux</option>
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <button
          onClick={onAddPartner}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          <Plus size={18} />
          Ajouter un partenaire
        </button>
      </div>
    </div>
  );
}