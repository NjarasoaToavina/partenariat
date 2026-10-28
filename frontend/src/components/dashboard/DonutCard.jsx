import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { STATUS_COLORS, statusData } from "../../data/campusData";
import logoEsmia from "../../assets/logo.png";
import logoBeati from "../../assets/logo-beati.png";

export default function DonutCard({ title, badge, row }) {
  const data = statusData(row);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex-1 min-w-0">

      {/* En-tête */}
      <div className="flex items-center gap-2 mb-6">
        <img
          src={row.name === "ESMIA" ? logoEsmia : logoBeati}
          alt={`Logo ${row.name}`}
          className="w-7 h-7 object-contain"
        />

        <h3 className="text-sm font-bold text-slate-900 flex-1">
          {title}
        </h3>

        <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-md">
          {badge}
        </span>
      </div>

      {/* Donut et légende */}
      <div className="flex flex-col xl:flex-row items-center gap-6">

        {/* Donut agrandi */}
        <div className="relative w-56 h-56 shrink-0">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="65%"
                outerRadius="95%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={STATUS_COLORS[d.name] || "#94a3b8"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Total au centre */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm text-slate-400 font-medium">
              Total
            </span>

            <span className="text-3xl font-bold text-slate-900">
              {total}
            </span>
          </div>

        </div>

        {/* Légende */}
        <div className="w-full flex-1 min-w-0">

          <ul className="space-y-3">
            {data.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between gap-4 text-sm"
              >

                <span className="flex items-center gap-2 text-slate-600 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[d.name] || "#94a3b8",
                    }}
                  />

                  <span>{d.name}</span>
                </span>

                <span className="font-semibold text-slate-900 shrink-0">
                  {d.value}
                </span>

              </li>
            ))}
          </ul>

          {/* Total */}
          <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-slate-100">
            <span className="font-bold text-slate-900">
              Total
            </span>

            <span className="font-bold text-[#0065CD]">
              {total}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}