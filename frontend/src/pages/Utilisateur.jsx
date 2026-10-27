import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCircle,
} from "lucide-react";

import { getAllUsers, deleteUser } from "../services/userService";
import { useToast } from "../context/ToastContext";
import { URL } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/common/Pagination";
import Loader from "../components/common/Loader";
import ConfirmModal from "../components/common/ConfirmModal";

export default function Utilisateur() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen,setConfirmOpen] = useState(false);
  const [selectedUser,setSelectedUser] = useState({});
  const [isLoading,setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("tous");
  const [page, setPage] = useState(1);

  const perPage = 8;

  const backendUrl = URL.replace(/\/api\/?$/, "");

  const getPhotoUrl = (image) => {
    if (!image) return null;

    return image.startsWith("http")
      ? image
      : `${backendUrl}/storage/${image}`;
  };

  const getRole = (user) => {
    return user.roles?.[0]?.name || "Non défini";
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getAllUsers();

      setUsers(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async () => {
    if (!selectedUser) return;

    if (selectedUser.id === currentUser?.id) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    setIsLoading(true);

    try {
      await deleteUser(selectedUser.id);

      setUsers((prev) =>
        prev.filter((u) => u.id !== selectedUser.id)
      );

      toast.success("Utilisateur supprimé avec succès.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Erreur lors de la suppression."
      );
    } finally {
      setSelectedUser(null);
      setIsLoading(false);
      setConfirmOpen(false);
    }
  };

  // Recherche et filtre
  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.nie?.toLowerCase().includes(query);

    const matchesRole =
      roleFilter === "tous" ||
      getRole(user) === roleFilter;

    return matchesSearch && matchesRole;
  });

    // Pagination
    const total = filteredUsers.length;

    const totalPages = Math.max(
    1,
    Math.ceil(total / perPage)
    );

    const currentPage = Math.min(page, totalPages);

    const rangeStart = total === 0
    ? 0
    : (currentPage - 1) * perPage + 1;

    const rangeEnd = Math.min(
    currentPage * perPage,
    total
    );

    const paginatedUsers = filteredUsers.slice(
    rangeStart === 0 ? 0 : rangeStart - 1,
    rangeEnd
    );

  return (
    <div className="p-4 md:p-8 space-y-6">

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-bold text-[#063C58]">
            Gestion des utilisateurs
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Consultez et gérez les comptes de la plateforme.
          </p>
        </div>

        <button
          onClick={() => navigate("/utilisateurs/ajouter")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0065CD] text-white font-semibold hover:bg-[#0055AE] transition-colors"
        >
          <Plus size={18} />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

        <div className="flex flex-col md:flex-row gap-4">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Rechercher par nom, email ou NIE..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#0065CD]"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-[#0065CD]"
          >
            <option value="tous">Tous les rôles</option>
            <option value="responsable">Responsable</option>
            <option value="service">Service</option>
            <option value="partenaire">Partenaire</option>
            <option value="etudiant">Étudiant</option>
          </select>

        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Users size={20} className="text-[#0065CD]" />

          <h2 className="font-semibold text-[#063C58]">
            Utilisateurs ({filteredUsers.length})
          </h2>
        </div>

        {loading ? (
          <Loader fullScreen={false} label="Chargement des utilisateurs..." />
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left">

              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {paginatedUsers.map((user) => {
                  const photoUrl = getPhotoUrl(user.image);

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-[#063C58] text-white flex items-center justify-center overflow-hidden shrink-0">

                            {photoUrl ? (
                              <img
                                src={photoUrl}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCircle size={23} />
                            )}

                          </div>

                          <span className="font-medium text-slate-800">
                            {user.name}
                          </span>

                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold capitalize">
                          {getRole(user)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            title="Voir les détails"
                            onClick={() =>
                              navigate(`/utilisateurs/${user.id}`)
                            }
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            title="Modifier"
                            onClick={() => navigate(`/utilisateurs/modifier/${user.id}`)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            title="Supprimer"
                            disabled={
                              deletingId === user.id ||
                              user.id === currentUser?.id
                            }
                            onClick={() => {setSelectedUser(user);setConfirmOpen(true)}}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>

          </div>
        )}

        {/* Pagination */}
        {!loading && total > perPage && (
        <Pagination
            total={total}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            label="utilisateurs"
        />
)}

      </div>
        <ConfirmModal
            open={confirmOpen}
            variant="danger"
            title="Supprimer un utilisateur?"
            message={"Vous allez supprimer l'utilisateur ?"}
            confirmLabel="Confirmer"
            cancelLabel="Annuler"
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
            isLoading={isLoading}
        />
    </div>
  );
}