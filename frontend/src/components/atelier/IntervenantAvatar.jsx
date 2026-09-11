const AVATAR_COLORS = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-orange-500",
  "bg-teal-600",
  "bg-violet-600",
  "bg-rose-600",
];

function initials(name) {
  const words = name.replace("Département", "D.").replace("Entreprise", "ENT").split(" ");
  if (name.startsWith("Entreprise")) return "ENT";
  return words
    .filter((w) => w && w !== "D.")
    .map((w) => w[0])
    .join(".")
    .toUpperCase()
    .slice(0, 3) || "D." + words[1]?.[0];
}

function colorFor(name) {
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function IntervenantAvatar({ name }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`w-8 h-8 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${colorFor(
          name
        )}`}
      >
        {initials(name)}
      </div>
      <span className="text-sm text-slate-700">{name}</span>
    </div>
  );
}