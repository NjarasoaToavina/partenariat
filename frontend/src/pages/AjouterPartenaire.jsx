import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext.jsx";
import { createPartnership } from "../services/partenariatService";

const CAMPUS_OPTIONS = ["BEATI", "ESMIA"];
const STATUT_OPTIONS = ["Actif", "Inactif", "Prospecté", "En cours", "En attente de validation", "Finalisation", "Signé"];

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = (error) =>
  `w-full px-3 py-2 text-sm rounded-lg border bg-white text-slate-800 outline-none
   transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
   ${error ? "border-red-400" : "border-slate-200 hover:border-slate-300"}`;

export default function AjouterPartenaire() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    nom_part: "",
    campus_part: "",
    statut_part: "",
    type_part: "",
    nbr_intervenant: "",
    prochaine_action: "",
    contact_part: "",
    observation: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.nom_part.trim())  e.nom_part = "Champ requis.";
    if (!form.campus_part)      e.campus_part = "Champ requis.";
    if (!form.statut_part)      e.statut_part = "Champ requis.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await createPartnership({
        ...form,
        nbr_intervenant: form.nbr_intervenant ? Number(form.nbr_intervenant) : null,
      });
      toast.success("Partenaire ajouté avec succès.");
      navigate("/partenaires");
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Fil d'Ariane + titre */}
      <div>
        <p className="text-xs text-slate-400">
          Visualisation des informations
          <span className="mx-1.5 text-slate-300">/</span>
          <button className="text-blue-500 hover:underline" onClick={() => navigate("/partenaires")}>
            Partenaires
          </button>
          <span className="mx-1.5 text-slate-300">/</span>
          <span className="text-slate-500">Ajouter</span>
        </p>
        <h1 className="text-xl font-semibold text-slate-800 mt-1">Ajouter un partenaire</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">

          {/* Nom + Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom du partenariat" required error={errors.nom_part}>
              <input
                className={inputCls(errors.nom_part)}
                type="text"
                placeholder="Ex : Orange Madagascar"
                value={form.nom_part}
                onChange={set("nom_part")}
              />
            </Field>

            <Field label="Campus" required error={errors.campus_part}>
              <select className={inputCls(errors.campus_part)} value={form.campus_part} onChange={set("campus_part")}>
                <option value="">Sélectionner un campus</option>
                {CAMPUS_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Statut + Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Statut" required error={errors.statut_part}>
              <select className={inputCls(errors.statut_part)} value={form.statut_part} onChange={set("statut_part")}>
                <option value="">Choisir un statut</option>
                {STATUT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Type de partenariat">
              <input
                className={inputCls()}
                type="text"
                placeholder="Ex : Professionnel"
                value={form.type_part}
                onChange={set("type_part")}
              />
            </Field>
          </div>

          {/* Nb intervenants + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre d'intervenants">
              <input
                className={inputCls()}
                type="number"
                min="0"
                placeholder="Ex : 5"
                value={form.nbr_intervenant}
                onChange={set("nbr_intervenant")}
              />
            </Field>

            <Field label="Contact">
              <input
                className={inputCls()}
                type="text"
                placeholder="Email ou téléphone"
                value={form.contact_part}
                onChange={set("contact_part")}
              />
            </Field>
          </div>

          {/* Prochaine action */}
          <Field label="Prochaine action">
            <input
              className={inputCls()}
              type="text"
              placeholder="Ex : Réunion de suivi"
              value={form.prochaine_action}
              onChange={set("prochaine_action")}
            />
          </Field>

          {/* Observation */}
          <Field label="Observation">
            <textarea
              className={`${inputCls()} resize-y min-h-[90px]`}
              placeholder="Informations complémentaires..."
              value={form.observation}
              onChange={set("observation")}
            />
          </Field>

          {/* Actions */}
          <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/partenaires")}
              className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}