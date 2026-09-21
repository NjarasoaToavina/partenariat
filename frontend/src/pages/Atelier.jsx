import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, Clock, ClipboardList, Plus } from "lucide-react";
import StatCard from "../components/atelier/StatCard";
import AtelierToolbar from "../components/atelier/AtelierToolbar";
import AtelierTable from "../components/atelier/AtelierTable";
import AtelierPagination from "../components/atelier/AtelierPagination";
import { getAtelierStats } from "../data/atelierData";

import { useToast } from "../context/ToastContext";
import { getAllAteliers } from "../services/atelierService";
import Loader from "../components/common/Loader";

import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 6;

function parseDate(str) {
  if (!str) return null;

  const date = new Date(str);

  return isNaN(date.getTime()) ? null : date;
}

export default function Atelier() {
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [campusFilter, setCampusFilter] = useState("Tous");
  const [statutFilter, setStatutFilter] = useState("Tous");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [ateliers, setAteliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const stats = useMemo(() => getAtelierStats(ateliers), [ateliers]);
  const navigate = useNavigate();
  
  
  const toast = useToast();

  useEffect(() => {
      const fetchAteliers = async () => {
        try {
          const response = await getAllAteliers();
          console.log("Données des ateliers récupérées :", response.data);
          setAteliers(response.data);
        } catch (error) {
          toast.error("Impossible de charger la liste des ateliers.");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchAteliers();
    }, [toast]);

  const filtered = useMemo(() => {
    let list = ateliers.filter((a) => {
      const atelierDate = parseDate(a.date_atel);
      const matchesPeriod =
        (!periodStart || atelierDate >= new Date(periodStart)) &&
        (!periodEnd || atelierDate <= new Date(periodEnd));
      const matchesCampus = campusFilter === "Tous" || a.campus_atel === campusFilter;
      const matchesStatut = statutFilter === "Tous" || a.statut_atel === statutFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.contenu_atel.toLowerCase().includes(q) ||
        a.groupe.toLowerCase().includes(q) ||
        a.intervenant.toLowerCase().includes(q);
      return matchesPeriod && matchesCampus && matchesStatut && matchesSearch;
    });

    list = [...list].sort((a, b) => {
      const diff = parseDate(a.date_atel) - parseDate(b.date_atel);
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [periodStart, periodEnd, campusFilter, statutFilter, search, sortAsc,ateliers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);

  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleAddAtelier = () => {
    // Brancher ici l'ouverture d'un formulaire / modale de création
    navigate("/ateliers/ajouter");
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
        {isLoading ? (
          <Loader fullScreen={false} label="Chargement des ateliers..." />
        ) : (      
          <>
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
          </>
        )}
      </div>
    </div>
  );
}