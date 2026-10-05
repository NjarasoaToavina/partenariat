import { useMemo, useState } from "react";
import { DOCUMENTS, computeDocKpis } from "../data/documentData";
import DocumentFilters from "../components/document/DocumentFilters";
import DocumentTable from "../components/document/DocumentTable";
import StatCard from "../components/atelier/StatCard";
import { CheckCircle2, Clock, ClipboardList, Plus } from "lucide-react";
import DocumentToolbar from "../components/document/DocumentToolbar";
import { useToast } from "../context/ToastContext";
import Pagination from "../components/common/Pagination";

const PAGE_SIZE = 6;

const EMPTY_FILTERS = { search: "", niveau: "Tous", statut: "Tous", filiere: "", period: "" };

const collecte = 7;
const correction = 10;
const vivier = 5;

const stats = {
  collecte,
  correction,
  vivier,
  total: collecte + correction + vivier
};

export default function Document() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const resetFilters = () => { setFilters(EMPTY_FILTERS); setPage(1); };

  const filtered = useMemo(() => {
    return DOCUMENTS.filter((d) => {
      if (filters.search && !d.nom_complet.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.type && d.type !== filters.type) return false;
      if (filters.niveau && filters.niveau!=="Tous" && d.niveau !== filters.niveau) return false;
      if (filters.statut && filters.statut!=="Tous" && d.statut !== filters.statut) return false;
      if (filters.filiere && d.filiere !== filters.filiere) return false;
      return true;
    });
  }, [filters]);

  const { total, counts, percent } = computeDocKpis(DOCUMENTS); // KPIs sur l'ensemble, pas juste la page filtrée

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  console.log("total pages "+ totalPages)
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toast = useToast();
  const handleAddDocument = () => {
    toast.success("Document ajouté avec succès");
  }

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
         <StatCard
           icon={CheckCircle2}
           iconBg="bg-emerald-50"
           iconColor="text-emerald-600"
           value={stats.collecte}
           label="Documents collectés"
         />
         <StatCard
           icon={Clock}
           iconBg="bg-sky-50"
           iconColor="text-sky-600"
           value={stats.vivier}
           label="Documents en vivier"
         />
         <StatCard
           icon={Clock}
           iconBg="bg-sky-50"
           iconColor="text-sky-600"
           value={stats.correction}
           label="Documents en correction"
         />
         <StatCard
           icon={ClipboardList}
           iconBg="bg-violet-50"
           iconColor="text-violet-600"
           value={stats.total}
           label="Total documents"
         />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-900">Liste des documents</h2>
            <button
              onClick={handleAddDocument}
              className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              Importer un document
            </button>
          </div>

        {/* <DocumentFilters filters={filters} onChange={setFilter} onReset={resetFilters} /> */}
        <DocumentToolbar
          period= {filters.period}
          onPeriodChange={setFilter}
          filiereFilter={filters.filiere}
          onFiliereFilterChange={setFilter}
          niveauFilter={filters.niveau}
          onNiveauFilterChange={setFilter}
          statutFilter={filters.statut}
          onStatutFilterChange={setFilter}
          search={filters.search}
          onSearchChange={setFilter}
          />

      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <DocumentTable
          documents={pageItems}
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          onImport={() => {/* à brancher sur ton flux d'import */}}
          onView={(doc) => {/* à brancher */}}
          onDownload={(doc) => {/* à brancher */}}
          onMore={(doc) => {/* à brancher, ex. menu contextuel */}}
        />
        <Pagination
          total={filtered.length}
          rangeStart={filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
          rangeEnd={Math.min(page * PAGE_SIZE, filtered.length)}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          label = "documents"
        />
      </div>

    </div>
  );
}