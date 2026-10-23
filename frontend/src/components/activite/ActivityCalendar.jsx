import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { JOURS, getEtat } from "../../data/activiteData";
import { buildMonthGrid, dayKey, fmtTime } from "./activiteUtils";

export default function ActivityCalendar({
  cursor,
  byDay,
  loading,
  onMonthChange,
  onToday,
  onCreate,
  onEdit,
}) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const grid = buildMonthGrid(year, month);
  const todayKey = dayKey(new Date());

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <h2 className="text-base font-semibold capitalize text-slate-800">
          {cursor.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={onToday}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => onMonthChange(-1)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onMonthChange(1)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Mois suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
            <Loader2 size={28} className="animate-spin text-[#0065CD]" />
          </div>
        )}

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-500">
          {JOURS.map((j) => (
            <div key={j} className="py-2">
              {j}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {grid.map((day) => {
            const key = dayKey(day);
            const items = byDay[key] ?? [];
            const inMonth = day.getMonth() === month;
            const isToday = key === todayKey;

            return (
              <div
                key={key}
                onClick={() => onCreate(day)}
                className={`min-h-[64px] cursor-pointer border-b border-r border-slate-100 p-1.5 transition-colors hover:bg-slate-50 sm:min-h-[110px] ${
                  inMonth ? "bg-white" : "bg-slate-50/60"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-[#0065CD] text-white"
                      : inMonth
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {day.getDate()}
                </span>

                {/* Desktop : pastilles avec libellé */}
                <div className="mt-1 hidden flex-col gap-1 sm:flex">
                  {items.slice(0, 3).map((a) => (
                    <button
                      key={a.id_activ}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(a);
                      }}
                      title={a.sujet}
                      className={`truncate rounded px-1.5 py-0.5 text-left text-xs font-medium ${
                        getEtat(a.etat_activ).chip
                      }`}
                    >
                      {fmtTime(a.date_debut_activ)} {a.sujet}
                    </button>
                  ))}
                  {items.length > 3 && (
                    <span className="px-1 text-xs text-slate-500">
                      +{items.length - 3} autre{items.length - 3 > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Mobile : simples points, le détail est dans la liste */}
                <div className="mt-1 flex flex-wrap gap-0.5 sm:hidden">
                  {items.slice(0, 4).map((a) => (
                    <span
                      key={a.id_activ}
                      className={`h-1.5 w-1.5 rounded-full ${
                        getEtat(a.etat_activ).dot
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}