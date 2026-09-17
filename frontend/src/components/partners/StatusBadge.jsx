import { STATUS_STYLES, STATUS_LABELS } from "../../data/partnersData";

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
        STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}