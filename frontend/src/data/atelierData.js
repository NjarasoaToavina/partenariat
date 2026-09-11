export const STATUT_STYLES = {
  Réalisé: "bg-emerald-50 text-emerald-600",
  Planifié: "bg-sky-50 text-sky-600",
};

export const CAMPUS_STYLES = {
  ESMIA: "bg-sky-50 text-sky-700",
  BEATI: "bg-emerald-50 text-emerald-700",
};

export const ATELIERS = [
  { id: 1, date: "20/05/2025", time: "09:00-12:00", campus: "ESMIA", classe: "2e année", filiere: "Informatique", groupes: 2, contenu: "Introduction à l'intelligence artificielle", intervenant: "Département Informatique", statut: "Réalisé" },
  { id: 2, date: "27/05/2025", time: "14:00-17:00", campus: "BEATI", classe: "3e année", filiere: "Réseaux & Télécoms", groupes: 2, contenu: "Cybersécurité : bonnes pratiques", intervenant: "Entreprise ABC", statut: "Planifié" },
  { id: 3, date: "03/06/2025", time: "09:00-12:00", campus: "ESMIA", classe: "1e année", filiere: "Génie Logiciel", groupes: 2, contenu: "Bases de données et SQL", intervenant: "Département Génie Logiciel", statut: "Planifié" },
  { id: 4, date: "10/06/2025", time: "14:00-17:00", campus: "BEATI", classe: "2e année", filiere: "Électronique", groupes: 2, contenu: "Introduction aux systèmes embarqués", intervenant: "Entreprise XYZ", statut: "Planifié" },
  { id: 5, date: "17/06/2025", time: "09:00-12:00", campus: "ESMIA", classe: "3e année", filiere: "IA & Data Science", groupes: 2, contenu: "Machine Learning pratique", intervenant: "Département Informatique", statut: "Réalisé" },
  { id: 6, date: "24/06/2025", time: "14:00-17:00", campus: "BEATI", classe: "1e année", filiere: "Télécoms", groupes: 2, contenu: "Réseaux de base et configuration", intervenant: "Entreprise DEF", statut: "Planifié" },
  { id: 7, date: "01/07/2025", time: "09:00-12:00", campus: "ESMIA", classe: "2e année", filiere: "Génie Logiciel", groupes: 3, contenu: "Tests unitaires et intégration continue", intervenant: "Département Génie Logiciel", statut: "Planifié" },
  { id: 8, date: "08/07/2025", time: "14:00-17:00", campus: "BEATI", classe: "3e année", filiere: "Réseaux & Télécoms", groupes: 2, contenu: "Cloud computing et virtualisation", intervenant: "Entreprise ABC", statut: "Réalisé" },
  { id: 9, date: "15/07/2025", time: "09:00-12:00", campus: "ESMIA", classe: "1e année", filiere: "Informatique", groupes: 2, contenu: "Algorithmique avancée", intervenant: "Département Informatique", statut: "Planifié" },
  { id: 10, date: "22/07/2025", time: "14:00-17:00", campus: "BEATI", classe: "2e année", filiere: "Électronique", groupes: 2, contenu: "Capteurs et acquisition de données", intervenant: "Entreprise XYZ", statut: "Planifié" },
  { id: 11, date: "29/07/2025", time: "09:00-12:00", campus: "ESMIA", classe: "3e année", filiere: "IA & Data Science", groupes: 2, contenu: "Deep Learning et réseaux de neurones", intervenant: "Entreprise DEF", statut: "Réalisé" },
  { id: 12, date: "05/08/2025", time: "14:00-17:00", campus: "BEATI", classe: "1e année", filiere: "Télécoms", groupes: 2, contenu: "Protocoles réseau avancés", intervenant: "Département Génie Logiciel", statut: "Planifié" },
];

export function getAtelierStats(ateliers) {
  const realise = ateliers.filter((a) => a.statut === "Réalisé").length;
  const planifie = ateliers.filter((a) => a.statut === "Planifié").length;
  return { realise, planifie, total: ateliers.length };
}