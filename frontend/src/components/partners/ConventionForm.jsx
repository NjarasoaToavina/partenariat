import { useEffect, useState } from "react";
import {
  Hash,
  Users,
  Briefcase,
  Target,
  Link2,
  ScrollText,
  Wallet,
  CalendarRange,
  Gavel,
  Scale,
} from "lucide-react";
import Field from "../common/Field.jsx";
import FileUploadField from "../common/FileUploadField";
import Spinner from "../common/Spinner";
import { URL } from "../../services/api.js";

const EMPTY_FORM = {
  num_conv: "",
  preambule: "",
  repres_int: "",
  fct_int: "",
  repres_ext: "",
  fct_ext: "",
  objet_part: "",
  axe_collab: "",
  cond_part: "",
  cond_finan: "",
  date_debut_conv: "",
  date_fin_conv: "",
  resiliation: "",
  confidentialite: "",
  regle_diff: "",
  droit_appli: "",
};

const inputCls = (error) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-white text-slate-800 outline-none
   transition-colors focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400
   ${error ? "border-rose-400" : "border-slate-200 hover:border-slate-300"}`;

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-sky-600" />
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/**
 * Formulaire de convention, utilisé par AjouterConvention et ModifierConvention.
 * Même mécanisme de validation que AtelierForm : état `errors`, `set(field)`
 * qui efface l'erreur dès que l'utilisateur retape, `validate()` appelé à la
 * soumission, et `noValidate` sur le <form> pour laisser nos propres messages
 * gérer l'affichage plutôt que les bulles natives du navigateur.
 */
export default function ConventionForm({ initialValues, onSubmit, onCancel, saving = false }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [photoConv, setPhotoConv] = useState(null);
  const [scan, setScan] = useState(null);
  const [errors, setErrors] = useState({});

  // console.log("initialValues dans ConventionForm:", initialValues);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm({ ...EMPTY_FORM, ...initialValues });
    }
  }, [initialValues]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.num_conv.trim()) e.num_conv = "Champ requis.";
    if (!form.repres_int.trim()) e.repres_int = "Champ requis.";
    if (!form.repres_ext.trim()) e.repres_ext = "Champ requis.";
    if (!form.objet_part.trim()) e.objet_part = "Champ requis.";
    if (!form.date_debut_conv) e.date_debut_conv = "Champ requis.";
    if (!form.date_fin_conv) e.date_fin_conv = "Champ requis.";
    if (
      form.date_debut_conv &&
      form.date_fin_conv &&
      new Date(form.date_fin_conv) < new Date(form.date_debut_conv)
    ) {
      e.date_fin_conv = "Doit être après la date de début.";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...form, photo_conv: photoConv, scan: scan });
  };

  
  const cleanBackendUrl = URL.replace(/\/api$/, "");  // À adapter selon votre config
  const photo_conv_url = initialValues?.photo_conv 
    ? (initialValues.photo_conv.startsWith('http') ? initialValues.photo_conv : `${cleanBackendUrl}/storage/${initialValues.photo_conv}`)
    : null;

  const scan_url = initialValues?.scan 
    ? (initialValues.scan.startsWith('http') ? initialValues.scan : `${cleanBackendUrl}/storage/${initialValues.scan}`)
    : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Section title="Identification" icon={Hash}>
        <Field label="Numéro de convention" required error={errors.num_conv}>
          <input
            className={inputCls(errors.num_conv)}
            type="text"
            value={form.num_conv}
            onChange={set("num_conv")}
            placeholder="Ex: CONV-2026-014"
            disabled={saving}
          />
        </Field>
      </Section>

      <Section title="Préambule" icon={ScrollText}>
        <Field label="Préambule" error={errors.preambule}>
          <textarea
            className={`${inputCls(errors.preambule)} resize-y min-h-[90px]`}
            value={form.preambule}
            onChange={set("preambule")}
            placeholder="Contexte et présentation des parties..."
            disabled={saving}
          />
        </Field>
      </Section>

      <Section title="Représentants" icon={Users}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Représentant interne" required error={errors.repres_int}>
            <input
              className={inputCls(errors.repres_int)}
              type="text"
              value={form.repres_int}
              onChange={set("repres_int")}
              placeholder="Nom du représentant ESMIA"
              disabled={saving}
            />
          </Field>
          <Field label="Fonction (interne)" error={errors.fct_int}>
            <input
              className={inputCls(errors.fct_int)}
              type="text"
              value={form.fct_int}
              onChange={set("fct_int")}
              placeholder="Ex: Directeur des partenariats"
              disabled={saving}
            />
          </Field>
          <Field label="Représentant externe" required error={errors.repres_ext}>
            <input
              className={inputCls(errors.repres_ext)}
              type="text"
              value={form.repres_ext}
              onChange={set("repres_ext")}
              placeholder="Nom du représentant partenaire"
              disabled={saving}
            />
          </Field>
          <Field label="Fonction (externe)" error={errors.fct_ext}>
            <input
              className={inputCls(errors.fct_ext)}
              type="text"
              value={form.fct_ext}
              onChange={set("fct_ext")}
              placeholder="Ex: Directeur général"
              disabled={saving}
            />
          </Field>
        </div>
      </Section>

      <Section title="Objet du partenariat" icon={Target}>
        <div className="space-y-4">
          <Field label="Objet" required error={errors.objet_part}>
            <textarea
              className={`${inputCls(errors.objet_part)} resize-y min-h-[80px]`}
              value={form.objet_part}
              onChange={set("objet_part")}
              placeholder="Objet de la convention..."
              disabled={saving}
            />
          </Field>
          <Field label="Axe de collaboration" error={errors.axe_collab}>
            <div className="flex items-start gap-3">
              <Link2 size={18} className="text-slate-400 shrink-0 mt-2.5" />
              <textarea
                className={`${inputCls(errors.axe_collab)} resize-y min-h-[70px]`}
                value={form.axe_collab}
                onChange={set("axe_collab")}
                placeholder="Ex: Stages, recherche, formation professionnelle..."
                disabled={saving}
              />
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Conditions" icon={Wallet}>
        <div className="space-y-4">
          <Field label="Conditions du partenariat" error={errors.cond_part}>
            <textarea
              className={`${inputCls(errors.cond_part)} resize-y min-h-[80px]`}
              value={form.cond_part}
              onChange={set("cond_part")}
              placeholder="Engagements de chaque partie..."
              disabled={saving}
            />
          </Field>
          <Field label="Conditions financières" error={errors.cond_finan}>
            <textarea
              className={`${inputCls(errors.cond_finan)} resize-y min-h-[80px]`}
              value={form.cond_finan}
              onChange={set("cond_finan")}
              placeholder="Modalités financières, le cas échéant..."
              disabled={saving}
            />
          </Field>
        </div>
      </Section>

      <Section title="Durée" icon={CalendarRange}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date de début" required error={errors.date_debut_conv}>
            <input
              className={inputCls(errors.date_debut_conv)}
              type="date"
              value={form.date_debut_conv}
              onChange={set("date_debut_conv")}
              disabled={saving}
            />
          </Field>
          <Field label="Date de fin" required error={errors.date_fin_conv}>
            <input
              className={inputCls(errors.date_fin_conv)}
              type="date"
              value={form.date_fin_conv}
              onChange={set("date_fin_conv")}
              disabled={saving}
            />
          </Field>
        </div>
      </Section>

      <Section title="Clauses juridiques" icon={Gavel}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Résiliation" error={errors.resiliation}>
              <textarea
                className={`${inputCls(errors.resiliation)} resize-y min-h-[70px]`}
                value={form.resiliation}
                onChange={set("resiliation")}
                placeholder="Conditions de résiliation..."
                disabled={saving}
              />
            </Field>
            <Field label="Confidentialité" error={errors.confidentialite}>
              <textarea
                className={`${inputCls(errors.confidentialite)} resize-y min-h-[70px]`}
                value={form.confidentialite}
                onChange={set("confidentialite")}
                placeholder="Clause de confidentialité..."
                disabled={saving}
              />
            </Field>
          </div>
          <Field label="Règlement des différends" error={errors.regle_diff}>
            <textarea
              className={`${inputCls(errors.regle_diff)} resize-y min-h-[70px]`}
              value={form.regle_diff}
              onChange={set("regle_diff")}
              placeholder="Mode de résolution en cas de litige..."
              disabled={saving}
            />
          </Field>
          <Field label="Droit applicable" error={errors.droit_appli}>
            <div className="flex items-center gap-3">
              <Scale size={18} className="text-slate-400 shrink-0" />
              <input
                className={inputCls(errors.droit_appli)}
                type="text"
                value={form.droit_appli}
                onChange={set("droit_appli")}
                placeholder="Ex: Droit malgache"
                disabled={saving}
              />
            </div>
          </Field>
        </div>
      </Section>

      <Section title="Documents" icon={Briefcase}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadField
            label="Photo de la signature en groupe"
            hint="JPG, PNG (max 5 Mo)"
            accept="image/jpeg,image/png"
            file={photoConv}
            existingUrl={photo_conv_url}
            onChange={setPhotoConv}
            disabled={saving}
          />
          <FileUploadField
            label="Scan de la convention"
            hint="PDF, JPG, PNG (max 10 Mo)"
            accept="application/pdf,image/jpeg,image/png"
            file={scan}
            existingUrl={scan_url}
            onChange={setScan}
            disabled={saving}
          />
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="border border-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
        >
          {saving && <Spinner size={16} className="text-white" />}
          {saving ? "Enregistrement..." : "Enregistrer la convention"}
        </button>
      </div>
    </form>
  );
}