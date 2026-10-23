// Adapte les clés aux valeurs réelles de `etat_activ` dans ta base Laravel.
export const ETATS = {
  planifie: {
    label: "Planifié",
    chip: "bg-blue-100 text-blue-800",
    dot: "bg-blue-500",
  },
  realise: {
    label: "Réalisé",
    chip: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
  },
  annule: {
    label: "Annulé",
    chip: "bg-red-100 text-red-800",
    dot: "bg-red-500",
  },
};

export const FALLBACK_ETAT = {
  label: "—",
  chip: "bg-slate-100 text-slate-700",
  dot: "bg-slate-400",
};

// Renvoie toujours un objet exploitable, même pour un état inconnu
export const getEtat = (key) =>
  ETATS[key] ?? { ...FALLBACK_ETAT, label: key || FALLBACK_ETAT.label };

export const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];