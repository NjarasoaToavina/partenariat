import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "../context/ToastContext.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";
import ActivityCalendar from "../components/activite/ActivityCalendar.jsx";
import ActivityList from "../components/activite/ActivityList.jsx";
import ActivityFormModal from "../components/activite/ActivityFormModal.jsx";
import {
  createActivite,
  deleteActivite,
  getActivites,
  updateActivite,
} from "../services/activiteService";
import { filterByMonth, groupByDay } from "../components/activite/activiteUtils";

export default function Activity() {
  const toast = useToast();

  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [modal, setModal] = useState(null); // { activite, date } | null
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);

    try {
      const response = await getActivites();

      // Garder uniquement les activités planifiées et réalisées
      const activitesFiltrees = response.data.filter(
        (activite) =>
          ["planifie", "realise"].includes(activite.etat_activ)
      );

      setActivites(activitesFiltrees);

    } catch (err) {
      console.error("Erreur chargement activités :", err);
      setError("Impossible de charger les activités.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const byDay = useMemo(() => groupByDay(activites), [activites]);
  const monthList = useMemo(
    () => filterByMonth(activites, year, month),
    [activites, year, month]
  );

  const changeMonth = (delta) => setCursor(new Date(year, month + delta, 1));
  const goToday = () => {
    const now = new Date();
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const openCreate = (date = new Date()) => setModal({ activite: null, date });
  const openEdit = (activite) => setModal({ activite, date: new Date() });
  const closeModal = useCallback(() => setModal(null), []);

  const handleSave = async (values) => {
    const editing = modal?.activite;
    setSaving(true);
    try {
      if (editing) {
        await updateActivite(editing.id_activ, values);
        toast.success("Activité modifiée.");
      } else {
        await createActivite(values);
        toast.success("Activité ajoutée.");
      }
      setModal(null);
      await load(false);
    } catch (err) {
      console.error("Erreur enregistrement activité :", err);
      toast.error(
        err?.response?.data?.message ||
          "Erreur lors de l'enregistrement. Veuillez réessayer."
      );
    } finally {
      setSaving(false);
    }
  };

  const askDelete = (activite) => {
    setModal(null);
    setToDelete(activite);
  };

  const handleDeleteConfirmed = async () => {
    const target = toDelete;
    if (!target) return;
    try {
      await deleteActivite(target.id_activ);
      setActivites((prev) => prev.filter((a) => a.id_activ !== target.id_activ));
      toast.success("Activité supprimée.");
    } catch (err) {
      console.error("Erreur suppression activité :", err);
      toast.error("Erreur lors de la suppression. Veuillez réessayer.");
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Activités</h1>
          <p className="text-sm text-slate-500">
            Organisez et suivez les activités du partenariat.
          </p>
        </div>
        <button
          onClick={() => openCreate()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0065CD] px-4 py-2 text-sm font-medium text-white hover:bg-[#0054A8]"
        >
          <Plus size={18} />
          Nouvelle activité
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            onClick={() => load()}
            className="font-medium underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      <ActivityCalendar
        cursor={cursor}
        byDay={byDay}
        loading={loading}
        onMonthChange={changeMonth}
        onToday={goToday}
        onCreate={openCreate}
        onEdit={openEdit}
      />

      <ActivityList
        items={monthList}
        loading={loading}
        onEdit={openEdit}
        onDelete={setToDelete}
      />

      {modal && (
        <ActivityFormModal
          key={modal.activite?.id_activ ?? "new"}
          activite={modal.activite}
          defaultDate={modal.date}
          saving={saving}
          onSave={handleSave}
          onDelete={askDelete}
          onClose={closeModal}
        />
      )}

      <ConfirmModal
        open={Boolean(toDelete)}
        variant="danger"
        title="Supprimer cette activité ?"
        message={
          toDelete
            ? `« ${toDelete.sujet} » sera définitivement supprimée.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}