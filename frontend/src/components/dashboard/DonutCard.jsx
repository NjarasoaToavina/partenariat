import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CampusLogo from "../common/CampusLogo";
import { STATUS_COLORS, statusData } from "../../data/campusData";

export default function DonutCard({ title, badge, row }) {
  const data = statusData(row);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-6">
        <CampusLogo label={badge.slice(0, 2)} />
        <h3 className="text-sm font-bold text-slate-900 flex-1">{title}</h3>
        <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-3 py-1 rounded-md">
          {badge}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-slate-400 font-medium">Total</span>
            <span className="text-2xl font-bold text-slate-900">
              {row.total}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <ul className="space-y-2.5">
            {data.map((d) => (
              <li key={d.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_COLORS[d.name] }}
                  />
                  {d.name}
                </span>
                <span className="font-semibold text-slate-900">{d.value}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between text-sm mt-3 pt-3 border-t border-slate-100">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-bold text-slate-900">{row.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}