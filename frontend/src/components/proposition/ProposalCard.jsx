import { Building2, CalendarDays, Clock, Info, UserRound, Check, X } from "lucide-react";
import PropositionStatusBadge from "./PropositionStatusBadge";

export default function ProposalCard({
  icon: Icon,
  iconBg,
  title,
  orgLabel,
  statut,
  date,
  heure,
  description,
  proposeLe,
  onValidate,
  onReject,
}) {
  const isPending = statut === "attente";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 min-w-0">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${iconBg}`}>
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
              <Building2 size={12} className="shrink-0" /> {orgLabel}
            </p>
          </div>
        </div>
        <PropositionStatusBadge status={statut} />
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={13} /> {date}
        </span>
        {heure && (
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {heure}
          </span>
        )}
      </div>

      <div className="flex items-start gap-2 bg-sky-50 rounded-lg p-3">
        <Info size={14} className="text-sky-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <UserRound size={13} /> Proposé le {proposeLe}
        </span>

        {isPending && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
            >
              <X size={14} /> Refuser
            </button>
            <button
              type="button"
              onClick={onValidate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
            >
              <Check size={14} /> Valider
            </button>
          </div>
        )}
      </div>
    </div>
  );
}