import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

export default function ProposalSearchBar({ search, onSearchChange, onOpenFilters }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher une proposition..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#0F2942]/15 focus:border-[#0F2942] transition-colors"
        />
      </div>
      <button
        type="button"
        onClick={onOpenFilters}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
      >
        <SlidersHorizontal size={15} /> Filtrer <ChevronDown size={14} />
      </button>
    </div>
  );
}