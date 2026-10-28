import { useEffect, useMemo, useState } from "react";
import {
  History,
  Search,
  RefreshCw,
  Filter,
  CalendarDays,
} from "lucide-react";

import { getHistoriques } from "../services/historiqueService";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";

const ITEMS_PER_PAGE = 10;

// Libellés des actions
const ACTION_LABELS = {
  creation: "Création",
  modification: "Modification",
  suppression: "Suppression",
  validation: "Validation",
  refus: "Refus",
  correction: "Correction",
  demande_correction: "Demande de correction",
  attente_validation: "Attente de validation",
  realisation: "Réalisation",
  planification: "Planification",
  inscription: "Inscription",
  connexion: "Connexion",
  deconnexion: "Déconnexion",
};

// Couleurs des actions
const ACTION_COLORS = {
  creation: "bg-green-100 text-green-700",
  modification: "bg-blue-100 text-blue-700",
  suppression: "bg-red-100 text-red-700",
  validation: "bg-emerald-100 text-emerald-700",
  refus: "bg-red-100 text-red-700",
  correction: "bg-orange-100 text-orange-700",
  demande_correction: "bg-orange-100 text-orange-700",
  attente_validation: "bg-yellow-100 text-yellow-700",
  realisation: "bg-green-100 text-green-700",
  planification: "bg-purple-100 text-purple-700",
  inscription: "bg-cyan-100 text-cyan-700",
  connexion: "bg-sky-100 text-sky-700",
  deconnexion: "bg-gray-100 text-gray-700",
};

const MODULE_LABELS = {
  utilisateurs: "Utilisateurs",
  profil: "Profil",
  authentification: "Authentification",
  partenariats: "Partenariats",
  propositions: "Propositions",
  documents: "Documents",
  conventions: "Conventions",
  publications: "Publications",
  commentaires: "Commentaires",
  activites: "Activités",
  ateliers: "Ateliers",
};

export default function Historique() {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Charger les historiques
  const fetchHistoriques = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getHistoriques();
      setHistoriques(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des historiques :", err);
      setError("Impossible de charger les historiques.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistoriques();
  }, []);

  // Liste des modules disponibles
  const modules = useMemo(() => {
    return [...new Set(historiques.map((h) => h.module))]
      .filter(Boolean)
      .sort();
  }, [historiques]);

  // Liste des actions disponibles
  const actions = useMemo(() => {
    return [...new Set(historiques.map((h) => h.action))]
      .filter(Boolean)
      .sort();
  }, [historiques]);

  // Filtrage des historiques
  const filteredHistoriques = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return historiques.filter((historique) => {
      const username = historique.user?.name ?? "";
      const description = historique.description ?? "";

      const matchesSearch =
        !keyword ||
        username.toLowerCase().includes(keyword) ||
        description.toLowerCase().includes(keyword);

      const matchesModule =
        !moduleFilter || historique.module === moduleFilter;

      const matchesAction =
        !actionFilter || historique.action === actionFilter;

      return matchesSearch && matchesModule && matchesAction;
    });
  }, [historiques, search, moduleFilter, actionFilter]);

  // Pagination
  const total = filteredHistoriques.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const rangeStart =
    total === 0
      ? 0
      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;

  const rangeEnd = Math.min(
    safeCurrentPage * ITEMS_PER_PAGE,
    total
  );

  const paginatedHistoriques = filteredHistoriques.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // Réinitialiser la pagination lorsqu'un filtre change
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleModuleChange = (value) => {
    setModuleFilter(value);
    setCurrentPage(1);
  };

  const handleActionChange = (value) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  // Formater la date
  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 p-6">

      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold text-[#063C58]">
            <History size={27} />
            Historique des actions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Consultez les actions effectuées dans l'application.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchHistoriques(true)}
          disabled={loading || refreshing}
          className="flex items-center gap-2 rounded-lg bg-[#0065CD] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0054ad] disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "animate-spin" : ""}
          />
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Recherche */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Rechercher une action..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0065CD]"
            />
          </div>

          {/* Filtre module */}
          <div className="relative">
            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={moduleFilter}
              onChange={(e) => handleModuleChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#0065CD]"
            >
              <option value="">Tous les modules</option>

              {modules.map((module) => (
                <option key={module} value={module}>
                  {MODULE_LABELS[module] ?? module}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre action */}
          <div>
            <select
              value={actionFilter}
              onChange={(e) => handleActionChange(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0065CD]"
            >
              <option value="">Toutes les actions</option>

              {actions.map((action) => (
                <option key={action} value={action}>
                  {ACTION_LABELS[action] ?? action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader fullScreen={false} label="Chargement des historiques..." />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">

                <thead className="bg-[#063C58] text-white">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Utilisateur
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Action
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Module
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Description
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedHistoriques.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-16 text-center text-gray-500"
                      >
                        Aucun historique trouvé.
                      </td>
                    </tr>
                  ) : (
                    paginatedHistoriques.map((historique) => (
                      <tr
                        key={historique.id_hist}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Utilisateur */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-[#0065CD]">
                              {historique.user?.name
                                ?.charAt(0)
                                .toUpperCase() ?? "?"}
                            </div>

                            <span className="font-medium text-gray-800">
                              {historique.user?.name ??
                                "Utilisateur supprimé"}
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              ACTION_COLORS[historique.action] ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {ACTION_LABELS[historique.action] ??
                              historique.action}
                          </span>
                        </td>

                        {/* Module */}
                        <td className="px-5 py-4 text-gray-700">
                          {MODULE_LABELS[historique.module] ??
                            historique.module}
                        </td>

                        {/* Description */}
                        <td className="max-w-[350px] px-5 py-4 text-gray-600">
                          {historique.description}
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={15} />

                            {formatDate(historique.created_at)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="border-t border-gray-100 px-5 py-4">
                <Pagination
                  total={total}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  label="historiques"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}