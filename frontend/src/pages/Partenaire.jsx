import { useMemo, useState } from "react";
import PartnersToolbar from "../components/partners/PartnersToolbar";
import PartnersTable from "../components/partners/PartnersTable";
import Pagination from "../components/partners/Pagination";
import { PARTNERS } from "../data/partnersData";

const PAGE_SIZE = 6;

export default function Partenaire() {
  const [search, setSearch] = useState("");
  const [campusFilter, setCampusFilter] = useState("Tous");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return PARTNERS.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCampus =
        campusFilter === "Tous" || p.campus === campusFilter;
      const matchesStatus =
        statusFilter === "Tous" || p.status === statusFilter;
      return matchesSearch && matchesCampus && matchesStatus;
    });
  }, [search, campusFilter, statusFilter]);

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
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <PartnersTable partners={paginated} onEdit={handleEdit} />
        <Pagination
          total={filtered.length}
          shown={paginated.length}
          currentPage={page}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
}