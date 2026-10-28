import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { TrendingUp } from "lucide-react";
import { PARTNERSHIP_EVOLUTION } from "../../data/partnershipEvolutionData";

export default function PartnershipEvolutionChart({
  data = [],
  year,
  onYearChange,
}) {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">

      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">

        <div className="flex items-center gap-2">
          <TrendingUp size={19} className="text-sky-600" />

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Évolution des partenariats
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Nombre de nouveaux partenariats enregistrés par mois
            </p>
          </div>
        </div>

        {/* Filtre par année */}
        <select
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="px-4 py-2 text-sm border border-slate-200 rounded-lg
                    bg-white text-slate-700 outline-none
                    focus:ring-2 focus:ring-blue-500"
        >
        {years.map((availableYear) => (
            <option key={availableYear} value={availableYear}>
            {availableYear}
            </option>
        ))}
        </select>

      </div>

      {/* Graphique */}
      <div className="w-full h-[320px]">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              vertical={false}
            />

            <XAxis
              dataKey="mois"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
              formatter={(value, name) => [
                `${value} partenariat(s)`,
                name,
              ]}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />

            {/* Courbe ESMIA */}
            <Line
              type="monotone"
              dataKey="esmia"
              name="ESMIA"
              stroke="#0065CD"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#0065CD",
                strokeWidth: 0,
              }}
              activeDot={{ r: 6 }}
            />

            {/* Courbe BEATI */}
            <Line
              type="monotone"
              dataKey="beati"
              name="BEATI"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#22c55e",
                strokeWidth: 0,
              }}
              activeDot={{ r: 6 }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}