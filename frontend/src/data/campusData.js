export const CAMPUS_ROWS = [
  {
    key: "esmia",
    name: "ESMIA",
    badge: "ESMIA",
    signe: 12,
    renouvele: 12,
    enCours: 12,
    officieux: 12,
    total: 48,
  },
  {
    key: "beati",
    name: "BEATI",
    badge: "BEATI",
    signe: 12,
    renouvele: 12,
    enCours: 12,
    officieux: 12,
    total: 48,
  },
];

export const STATUS_COLORS = {
  Signé: "#2563eb",
  Renouvelé: "#22c55e",
  "En cours": "#f59e0b",
  Officieux: "#8b5cf6",
};

export function statusData(row) {
  return [
    { name: "Signé", value: row.signe },
    { name: "Renouvelé", value: row.renouvele },
    { name: "En cours", value: row.enCours },
    { name: "Officieux", value: row.officieux },
  ];
}