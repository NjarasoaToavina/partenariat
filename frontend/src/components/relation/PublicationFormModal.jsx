import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  ACCEPTED_PHOTO_TYPES,
  MAX_PHOTO_SIZE_MB,
  MAX_TITRE,
} from "../../data/relationData";
import { storageUrl } from "./relationUtils";

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#0065CD] focus:outline-none focus:ring-2 focus:ring-[#0065CD]/20";

export default function PublicationFormModal({
  publication, // null = création
  saving,
  onSave,
  onClose,
}) {
  const isEdit = Boolean(publication);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    titre_pub: publication?.titre_pub ?? "",
    contenu_pub: publication?.contenu_pub ?? "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Aperçu de la nouvelle photo (libéré au démontage / changement)
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const pickFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!ACCEPTED_PHOTO_TYPES.includes(picked.type)) {
      setErrors((er) => ({ ...er, photo: "Formats acceptés : JPG, PNG, WebP." }));
      return;
    }
    if (picked.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setErrors((er) => ({
        ...er,
        photo: `La photo ne doit pas dépasser ${MAX_PHOTO_SIZE_MB} Mo.`,
      }));
      return;
    }
    setErrors((er) => ({ ...er, photo: undefined }));
    setFile(picked);
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.titre_pub.trim()) errs.titre_pub = "Le titre est obligatoire.";
    if (!form.contenu_pub.trim()) errs.contenu_pub = "Le contenu est obligatoire.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    onSave({
      titre_pub: form.titre_pub.trim(),
      contenu_pub: form.contenu_pub.trim(),
      photo_pub: file, // null si inchangée
    });
  };

  const currentPhoto = preview || storageUrl(publication?.photo_pub);

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
        aria-label={isEdit ? "Modifier la publication" : "Nouvelle publication"}
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">
            {isEdit ? "Modifier la publication" : "Nouvelle publication"}
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

        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Titre
            </label>
            <input
              type="text"
              value={form.titre_pub}
              onChange={set("titre_pub")}
              maxLength={MAX_TITRE}
              placeholder="Ex. Opportunité de stage chez Society"
              className={inputCls}
              autoFocus
            />
            {errors.titre_pub && (
              <p className="mt-1 text-xs text-red-600">{errors.titre_pub}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Contenu
            </label>
            <textarea
              rows={5}
              value={form.contenu_pub}
              onChange={set("contenu_pub")}
              placeholder="Décrivez l'offre ou l'opportunité…"
              className={inputCls}
            />
            {errors.contenu_pub && (
              <p className="mt-1 text-xs text-red-600">{errors.contenu_pub}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Photo <span className="font-normal text-slate-400">(facultatif)</span>
            </label>
            {currentPhoto && (
              <img
                src={currentPhoto}
                alt="Aperçu"
                className="mb-2 max-h-48 w-full rounded-lg border border-slate-200 object-cover"
              />
            )}
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPTED_PHOTO_TYPES.join(",")}
              onChange={pickFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-[#0065CD] hover:text-[#0065CD]"
            >
              <ImagePlus size={16} />
              {currentPhoto ? "Changer la photo" : "Ajouter une photo"}
            </button>
            {errors.photo && (
              <p className="mt-1 text-xs text-red-600">{errors.photo}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
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
            {isEdit ? "Enregistrer" : "Publier"}
          </button>
        </div>
      </form>
    </div>
  );
}