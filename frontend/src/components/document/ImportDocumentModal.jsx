import { useEffect, useState } from "react";
import Spinner from "../common/Spinner";

export default function ImportDocumentModal({
  open,
  isLoading = false,
  onConfirm,
  onCancel,
  documentToEdit =null
}) {
  const isEditing = !!documentToEdit ;
  const [typeDoc, setTypeDoc] = useState("");
  const [fichierDoc, setFichierDoc] = useState(null);

  // Réinitialiser les champs à chaque ouverture
  useEffect(() => {
    if (open) {
      setTypeDoc(documentToEdit ?.type_doc || "");
      setFichierDoc(null);
    }
  }, [open]);

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

    if (!typeDoc.trim() || (!isEditing && !fichierDoc) || isLoading) {
        return;
    }

    const formData = new FormData();

    formData.append("type_doc", typeDoc.trim());

    if (fichierDoc) {
        formData.append("fichier_doc", fichierDoc);
    }

    onConfirm?.(formData);
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
          {isEditing ? "Modifier un document" : "Importer un document"}
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
        {isEditing
            ? "Modifiez les informations du document. Vous pouvez conserver le fichier actuel ou le remplacer."
            : "Veuillez renseigner le type de document et joindre le fichier correspondant."}
        </p>

        <form onSubmit={handleSubmit}>

          {/* Type de document */}
        <div className="mb-4">
            <label
                htmlFor="type_doc"
                className="block text-sm font-semibold text-slate-700 mb-2"
            >
                Type de document <span className="text-red-500">*</span>
            </label>

            <input
                id="type_doc"
                type="text"
                value={typeDoc}
                onChange={(e) => setTypeDoc(e.target.value)}
                placeholder="Ex : CV, LM..."
                maxLength={100}
                disabled={isLoading}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-[#0065CD] focus:ring-2 focus:ring-blue-100 transition-colors"
            />
        </div>

          {/* Fichier */}
          <div className="mb-6">
            <label
              htmlFor="fichier_doc"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              Fichier <span className="text-red-500">*</span>
            </label>

            <input
              id="fichier_doc"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                setFichierDoc(e.target.files?.[0] || null)
              }
              disabled={isLoading}
              required={!isEditing}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 bg-white file:mr-3 file:border-0 file:bg-sky-50 file:text-sky-700 file:px-3 file:py-2 file:rounded-lg file:font-semibold file:cursor-pointer hover:file:bg-sky-100"
            />

             {isEditing ? (
                <p className="text-xs text-slate-500 mt-2">
                Laissez ce champ vide si vous souhaitez conserver le fichier actuel.
                </p>
            ) : (
                <p className="text-xs text-slate-400 mt-2">
                Formats acceptés : PDF, JPG, JPEG et PNG.
                </p>
            )}
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
            disabled={!typeDoc.trim() || (!isEditing && !fichierDoc) || isLoading}
            className="px-5 py-2.5 rounded-xl bg-[#0065CD] text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
            {isLoading && <Spinner size={16} className="text-white" />}

            {isEditing ? "Enregistrer" : "Importer"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}