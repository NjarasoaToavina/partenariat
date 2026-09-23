import { useState, useEffect } from "react";
import Field from "../common/Field.jsx";

const CAMPUS_OPTIONS = ["ESMIA", "BEATI"];
const STATUT_OPTIONS = ["Planifié", "Réalisé"];

const inputCls = (error) =>
  `w-full px-3 py-2 text-sm rounded-lg border bg-white text-slate-800 outline-none
   transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
   ${error ? "border-red-400" : "border-slate-200 hover:border-slate-300"}`;

export default function AtelierForm({ initialValues, onSubmit, onCancel, saving }) {

  const [form, setForm] = useState({
    date_debut_atel: "",
    date_fin_atel:"",
    campus_atel: "",
    groupe: "1",
    contenu_atel: "",
    intervenant: "",
    statut_atel: "Planifié",
    ...initialValues,
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
    if (!form.date_debut_atel)           e.date_debut_atel = "Champ requis.";
    if (!form.date_fin_atel)             e.date_fin_atel = "Champ requis.";
    if (!form.campus_atel)               e.campus_atel = "Champ requis.";
    if (!form.groupe || form.groupe < 1) e.groupe = "Champ requis.";
    if (!form.contenu_atel.trim())       e.contenu_atel = "Champ requis.";
    if (!form.intervenant.trim())        e.intervenant = "Champ requis.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Atelier data:", form);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
    
    // setSaving(true);
    // try {
    //   await createAtelier(form);
    //   toast.success("Atelier ajouté avec succès.");
    //   navigate("/ateliers");
    // } catch(error) {
    //     console.error("Erreur lors de l'ajout de l'atelier:", error);
    //   toast.error("Une erreur est survenue. Veuillez réessayer.");
    // } finally {
    //   setSaving(false);
    // }
  };

  return (
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">

          {/* Date + Campus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Date du début de l'atelier" required error={errors.date_debut_atel}>
              <input
                className={inputCls(errors.date_debut_atel)}
                type="datetime-local"
                value={form.date_debut_atel}
                onChange={set("date_debut_atel")}
              />
            </Field>
            <Field label="Date de fin de l'atelier" required error={errors.date_fin_atel}>
              <input
                className={inputCls(errors.date_fin_atel)}
                type="datetime-local"
                value={form.date_fin_atel}
                onChange={set("date_fin_atel")}
              />
            </Field>
          </div>

          {/* Nombre de groupe + Intervenant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Campus" required error={errors.campus_atel}>
              <select className={inputCls(errors.campus_atel)} value={form.campus_atel} onChange={set("campus_atel")}>
                <option value="">Sélectionner un campus</option>
                {CAMPUS_OPTIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            
            <Field label="Nombre de groupe" required error={errors.groupe}>
              <input
                className={inputCls(errors.groupe)}
                type="number"
                min="1"
                value={form.groupe}
                onChange={set("groupe")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Intervenant + Statut */}
            <Field label="Intervenant" required error={errors.intervenant}>
              <input
                className={inputCls(errors.intervenant)}
                type="text"
                placeholder="Nom de l'intervenant (département ou entreprise)"
                value={form.intervenant}
                onChange={set("intervenant")}
              />
            </Field>

            <Field label="Statut" required error={errors.statut_atel}>
              <select className={inputCls(errors.statut_atel)} value={form.statut_atel} onChange={set("statut_atel")}>
                {STATUT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          
          </div>

          {/* Contenu */}
          <Field label="Contenu / Thématique" required error={errors.contenu_atel}>
            <textarea
              className={`${inputCls(errors.contenu_atel)} resize-y min-h-[90px]`}
              placeholder="Décrivez le contenu ou la thématique de l'atelier..."
              value={form.contenu_atel}
              onChange={set("contenu_atel")}
            />
          </Field>

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