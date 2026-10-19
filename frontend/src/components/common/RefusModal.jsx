import { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function RefusModal({
  open,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  const [remarque, setRemarque] = useState("");

  useEffect(() => {
    if (open) {
        setRemarque("");
    }
    }, [open]);

  useEffect(() => {
    if (!open) return;

    setRemarque("");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!remarque.trim() || isLoading) return;

    onConfirm?.(remarque.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4"
      onClick={() => !isLoading && onCancel?.()}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre */}
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Motif du refus
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          Veuillez préciser la raison du refus afin de permettre
          à l'étudiant d'apporter les corrections nécessaires.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Remarque */}
          <textarea
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
            placeholder="Saisissez votre remarque ici..."
            rows={4}
            maxLength={1000}
            disabled={isLoading}
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#0065CD] focus:ring-2 focus:ring-blue-100 resize-none transition-colors"
          />

          {/* Boutons */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={!remarque.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Spinner size={16} className="text-white" />}
              Confirmer le refus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}