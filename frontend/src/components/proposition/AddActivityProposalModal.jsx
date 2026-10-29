import { useEffect, useState } from "react";
import { X, CalendarDays } from "lucide-react";
import Spinner from "../common/Spinner";

export default function AddActivityProposalModal({
  open,
  onCancel,
  onConfirm,
  isLoading = false,
}) {
  const [form, setForm] = useState({
    sujet: "",
    date_debut_activ: "",
    date_fin_activ: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        sujet: "",
        date_debut_activ: "",
        date_fin_activ: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (
      new Date(form.date_fin_activ) <
      new Date(form.date_debut_activ)
    ) {
      return;
    }

    onConfirm(form);
  };

  const invalidDates =
    form.date_debut_activ &&
    form.date_fin_activ &&
    new Date(form.date_fin_activ) <
      new Date(form.date_debut_activ);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <CalendarDays size={20} className="text-[#0065CD]" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Proposer une activité
              </h2>
              <p className="text-xs text-slate-500">
                Soumettre une proposition d'activité
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">

          {/* Sujet */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sujet de l'activité <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="sujet"
              value={form.sujet}
              onChange={handleChange}
              placeholder="Ex : Atelier de formation en cybersécurité"
              required
              maxLength={255}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0065CD] focus:ring-1 focus:ring-[#0065CD]"
            />
          </div>

          {/* Date de début */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date et heure de début <span className="text-red-500">*</span>
            </label>

            <input
              type="datetime-local"
              name="date_debut_activ"
              value={form.date_debut_activ}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0065CD] focus:ring-1 focus:ring-[#0065CD]"
            />
          </div>

          {/* Date de fin */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date et heure de fin <span className="text-red-500">*</span>
            </label>

            <input
              type="datetime-local"
              name="date_fin_activ"
              value={form.date_fin_activ}
              onChange={handleChange}
              min={form.date_debut_activ || undefined}
              required
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#0065CD] focus:ring-1 focus:ring-[#0065CD]"
            />

            {invalidDates && (
              <p className="mt-1 text-xs text-red-500">
                La date de fin doit être postérieure ou égale à la date de début.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading || Boolean(invalidDates)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0065CD] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0054A8] disabled:opacity-50"
            >
              {isLoading && <Spinner size={16} className="text-white" />}
              {isLoading ? "Envoi..." : "Soumettre"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}