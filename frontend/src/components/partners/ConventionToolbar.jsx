
import { Search, ChevronDown, Plus } from "lucide-react";
export default function ConventionToolbar({
  search,
  onSearchChange,
  onAddConvention,
}) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 bg-white">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher une convention"
                className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onAddConvention}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                Ajouter une convention
              </button>
            </div>
        </div>
    )
}