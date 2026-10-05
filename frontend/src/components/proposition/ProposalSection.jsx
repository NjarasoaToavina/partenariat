import { useMemo, useState } from "react";
import FilterTabs from "./FilterTabs";
import ProposalSearchBar from "./ProposalSearchBar";
import ProposalCard from "./ProposalCard";
import Pagination from "../common/Pagination";

export default function ProposalSection({
  icon: Icon,
  title,
  items,
  pageSize = 3,
  itemLabel = "propositions",
  onValidate,
  onReject,
  onOpenFilters,
}) {
  const [tab, setTab] = useState("toutes");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c = { attente: 0, validee: 0, refusee: 0 };
    items.forEach((it) => { c[it.statut] = (c[it.statut] ?? 0) + 1; });
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (tab !== "toutes" && it.statut !== tab) return false;
      if (q && !it.titre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  const tabs = [
    { key: "toutes", label: "Toutes", count: items.length, dotClass: "bg-slate-500" },
    { key: "attente", label: "En attente", count: counts.attente, dotClass: "bg-amber-500" },
    { key: "validee", label: "Validées", count: counts.validee, dotClass: "bg-emerald-500" },
    { key: "refusee", label: "Refusées", count: counts.refusee, dotClass: "bg-rose-500" },
  ];

  const handleTabChange = (key) => { setTab(key); setPage(1); };
  const handleSearchChange = (v) => { setSearch(v); setPage(1); };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-blue-600" />
        <h2 className="text-base font-bold text-[#0F2942]">{title}</h2>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <FilterTabs tabs={tabs} active={tab} onChange={handleTabChange} />
        <ProposalSearchBar search={search} onSearchChange={handleSearchChange} onOpenFilters={onOpenFilters} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pageItems.map((it) => (
          <ProposalCard
            key={it.id}
            icon={it.icon}
            iconBg={it.iconBg}
            title={it.titre}
            orgLabel={it.source}
            statut={it.statut}
            date={it.date}
            heure={it.heure}
            description={it.description}
            proposeLe={it.proposeLe}
            onValidate={() => onValidate?.(it)}
            onReject={() => onReject?.(it)}
          />
        ))}
        {pageItems.length === 0 && (
          <p className="col-span-full text-center text-sm text-slate-400 py-8">
            Aucune proposition ne correspond à ces filtres.
          </p>
        )}
      </div>

      <Pagination
        total={filtered.length}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        itemLabel={itemLabel}
      />
    </div>
  );
}