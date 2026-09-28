import { DOC_STATUS_LABELS, DOC_STATUS_STYLES, DOC_TYPE_LABELS, DOC_TYPE_STYLES } from "../../data/documentData";

export function StatusPill({ status }) {
  const className = DOC_STATUS_STYLES[status] ?? "bg-slate-50 text-slate-600";
  const label = DOC_STATUS_LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}

export function TypePill({ type }) {
  const className = DOC_TYPE_STYLES[type] ?? "bg-slate-50 text-slate-600";
  const label = DOC_TYPE_LABELS[type] ?? type;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}