import { STATUT_STYLES, CAMPUS_STYLES } from "../../data/atelierData";

export function StatutBadge({ statut }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
        STATUT_STYLES[statut] || "bg-slate-100 text-slate-600"
      }`}
    >
      {statut}
    </span>
  );
}

export function CampusBadge({ campus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
        CAMPUS_STYLES[campus] || "bg-slate-100 text-slate-600"
      }`}
    >
      {campus}
    </span>
  );
}