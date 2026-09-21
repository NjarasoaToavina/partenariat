import {
  Home,
  Users,
  FileText,
  MonitorPlay,
  ClipboardCheck,
  File,
  Network,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Tableau de bord", icon: Home, path: "/dashboard" },
  { label: "Partenaires", icon: Users, path: "/partenaires" },
  { label: "Propositions", icon: FileText, path: "/propositions" },
  { label: "Activités", icon: MonitorPlay, path: "/activites" },
  { label: "Ateliers", icon: ClipboardCheck, path: "/ateliers" },
  { label: "Documents", icon: File, path: "/documents" },
  { label: "Relations", icon: Network, path: "/relations" },
];