import { useMemo, useState } from "react";
import { CheckCircle2, Clock, ClipboardList, Plus } from "lucide-react";
import StatCard from "../components/atelier/StatCard";
import AtelierToolbar from "../components/atelier/AtelierToolbar";
import AtelierTable from "../components/atelier/AtelierTable";
import AtelierPagination from "../components/atelier/AtelierPagination";
import { ATELIERS, getAtelierStats } from "../data/atelierData";

const PAGE_SIZE = 6;

function parseDate(str) {
  const [d, m, y] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
}

export default function Atelier() {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [campusFilter, setCampusFilter] = useState("Tous");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => getAtelierStats(ATELIERS), []);

  const filtered = useMemo(() => {
    let list = ATELIERS.filter((a) => {
      const atelierDate = parseDate(a.date);
      const matchesPeriod =
        (!periodStart || atelierDate >= new Date(periodStart)) &&
        (!periodEnd || atelierDate <= new Date(periodEnd));
      const matchesCampus = campusFilter === "Tous" || a.campus === campusFilter;
      const matchesStatut = statutFilter === "Tous" || a.statut === statutFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.contenu.toLowerCase().includes(q) ||
        a.filiere.toLowerCase().includes(q) ||
        a.intervenant.toLowerCase().includes(q);
      return matchesPeriod && matchesCampus && matchesStatut && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      const diff = parseDate(a.date) - parseDate(b.date);
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [periodStart, periodEnd, campusFilter, statutFilter, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);

  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleAddAtelier = () => {
    // Brancher ici l'ouverture d'un formulaire / modale de création
    console.log("Ajouter un atelier");
  };

  return (
    <div className="space-y-6">
      {/* Statistiques : uniquement Réalisé, Planifié, Total */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          value={stats.realise}
          label="Ateliers réalisés"
        />
        <StatCard
          icon={Clock}
          iconBg="bg-sky-50"
          iconColor="text-sky-600"
          value={stats.planifie}
          label="Ateliers planifiés"
        />
        <StatCard
          icon={ClipboardList}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          value={stats.total}
          label="Total ateliers"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">Liste des ateliers</h2>
          <button
            onClick={handleAddAtelier}
            className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
          >
            <Plus size={18} />
            Ajouter un atelier
          </button>
        </div>

        <AtelierToolbar
          periodStart={periodStart}
          onPeriodStartChange={updateFilter(setPeriodStart)}
          periodEnd={periodEnd}
          onPeriodEndChange={updateFilter(setPeriodEnd)}
          campusFilter={campusFilter}
          onCampusFilterChange={updateFilter(setCampusFilter)}
          statutFilter={statutFilter}
          onStatutFilterChange={updateFilter(setStatutFilter)}
          search={search}
          onSearchChange={updateFilter(setSearch)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <AtelierTable
          ateliers={paginated}
          sortAsc={sortAsc}
          onToggleSort={() => setSortAsc((v) => !v)}
          onView={(a) => console.log("Voir", a)}
          onMore={(a) => console.log("Actions", a)}
        />
        <AtelierPagination
          total={filtered.length}
          rangeStart={filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}
          rangeEnd={Math.min(page * PAGE_SIZE, filtered.length)}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}