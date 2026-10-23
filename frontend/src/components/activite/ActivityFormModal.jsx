import { useEffect, useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import { ETATS } from "../../data/activiteData";
import { dayKey, toInputValue, toIso } from "./activiteUtils";

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#0065CD] focus:outline-none focus:ring-2 focus:ring-[#0065CD]/20";

export default function ActivityFormModal({
  activite,
  defaultDate,
  saving,
  onSave,
  onDelete,
  onClose,
}) {
  const isEdit = Boolean(activite);

  const [form, setForm] = useState(() =>
    activite
      ? {
          sujet: activite.sujet ?? "",
          date_debut_activ: toInputValue(activite.date_debut_activ),
          date_fin_activ: toInputValue(activite.date_fin_activ),
          etat_activ: activite.etat_activ ?? "planifie",
        }
      : {
          sujet: "",
          date_debut_activ: `${dayKey(defaultDate)}T09:00`,
          date_fin_activ: `${dayKey(defaultDate)}T10:00`,
          etat_activ: "planifie",
        }
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.sujet.trim()) errs.sujet = "Le sujet est obligatoire.";
    if (!form.date_debut_activ)
      errs.date_debut_activ = "La date de début est obligatoire.";
    if (!form.date_fin_activ)
      errs.date_fin_activ = "La date de fin est obligatoire.";
    if (
      form.date_debut_activ &&
      form.date_fin_activ &&
      form.date_fin_activ < form.date_debut_activ
    ) {
      errs.date_fin_activ = "La fin doit être après le début.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    onSave({
      sujet: form.sujet.trim(),
      date_debut_activ: toIso(form.date_debut_activ),
      date_fin_activ: toIso(form.date_fin_activ),
      etat_activ: form.etat_activ,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Modifier l'activité" : "Nouvelle activité"}
        className="w-full max-w-lg rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? "Modifier l'activité" : "Nouvelle activité"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Sujet
            </label>
            <input
              type="text"
              value={form.sujet}
              onChange={set("sujet")}
              placeholder="Ex. Réunion trimestrielle avec les partenaires"
              className={inputCls}
              autoFocus
            />
            {errors.sujet && (
              <p className="mt-1 text-xs text-red-600">{errors.sujet}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Début
              </label>
              <input
                type="datetime-local"
                value={form.date_debut_activ}
                onChange={set("date_debut_activ")}
                className={inputCls}
              />
              {errors.date_debut_activ && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.date_debut_activ}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Fin
              </label>
              <input
                type="datetime-local"
                value={form.date_fin_activ}
                min={form.date_debut_activ || undefined}
                onChange={set("date_fin_activ")}
                className={inputCls}
              />
              {errors.date_fin_activ && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.date_fin_activ}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              État
            </label>
            <select
              value={form.etat_activ}
              onChange={set("etat_activ")}
              className={inputCls}
            >
              {Object.entries(ETATS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-5 py-3">
          {isEdit ? (
            <button
              type="button"
              onClick={() => onDelete(activite)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0065CD] px-4 py-2 text-sm font-medium text-white hover:bg-[#0054A8] disabled:opacity-60"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}