import { useEffect, useMemo, useState } from "react";
import PartnersToolbar from "../components/partners/PartnersToolbar";
import PartnersTable from "../components/partners/PartnersTable";
import Pagination from "../components/partners/Pagination";
import Loader from "../components/common/Loader";
import { getAllPartnerships } from "../services/partenariatService";
import { useToast } from "../context/ToastContext.jsx";

const PAGE_SIZE = 6;

export default function Partenaire() {
  const [search, setSearch] = useState("");
  const [campusFilter, setCampusFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  const [partenaires, setPartenaires] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        const response = await getAllPartnerships();
        console.log("Données des partenaires récupérées :", response.data);
        setPartenaires(response.data);
      } catch (error) {
        toast.error("Impossible de charger la liste des partenaires.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartenaires();
  }, [toast]);

  const campusOptions = useMemo(
    () => [...new Set(partenaires.map((p) => p.campus_part).filter(Boolean))].sort(),
    [partenaires]
  );
  const statusOptions = useMemo(
    () => [...new Set(partenaires.map((p) => p.statut_part).filter(Boolean))].sort(),
    [partenaires]
  );

  const filtered = useMemo(() => {
    return partenaires.filter((p) => {
      const matchesSearch = p.nom_part
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCampus =
        campusFilter === "Tous" || p.campus === campusFilter;
      const matchesStatus =
        statusFilter === "Tous" || p.statut_part === statusFilter;
      return matchesSearch && matchesCampus && matchesStatus;
    });
  }, [partenaires, search, campusFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    (page - 1) * PAGE_SIZE + PAGE_SIZE
  );

  const updateFilter = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
  };

  const handleAddPartner = () => {
    // Brancher ici l'ouverture d'un formulaire / modale de création
    console.log("Ajouter un partenaire");
  };

  const handleEdit = (partner) => {
    // Brancher ici l'ouverture d'un formulaire d'édition
    console.log("Modifier", partner);
  };

  return (
    <div className="space-y-4">
      <PartnersToolbar
        search={search}
        onSearchChange={updateFilter(setSearch)}
        campusFilter={campusFilter}
        onCampusFilterChange={updateFilter(setCampusFilter)}
        statusFilter={statusFilter}
        onStatusFilterChange={updateFilter(setStatusFilter)}
        onAddPartner={handleAddPartner}
        campusOptions={campusOptions}
        statusOptions={statusOptions}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        {isLoading ? (
          <Loader fullScreen={false} label="Chargement des partenaires..." />
        ) : (
          <>
            <PartnersTable partners={paginated} onEdit={handleEdit} />
            <Pagination
              total={filtered.length}
              shown={paginated.length}
              currentPage={page}
              totalPages={totalPages}
              onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}
      </div>
    </div>
  );
}