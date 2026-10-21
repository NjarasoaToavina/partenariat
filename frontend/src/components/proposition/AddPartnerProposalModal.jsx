import { useEffect, useState } from "react";
import { X, Building2, MapPin, Phone, Plus } from "lucide-react";

const initialForm = {
  part_propos: "",
  campus_propos: "",
  contact_propos: "",
};

export default function AddPartnerProposalModal({
  open,
  onCancel,
  onConfirm,
  isLoading = false,
  propToEdit=null
}) {
  const isEditing = !!propToEdit;
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    if (propToEdit) {
      // Préremplir le formulaire pour la modification
      setForm({
        part_propos: propToEdit.titre ?? "",
        campus_propos: propToEdit.campus ?? "",
        contact_propos: propToEdit.contact ?? "",
      });
    } else {
      // Formulaire vide pour l'ajout
      setForm({ ...initialForm });
    }

    setErrors({});
  }, [open, propToEdit]);

  // Bloquer le défilement et gérer Échap
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const newErrors = {};

    if (!form.part_propos.trim()) {
      newErrors.part_propos = "Le nom du partenaire est obligatoire.";
    }

    if (!form.campus_propos) {
      newErrors.campus_propos = "Veuillez sélectionner un campus.";
    }

    if (!form.contact_propos.trim()) {
      newErrors.contact_propos = "Le contact est obligatoire.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onConfirm({
      part_propos: form.part_propos.trim(),
      campus_propos: form.campus_propos,
      contact_propos: form.contact_propos.trim()
    });
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#0065CD] focus:ring-2 focus:ring-blue-100 disabled:opacity-60";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0065CD]">
              <Building2 size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? "Modifier la proposition" : "Nouvelle proposition"}
              </h2>

              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Modifier les informations du partenaire"
                  : "Proposer un nouveau partenaire"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>

          <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">

            {/* Nom du partenaire */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Building2 size={14} className="text-[#0065CD]" />
                Nom du partenaire
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="part_propos"
                value={form.part_propos}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ex : Galana"
                maxLength={255}
                className={inputClass}
              />

              {errors.part_propos && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.part_propos}
                </p>
              )}
            </div>

            {/* Campus */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <MapPin size={14} className="text-[#0065CD]" />
                Campus
                <span className="text-red-500">*</span>
              </label>

              <select
                name="campus_propos"
                value={form.campus_propos}
                onChange={handleChange}
                disabled={isLoading}
                className={inputClass}
              >
                <option value="">Sélectionner un campus</option>
                <option value="ESMIA">ESMIA</option>
                <option value="BEATI">BEATI</option>
              </select>

              {errors.campus_propos && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.campus_propos}
                </p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Phone size={14} className="text-[#0065CD]" />
                Contact du partenaire
                <span className="text-red-500">*</span>
              </label>

              <input
                type="tel"
                name="contact_propos"
                value={form.contact_propos}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ex : 0346688909"
                maxLength={50}
                className={inputClass}
              />

              {errors.contact_propos && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.contact_propos}
                </p>
              )}
            </div>
          </div>

          {/* Pied de modale */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">

            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0065CD] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {isEditing ? "Modification..." : "Enregistrement..."}
                </>
              ) : (
                <>
                  <Plus size={16} />
                  {isEditing ? "Enregistrer les modifications" : "Ajouter la proposition"}
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}