import { Pencil } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function PartnersTable({ partners, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500">
            <th className="px-4 py-3">Nom du partenariat</th>
            <th className="px-4 py-3">Campus</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3">Type de partenariat</th>
            <th className="px-4 py-3">
              Nombre
              <br />
              d'intervenants
            </th>
            <th className="px-4 py-3">Prochaine action</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Observation</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id_part} className="border-t border-slate-100">
              <td className="px-4 py-4 align-top">
                <p className="text-sm font-bold text-slate-900">
                  {partner.nom_part}
                </p>
                <p className="text-xs text-slate-400">{partner.sector}</p>
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {partner.campus_part}
              </td>
              <td className="px-4 py-4 align-top">
                <StatusBadge status={partner.statut_part} />
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {partner.type_part}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700">
                {partner.nbr_intervenant}
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700 whitespace-nowrap">
                {partner.prochaine_action}
              </td>
              <td className="px-4 py-4 align-top text-sm">
                <p className="font-semibold text-slate-900">
                  {partner.contact_part}
                </p>
                <p className="text-xs text-slate-400">
                  {partner.contact_part}
                </p>
                <p className="text-xs text-slate-400">
                  {partner.contact_part}
                </p>
              </td>
              <td className="px-4 py-4 align-top text-sm text-slate-700 max-w-[160px]">
                {partner.observation}
              </td>
              <td className="px-4 py-4 align-top">
                <button
                  onClick={() => onEdit?.(partner)}
                  className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:text-sky-600 hover:border-sky-300 transition-colors"
                  aria-label={`Modifier ${partner.nom_part}`}
                >
                  <Pencil size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}