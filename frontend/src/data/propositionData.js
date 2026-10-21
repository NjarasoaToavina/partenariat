import { ShieldCheck, Database, TrendingUp, Lightbulb, Building2, Settings, GraduationCap } from "lucide-react";

export const PROPOSITION_STATUS_LABELS = {
  attente: "En attente",
  valide: "Validé",
  refuse: "Refusé",
};

// "En attente" en plein (comme sur la capture), les deux autres en pastel
export const PROPOSITION_STATUS_STYLES = {
  attente: "bg-amber-500 text-white",
  valide: "bg-emerald-50 text-emerald-600",
  refuse: "bg-rose-50 text-rose-500",
};

export const PROPOSITION_STATUS_DOT = {
  attente: "bg-amber-500",
  valide: "bg-emerald-500",
  refuse: "bg-rose-500",
};

// Propositions d'activités faites par les partenaires
export const ACTIVITY_PROPOSALS = [
  {
    id: "ACT-1",
    icon: ShieldCheck,
    iconBg: "bg-blue-600",
    titre: "Conférence Cybersécurité",
    source: "Entreprise ABC",
    statut: "attente",
    date: "20/05/2025",
    heure: "09:00 - 11:00",
    description: "Conférencier disponible pour échange.",
    proposeLe: "12/05/2025",
  },
  {
    id: "ACT-2",
    icon: Database,
    iconBg: "bg-emerald-600",
    titre: "Workshop Data Science",
    source: "Partenaire DEF",
    statut: "valide",
    date: "27/05/2025",
    heure: "10:00 - 12:00",
    description: "Atelier pratique sur l'analyse de données.",
    proposeLe: "10/05/2025",
  },
  {
    id: "ACT-3",
    icon: TrendingUp,
    iconBg: "bg-red-500",
    titre: "Visite Industrielle",
    source: "Entreprise XYZ",
    statut: "refuse",
    date: "22/05/2025",
    heure: "14:00 - 16:00",
    description: "Visite du site de production et échanges avec les équipes.",
    proposeLe: "11/05/2025",
  },
  {
    id: "ACT-4",
    icon: Lightbulb,
    iconBg: "bg-amber-500",
    titre: "Hackathon Innovation",
    source: "Entreprise ABC",
    statut: "attente",
    date: "30/05/2025",
    heure: "09:00 - 17:00",
    description: "Journée hackathon ouverte aux étudiants en informatique.",
    proposeLe: "13/05/2025",
  },
];

// Propositions de nouveaux partenaires faites par les services de l'ESMIA
export const PARTNER_PROPOSALS = [
  {
    id: "PART-1",
    icon: Building2,
    iconBg: "bg-sky-600",
    titre: "Tech Innov Solutions",
    source: "Service Recherche & Innovation",
    statut: "attente",
    date: "10/05/2025",
    heure: null,
    description: "Partenaire potentiel dans le domaine de l'IA et du cloud.",
    proposeLe: "10/05/2025",
  },
  {
    id: "PART-2",
    icon: Settings,
    iconBg: "bg-violet-600",
    titre: "Global Industry SARL",
    source: "Service Stages & Carrières",
    statut: "validee",
    date: "09/05/2025",
    heure: null,
    description: "Intéressé pour accueillir nos étudiants en stage.",
    proposeLe: "09/05/2025",
  },
  {
    id: "PART-3",
    icon: GraduationCap,
    iconBg: "bg-red-500",
    titre: "EduTech Partners",
    source: "Service Formation Continue",
    statut: "refuse",
    date: "08/05/2025",
    heure: null,
    description: "Ne correspond pas à notre stratégie actuelle.",
    proposeLe: "08/05/2025",
  },
];

export const mapProposition = (proposition) => {
  const date = new Date(proposition.date_propos);

  return {
    id: proposition.id_propos,

    icon: Building2,
    iconBg: "bg-sky-600",

    titre: proposition.part_propos,

    source: proposition.user?.nom_service
      ? `Service ${proposition.user.nom_service}`
      : proposition.user?.name ?? "Non renseigné",

    statut: proposition.etat_propos,

    date: date.toLocaleDateString("fr-FR"),

    heure: date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),

    description: proposition.commentaire ?? "Aucun commentaire",

    proposeLe: date.toLocaleDateString("fr-FR"),

    // Informations supplémentaires
    campus: proposition.campus_propos,
    contact: proposition.contact_propos,
    proposePar: proposition.user?.name ?? null,
  };
};
