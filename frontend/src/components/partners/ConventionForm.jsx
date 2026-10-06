import { useState } from "react";
import {
  Hash,
  Users,
  Briefcase,
  Target,
  Link2,
  ScrollText,
  Wallet,
  CalendarRange,
  ShieldOff,
  Lock,
  Gavel,
  Scale,
} from "lucide-react";
import FileUploadField from "../common/FileUploadField";
import Spinner from "../common/Spinner";

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

function TextField({ label, name, value, onChange, placeholder, required, disabled, type = "text" }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-60"
      />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder, required, disabled, rows = 3 }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-60 resize-none"
      />
    </div>
  );
}

/**
 * Formulaire de convention, utilisé par AjouterConvention et ModifierConvention,
 * sur le même principe que PartnersForm. `initialValues` (facultatif) permet
 * de pré-remplir en mode édition.
 */
export default function ConventionForm({ initialValues, onSubmit, onCancel, saving = false }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [photoConv, setPhotoConv] = useState(null);
  const [scan, setScan] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, photo_conv: photoConv, scan });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Section title="Identification" icon={Hash}>
        <TextField
          label="Numéro de convention"
          name="num_conv"
          value={form.num_conv}
          onChange={handleChange}
          placeholder="Ex: CONV-2026-014"
          required
          disabled={saving}
        />
      </Section>

      <Section title="Préambule" icon={ScrollText}>
        <TextAreaField
          label="Préambule"
          name="preambule"
          value={form.preambule}
          onChange={handleChange}
          placeholder="Contexte et présentation des parties..."
          rows={4}
          disabled={saving}
        />
      </Section>

      <Section title="Représentants" icon={Users}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Représentant interne"
            name="repres_int"
            value={form.repres_int}
            onChange={handleChange}
            placeholder="Nom du représentant ESMIA"
            disabled={saving}
          />
          <TextField
            label="Fonction (interne)"
            name="fct_int"
            value={form.fct_int}
            onChange={handleChange}
            placeholder="Ex: Directeur des partenariats"
            disabled={saving}
          />
          <TextField
            label="Représentant externe"
            name="repres_ext"
            value={form.repres_ext}
            onChange={handleChange}
            placeholder="Nom du représentant partenaire"
            disabled={saving}
          />
          <TextField
            label="Fonction (externe)"
            name="fct_ext"
            value={form.fct_ext}
            onChange={handleChange}
            placeholder="Ex: Directeur général"
            disabled={saving}
          />
        </div>
      </Section>

      <Section title="Objet du partenariat" icon={Target}>
        <div className="space-y-4">
          <TextAreaField
            label="Objet"
            name="objet_part"
            value={form.objet_part}
            onChange={handleChange}
            placeholder="Objet de la convention..."
            disabled={saving}
          />
          <div>
            <label htmlFor="axe_collab" className="block text-sm font-semibold text-slate-900 mb-2">
              Axe de collaboration
            </label>
            <div className="flex items-start gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
              <Link2 size={18} className="text-slate-400 shrink-0 mt-0.5" />
              <textarea
                id="axe_collab"
                name="axe_collab"
                value={form.axe_collab}
                onChange={handleChange}
                placeholder="Ex: Stages, recherche, formation professionnelle..."
                rows={2}
                disabled={saving}
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 resize-none disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Conditions" icon={Wallet}>
        <div className="space-y-4">
          <TextAreaField
            label="Conditions du partenariat"
            name="cond_part"
            value={form.cond_part}
            onChange={handleChange}
            placeholder="Engagements de chaque partie..."
            disabled={saving}
          />
          <TextAreaField
            label="Conditions financières"
            name="cond_finan"
            value={form.cond_finan}
            onChange={handleChange}
            placeholder="Modalités financières, le cas échéant..."
            disabled={saving}
          />
        </div>
      </Section>

      <Section title="Durée" icon={CalendarRange}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Date de début"
            name="date_debut_conv"
            type="date"
            value={form.date_debut_conv}
            onChange={handleChange}
            disabled={saving}
          />
          <TextField
            label="Date de fin"
            name="date_fin_conv"
            type="date"
            value={form.date_fin_conv}
            onChange={handleChange}
            disabled={saving}
          />
        </div>
      </Section>

      <Section title="Clauses juridiques" icon={Gavel}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <ShieldOff size={16} className="text-slate-400 mt-8 shrink-0" />
              <div className="flex-1">
                <TextAreaField
                  label="Résiliation"
                  name="resiliation"
                  value={form.resiliation}
                  onChange={handleChange}
                  placeholder="Conditions de résiliation..."
                  rows={3}
                  disabled={saving}
                />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Lock size={16} className="text-slate-400 mt-8 shrink-0" />
              <div className="flex-1">
                <TextAreaField
                  label="Confidentialité"
                  name="confidentialite"
                  value={form.confidentialite}
                  onChange={handleChange}
                  placeholder="Clause de confidentialité..."
                  rows={3}
                  disabled={saving}
                />
              </div>
            </div>
          </div>
          <TextAreaField
            label="Règlement des différends"
            name="regle_diff"
            value={form.regle_diff}
            onChange={handleChange}
            placeholder="Mode de résolution en cas de litige..."
            rows={3}
            disabled={saving}
          />
          <div>
            <label htmlFor="droit_appli" className="block text-sm font-semibold text-slate-900 mb-2">
              Droit applicable
            </label>
            <div className="flex items-center gap-3 border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500">
              <Scale size={18} className="text-slate-400 shrink-0" />
              <input
                id="droit_appli"
                name="droit_appli"
                type="text"
                value={form.droit_appli}
                onChange={handleChange}
                placeholder="Ex: Droit malgache"
                disabled={saving}
                className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Documents" icon={Briefcase}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadField
            label="Photo de la signature en groupe"
            hint="JPG, PNG (max 5 Mo)"
            accept="image/jpeg,image/png"
            file={photoConv}
            existingUrl={initialValues?.photo_conv}
            onChange={setPhotoConv}
            disabled={saving}
          />
          <FileUploadField
            label="Scan de la convention"
            hint="PDF, JPG, PNG (max 10 Mo)"
            accept="application/pdf,image/jpeg,image/png"
            file={scan}
            existingUrl={initialValues?.scan}
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