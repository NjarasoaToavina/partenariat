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
  { label: "Tableau de bord", icon: Home, path: "/dashboard", permission:"dashboard.view" },
  { label: "Partenaires", icon: Users, path: "/partenaires", permission:"partenariats.view" },
  { label: "Propositions", icon: FileText, path: "/propositions", permission:"propositions.view" },
  { label: "Activités", icon: MonitorPlay, path: "/activites", permission:"activites.view" },
  { label: "Ateliers", icon: ClipboardCheck, path: "/ateliers", permission:"ateliers.view" },
  { label: "Documents", icon: File, path: "/documents", permission:"documents.view" },
  { label: "Relations", icon: Network, path: "/relations", permission:"publications.view" },
];

export const getDefaultRoute = (permissions = []) => {
    const accessibleItem = NAV_ITEMS.find(
        (item) => permissions.includes(item.permission)
    );

    return accessibleItem?.path || "/403";
};