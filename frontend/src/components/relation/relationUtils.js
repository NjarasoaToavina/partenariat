import { STORAGE_URL } from "../../data/relationData";


// "publications/abc.jpg" -> "http://.../storage/publications/abc.jpg"
export const storageUrl = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${STORAGE_URL}/${path.replace(/^\/+/, "")}`;
};

export const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";

// "il y a 3 heures", "hier", ...
const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
const UNITS = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

export function timeAgo(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Math.round((date.getTime() - Date.now()) / 1000); // négatif = passé
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "à l'instant";
}

export const fmtFullDate = (iso) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const plural = (n, singular, pluriel = `${singular}s`) =>
  `${n} ${n > 1 ? pluriel : singular}`;

// Plus récentes d'abord
export const sortByDateDesc = (list) =>
  [...list].sort(
    (a, b) =>
      new Date(b.date_pub ?? b.created_at) - new Date(a.date_pub ?? a.created_at)
  );