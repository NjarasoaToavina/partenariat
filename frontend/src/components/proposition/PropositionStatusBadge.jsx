import { PROPOSITION_STATUS_LABELS, PROPOSITION_STATUS_STYLES } from "../../data/propositionData";

export default function PropositionStatusBadge({ status }) {
  const className = PROPOSITION_STATUS_STYLES[status] ?? "bg-slate-50 text-slate-600";
  const label = PROPOSITION_STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${className}`}>
      {label}
    </span>
  );
}