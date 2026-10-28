export const CAMPUS_ROWS = [
  {
    key: "esmia",
    name: "ESMIA",
    badge: "ESMIA",

    prospecte: 1,
    cours: 2,
    attente: 3,
    finalisation: 4,
    signe: 5,
    officieux: 6,
    renouvele: 7,

    total: 28,
  },
  {
    key: "beati",
    name: "BEATI",
    badge: "BEATI",

    prospecte: 1,
    cours: 1,
    attente: 1,
    finalisation: 1,
    signe: 1,
    officieux: 1,
    renouvele: 1,

    total: 7,
  },
];

// Libellés des statuts
export const STATUS_LABELS = {
  prospecte: "Prospecté",
  cours: "En cours",
  attente: "En attente de validation",
  finalisation: "Finalisation",
  signe: "Signé",
  officieux: "Officieux",
  renouvele: "Renouvelé",
};

// Couleurs des statuts
export const STATUS_COLORS = {
  "Prospecté": "#64748b",
  "En cours": "#f59e0b",
  "En attente de validation": "#ef4444",
  "Finalisation": "#06b6d4",
  "Signé": "#2563eb",
  "Officieux": "#8b5cf6",
  "Renouvelé": "#22c55e",
};

// Préparation des données pour les graphiques Donut
export function statusData(row) {
  return Object.entries(STATUS_LABELS).map(([key, label]) => ({
    name: label,
    value: Number(row[key] ?? 0),
  }));
}