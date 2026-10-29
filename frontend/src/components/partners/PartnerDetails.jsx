import {
  Building2,
  MapPin,
  Users,
  FileText,
  CalendarDays,
  Phone,
  ClipboardList,
  ArrowRight,
  Plus,
} from "lucide-react";

import StatusBadge from "./StatusBadge";

function DashIfEmpty({ value }) {
  const isEmpty = value === null || value === undefined || value === "";

  return isEmpty
    ? <span className="text-slate-400 italic">—</span>
    : <>{value}</>;
}

export default function PartnerDetails({ partner, onConventionClick }) {
  if (!partner) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500">
        Aucun partenariat associé à votre compte.
      </div>
    );
  }

  const informations = [
    {
      label: "Campus",
      value: partner.campus_part,
      icon: MapPin,
    },
    {
      label: "Type de partenariat",
      value: partner.type_part,
      icon: Building2,
    },
    {
      label: "Nombre d'intervenants",
      value: partner.nbr_intervention,
      icon: Users,
    },
    {
      label: "Prochaine action",
      value: partner.prochaine_action,
      icon: CalendarDays,
    },
    {
      label: "Contact",
      value: partner.contact_part,
      icon: Phone,
    },
    {
      label: "Observation",
      value: partner.observation,
      icon: ClipboardList,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

      {/* En-tête */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building2 size={26} className="text-[#0065CD]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {partner.nom_part}
              </h2>

              {partner.sector && (
                <p className="text-sm text-slate-500 mt-1">
                  {partner.sector}
                </p>
              )}
            </div>
          </div>

          <StatusBadge status={partner.statut_part} />

        </div>
      </div>

      {/* Informations du partenariat */}
      <div className="p-6">

        <h3 className="text-sm font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <FileText size={18} className="text-[#0065CD]" />
          Informations du partenariat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {informations.map((info) => {
            const Icon = info.icon;

            return (
              <div
                key={info.label}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Icon size={19} className="text-[#0065CD]" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500 mb-1">
                    {info.label}
                  </p>

                  <p className="text-sm font-semibold text-slate-800 break-words">
                    <DashIfEmpty value={info.value} />
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        {/* Conventions */}
        <div className="mt-8 pt-6 border-t border-slate-100">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Conventions du partenariat
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Consulter les conventions associées à ce partenariat.
              </p>
            </div>

            <button
              onClick={() => onConventionClick?.(partner)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0065CD] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={17} />
              Voir les conventions
              <ArrowRight size={16} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}