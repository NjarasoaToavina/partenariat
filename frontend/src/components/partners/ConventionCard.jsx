import { CalendarRange, Users, FileSignature, ArrowRight } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ConventionCard({ convention, onViewDetails }) {
  const {
    num_conv,
    preambule,
    objet_part,
    repres_int,
    repres_ext,
    date_debut_conv,
    date_fin_conv,
  } = convention;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-md hover:border-sky-100 transition-all">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
            <FileSignature size={18} className="text-sky-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-400">Convention</p>
            <p className="text-sm font-bold text-slate-900 truncate">
              {num_conv || "Sans numéro"}
            </p>
          </div>
        </div>
      </div>

      {/* Objet */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
          Objet du partenariat
        </p>
        <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">
          {objet_part || "Non renseigné"}
        </p>
      </div>

      {/* Préambule */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
          Préambule
        </p>
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {preambule || "Non renseigné"}
        </p>
      </div>

      {/* Représentants */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-start gap-2 min-w-0">
          <Users size={15} className="text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Représentant interne</p>
            <p className="text-sm font-medium text-slate-700 truncate">
              {repres_int || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 min-w-0">
          <Users size={15} className="text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Représentant externe</p>
            <p className="text-sm font-medium text-slate-700 truncate">
              {repres_ext || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5">
        <CalendarRange size={16} className="text-slate-400 shrink-0" />
        <span className="font-medium">{formatDate(date_debut_conv)}</span>
        <ArrowRight size={14} className="text-slate-400" />
        <span className="font-medium">{formatDate(date_fin_conv)}</span>
      </div>

      {/* Action */}
      <button
        onClick={() => onViewDetails?.(convention)}
        className="w-full flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-sm rounded-xl py-2.5 transition-colors mt-1"
      >
        Voir détails
        <ArrowRight size={16} />
      </button>
    </div>
  );
}