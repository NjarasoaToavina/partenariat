export const DOC_STATUS_LABELS = {
  en_vivier: "En vivier",
  collecte: "Collecté",
  correction: "En correction",
};

export const DOC_STATUS_STYLES = {
  en_vivier: "bg-sky-50 text-sky-600",
  collecte: "bg-emerald-50 text-emerald-600",
  correction: "bg-amber-50 text-amber-600",
};

export const DOC_STATUS_HEX = {
  en_vivier: "#2563EB",
  collecte: "#16A34A",
  correction: "#F59E0B",
};

export const DOC_TYPE_LABELS = {
  cv: "CV",
  lettre: "Lettre de motivation",
};

export const DOC_TYPE_STYLES = {
  cv: "bg-sky-50 text-sky-600",
  lettre: "bg-emerald-50 text-emerald-600",
};

export const DOCUMENTS = [
  { id: "DOC-00096", nom_complet: "Jean Rakoto", matricule: "ESM2025001", filiere: "Informatique", niveau:"L2", type: "cv", fileName: "CV_Jean_Rakoto.pdf", fileSize: "245 Ko", sentAt: "24/05/2026 10:30", statut: "vivier" },
  { id: "DOC-00095", nom_complet: "Anna Ralaiarison", matricule: "ESM2025012", filiere: "Gestion", niveau:"L2", type: "lettre", fileName: "LM_Anna.pdf", fileSize: "198 Ko", sentAt: "22/05/2026 09:15", statut: "collecte" },
  { id: "DOC-00094", nom_complet: "Rado Mamy", matricule: "ESM2025034", filiere: "Génie Logiciel", niveau:"L3", type: "cv", fileName: "CV_Rado.pdf", fileSize: "312 Ko", sentAt: "20/05/2026 14:45", statut: "correction" },
  { id: "DOC-00093", nom_complet: "Tiana Soa", matricule: "ESM2025048", filiere: "Réseaux & Télécoms", niveau:"M1",type: "lettre", fileName: "LM_Tiana.pdf", fileSize: "205 Ko", sentAt: "18/05/2026 11:20", statut: "collecte" },
  { id: "DOC-00092", nom_complet: "Miora Faly", matricule: "ESM2025067", filiere: "Informatique", niveau:"L1", type: "cv", fileName: "CV_Miora.pdf", fileSize: "267 Ko", sentAt: "15/05/2026 08:50", statut: "vivier" },
  { id: "DOC-00091", nom_complet: "Lova Jean", matricule: "ESM2025073", filiere: "Génie Civil", niveau:"L3", type: "lettre", fileName: "LM_Lova.pdf", fileSize: "189 Ko", sentAt: "12/05/2026 16:30", statut: "correction" },
];

export function initialsOf(name) {
  // if (name) 
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export function computeDocKpis(documents) {
  const total = documents.length;
  const counts = Object.fromEntries(
    Object.keys(DOC_STATUS_LABELS).map((key) => [
      key,
      documents.filter((d) => d.status === key).length,
    ])
  );
  const percent = (key) => (total ? Math.round((counts[key] / total) * 100) : 0);
  return { total, counts, percent };
}