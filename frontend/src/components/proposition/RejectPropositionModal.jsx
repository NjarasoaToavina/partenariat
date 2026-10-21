import { useEffect, useState } from "react";
import Spinner from "../common/Spinner";

export default function RejectPropositionModal({
  open,
  isLoading = false,
  proposition = null,
  onConfirm,
  onCancel,
}) {
  const [commentaire, setCommentaire] = useState("");

  // Réinitialiser le commentaire à chaque ouverture
  useEffect(() => {
    if (open) {
      setCommentaire("");
    }
  }, [open, proposition]);

  // Bloquer le scroll et gérer la touche Échap
  useEffect(() => {
    if (!open) return;

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

    if (!commentaire.trim() || isLoading) return;

    onConfirm?.(commentaire.trim());
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 px-4"
      onClick={() => !isLoading && onCancel?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-proposition-title"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titre */}
        <h2
          id="reject-proposition-title"
          className="text-lg font-bold text-slate-900 mb-2"
        >
          Refuser une proposition
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          Vous êtes sur le point de refuser la proposition de partenariat
          {proposition?.titre && (
            <>
              {" "}
              <span className="font-semibold text-slate-700">
                « {proposition.titre} »
              </span>
            </>
          )}
          . Veuillez indiquer le motif du refus.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Commentaire */}
          <div className="mb-6">
            <label
              htmlFor="commentaire_refus"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Motif du refus <span className="text-red-500">*</span>
            </label>

            <textarea
              id="commentaire_refus"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ex : Cette proposition ne correspond pas aux objectifs actuels de l'établissement..."
              rows={4}
              maxLength={1000}
              disabled={isLoading}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0065CD] focus:ring-2 focus:ring-blue-100 transition-colors resize-none"
            />

            <p className="text-xs text-slate-400 mt-2">
              Expliquez brièvement la raison du refus.
            </p>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-3">
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
              disabled={!commentaire.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <Spinner size={16} className="text-white" />
              )}

              Confirmer le refus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}