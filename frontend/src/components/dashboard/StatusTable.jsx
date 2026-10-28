import {
  BarChart2,
  FileSignature,
  RefreshCw,
  Hourglass,
  ShieldCheck,
  Users,
  SearchCheck,
  Clock3,
  ClipboardCheck,
} from "lucide-react";

import logoEsmia from "../../assets/logo.png";
import logoBeati from "../../assets/logo-beati.png";

// Les 7 statuts des partenariats
const STATUS_COLUMNS = [
  {
    key: "prospecte",
    label: "Prospecté",
    icon: SearchCheck,
  },
  {
    key: "cours",
    label: "En cours",
    icon: Hourglass,
  },
  {
    key: "attente",
    label: "Validation",
    icon: Clock3,
  },
  {
    key: "finalisation",
    label: "Finalisation",
    icon: ClipboardCheck,
  },
  {
    key: "signe",
    label: "Signé",
    icon: FileSignature,
  },
  {
    key: "officieux",
    label: "Officieux",
    icon: ShieldCheck,
  },
  {
    key: "renouvele",
    label: "Renouvelé",
    icon: RefreshCw,
  },
];

export default function StatusTable({
  rows = [],
  title = "Statut des partenaires par campus",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

      {/* Titre du tableau */}
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={18} className="text-sky-600" />

        <h2 className="text-sm font-bold text-slate-900">
          {title}
        </h2>
      </div>

      {/* Tableau responsive */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] border-separate border-spacing-0">

          {/* En-tête */}
          <thead>
            <tr className="bg-[#0065CD] text-white text-sm">

              {/* Campus */}
              <th className="text-left font-semibold px-4 py-3 rounded-l-xl">
                Campus
              </th>

              {/* Colonnes des statuts */}
              {STATUS_COLUMNS.map(({ key, label, icon: Icon }) => (
                <th
                  key={key}
                  className="text-center font-semibold px-4 py-3 whitespace-nowrap"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Icon size={16} />
                    {label}
                  </span>
                </th>
              ))}

              {/* Total */}
              <th className="text-center font-semibold px-4 py-3 rounded-r-xl">
                <span className="inline-flex items-center justify-center gap-2">
                  <Users size={16} />
                  Total
                </span>
              </th>

            </tr>
          </thead>

          {/* Corps du tableau */}
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className="hover:bg-slate-50 transition-colors"
              >

                {/* Campus et logo */}
                <td className="px-4 py-4 border-b border-slate-100">
                  <span className="flex items-center gap-3 font-semibold text-slate-900">
                    <img
                      src={
                        row.name === "ESMIA"
                          ? logoEsmia
                          : logoBeati
                      }
                      alt={`Logo ${row.name}`}
                      className="w-7 h-7 object-contain"
                    />

                    {row.name}
                  </span>
                </td>

                {/* Valeurs des statuts */}
                {STATUS_COLUMNS.map(({ key }) => (
                  <td
                    key={key}
                    className="px-4 py-4 text-center font-semibold text-slate-800 border-b border-slate-100"
                  >
                    {row[key] ?? 0}
                  </td>
                ))}

                {/* Total des partenariats */}
                <td className="px-4 py-4 text-center font-bold text-[#0065CD] border-b border-slate-100">
                  {row.total ?? 0}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Message si aucune donnée */}
      {rows.length === 0 && (
        <div className="text-center py-8 text-sm text-slate-500">
          Aucune donnée disponible.
        </div>
      )}

    </div>
  );
}