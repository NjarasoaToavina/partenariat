import {
  BarChart2,
  FileSignature,
  RefreshCw,
  Hourglass,
  ShieldCheck,
  Users,
} from "lucide-react";
import CampusLogo from "../common/CampusLogo";

export default function StatusTable({ rows, title = "Statut des partenaires par campus" }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-sky-600" />
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr className="bg-[#0a2942] text-white text-sm">
              <th className="text-left font-semibold px-4 py-3 rounded-l-xl">
                Campus
              </th>
              <th className="text-left font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <FileSignature size={16} /> Signé
                </span>
              </th>
              <th className="text-left font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <RefreshCw size={16} /> Renouvelé
                </span>
              </th>
              <th className="text-left font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <Hourglass size={16} /> En cours
                </span>
              </th>
              <th className="text-left font-semibold px-4 py-3">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} /> Officieux
                </span>
              </th>
              <th className="text-left font-semibold px-4 py-3 rounded-r-xl">
                <span className="inline-flex items-center gap-2">
                  <Users size={16} /> Total
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-slate-100 last:border-b-0">
                <td className="px-4 py-4">
                  <span className="flex items-center gap-3 font-semibold text-slate-900">
                    <CampusLogo label={row.badge.slice(0, 2)} />
                    {row.name}
                  </span>
                </td>
                <td className="px-4 py-4 font-semibold text-slate-800">
                  {row.signe}
                </td>
                <td className="px-4 py-4 font-semibold text-slate-800">
                  {row.renouvele}
                </td>
                <td className="px-4 py-4 font-semibold text-slate-800">
                  {row.enCours}
                </td>
                <td className="px-4 py-4 font-semibold text-slate-800">
                  {row.officieux}
                </td>
                <td className="px-4 py-4 font-bold text-slate-900">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}