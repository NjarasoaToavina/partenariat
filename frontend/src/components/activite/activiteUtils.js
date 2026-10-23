const pad = (n) => String(n).padStart(2, "0");

// "2026-10-20" (jour local)
export const dayKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// ISO de l'API -> valeur pour <input type="datetime-local">
export const toInputValue = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${dayKey(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// valeur de l'input -> ISO envoyé à l'API
export const toIso = (value) => new Date(value).toISOString();

export const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

// 42 cases (6 semaines), semaine commençant le lundi
export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from(
    { length: 42 },
    (_, i) => new Date(year, month, 1 - offset + i)
  );
}

// { "2026-10-20": [activité, ...] } — une activité multi-jours apparaît chaque jour
export function groupByDay(activites) {
  const map = {};
  for (const a of activites) {
    const start = new Date(a.date_debut_activ);
    if (Number.isNaN(start.getTime())) continue;
    const rawEnd = a.date_fin_activ ? new Date(a.date_fin_activ) : start;
    const end = Number.isNaN(rawEnd.getTime()) ? start : rawEnd;

    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    for (let i = 0; d <= last && i < 62; i++) {
      (map[dayKey(d)] ||= []).push(a);
      d.setDate(d.getDate() + 1);
    }
  }
  for (const k in map) {
    map[k].sort(
      (x, y) => new Date(x.date_debut_activ) - new Date(y.date_debut_activ)
    );
  }
  return map;
}

// Activités qui commencent dans le mois donné, triées par date
export function filterByMonth(activites, year, month) {
  return activites
    .filter((a) => {
      const d = new Date(a.date_debut_activ);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort(
      (x, y) => new Date(x.date_debut_activ) - new Date(y.date_debut_activ)
    );
}