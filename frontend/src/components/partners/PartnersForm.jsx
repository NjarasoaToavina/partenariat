import Field from '../common/Field'
import { useEffect, useState } from "react";
import { STATUS_LABELS } from "../../data/partnersData";

const CAMPUS_OPTIONS = ["BEATI", "ESMIA"];

const inputCls = (error) =>
  `w-full px-3 py-2 text-sm rounded-lg border bg-white text-slate-800 outline-none
   transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
   ${error ? "border-red-400" : "border-slate-200 hover:border-slate-300"}`;


export default function PartnersForm ({ initialValues, onSubmit, onCancel, saving }) {

  const [form, setForm] = useState({
    nom_part: "",
    campus_part: "",
    statut_part: "",
    type_part: "",
    nbr_intervention: 0,
    prochaine_action: "",
    contact_part: "",
    observation: "",
    ...initialValues, // pré-remplit en mode édition, ignoré en création
  });

  // 2. Ajoutez ceci sous la déclaration de vos états :
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm(initialValues);
    }
  }, [initialValues]);
 
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.nom_part.trim())  e.nom_part = "Champ requis.";
    if (!form.campus_part)      e.campus_part = "Champ requis.";
    if (!form.statut_part)      e.statut_part = "Champ requis.";
    if (!form.contact_part)      e.contact_part = "Champ requis.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">

          {/* Nom + Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom du partenaire" required error={errors.nom_part}>
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
                 {/* Génération dynamique des options à partir de votre objet */}
                  {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="Type de partenariat">
              <input
                className={inputCls()}
                type="text"
                placeholder="Ex : Académique"
                value={form.type_part}
                onChange={set("type_part")}
              />
            </Field>
          </div>

          {/* Contact + Prochaine action*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contact" required>
              <input
                className={inputCls()}
                type="text"
                placeholder="Email ou téléphone"
                value={form.contact_part}
                onChange={set("contact_part")}
              />
            </Field>
            <Field label="Prochaine action">
              <input
                className={inputCls()}
                type="text"
                placeholder="Ex : Réunion de suivi"
                value={form.prochaine_action}
                onChange={set("prochaine_action")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prochaine action + observation */}
            <Field label="Observation">
              <textarea
                className={`${inputCls()} resize-y min-h-[90px]`}
                placeholder="Informations complémentaires..."
                value={form.observation}
                onChange={set("observation")}
              />
            </Field>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
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
  );
}