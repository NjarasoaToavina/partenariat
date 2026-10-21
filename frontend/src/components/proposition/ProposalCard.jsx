import { Building2, CalendarDays, Clock, Info, UserRound, Check, X, Trash2, Pencil,MapPin, Phone } from "lucide-react";
import PropositionStatusBadge from "./PropositionStatusBadge";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";

export default function ProposalCard({
  icon: Icon = Building2,
  iconBg = "bg-sky-600",
  title,
  orgLabel,
  statut,
  date,
  heure,
  description,
  proposeLe,
  onValidate,
  campus,
  contact,
  proposePar,
  onReject,
  onEdit,
  onDelete,
  isValidating = false,
}) {

  const { hasPermission } = useAuth();
  const hasPartnerInfo = Boolean(campus || contact);

  // Vérifier le statut
  const isPending = statut === "attente";

  // Vérifier les permissions
  const canValidate = hasPermission("propositions.validate");
  const canReject = hasPermission("propositions.reject");
  const canUpdate = hasPermission("propositions.update");
  const canDelete = hasPermission("propositions.delete");

  // Actions autorisées selon le statut
  const showValidateAction = isPending && canValidate;
  const showRejectAction = isPending && canReject;
  const showUpdateAction = isPending && canUpdate;

  // La suppression est autorisée quel que soit le statut
  const showDeleteAction = canDelete;

  // Vérifier si au moins une action est disponible
  const hasActions =
    showValidateAction ||
    showRejectAction ||
    showUpdateAction ||
    showDeleteAction;

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
      {/* 3. Campus et contact */}
      {hasPartnerInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {campus && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
              <MapPin size={15} className="text-[#0065CD]" />
              <span className="text-xs text-slate-700">
                Campus : {campus}
              </span>
            </div>
          )}

          {contact && (
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
              <Phone size={15} className="text-[#0065CD]" />
              <span className="text-xs text-slate-700">
                Contact : {contact}
              </span>
            </div>
          )}

        </div>
      )}
      <div className="flex items-start gap-2 bg-sky-50 rounded-lg p-3">
        <Info size={14} className="text-sky-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>

      <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
        {/* Nom de la personne */}
        {proposePar && (
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <UserRound size={13} className="shrink-0" />

            <span>
              Proposé par :{" "}
              <span className="font-semibold text-slate-700">
                {proposePar}
              </span>
            </span>
          </span>
        )}

        {/* Date de proposition */}
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <CalendarDays size={13} />
          Proposé le {proposeLe}
        </span>

          {/* Boutons d'action */}
        {hasActions && (
          <div className="flex flex-wrap items-center justify-end gap-2 w-full">

            {/* Refuser */}
            {showRejectAction && (
              <button
                type="button"
                onClick={onReject}
                disabled={isValidating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={14} />
                Refuser
              </button>
            )}

            {/* Valider */}
            {showValidateAction && (
              <button
                type="button"
                onClick={onValidate}
                disabled={isValidating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <Spinner size={14} className="text-white" />
                ) : (
                  <Check size={14} />
                )}

                {isValidating ? "Validation..." : "Valider"}
              </button>
            )}

            {/* Modifier */}
            {showUpdateAction && (
              <button
                type="button"
                onClick={onEdit}
                disabled={isValidating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pencil size={14} />
                Modifier
              </button>
            )}

            {/* Supprimer */}
            {showDeleteAction && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isValidating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            )}

          </div>
        )}
      </div>
    </div>
  );
}