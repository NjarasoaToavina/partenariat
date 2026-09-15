import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    box: "bg-emerald-50 border-emerald-200",
    icon_color: "text-emerald-600",
    text: "text-emerald-800",
  },
  error: {
    icon: XCircle,
    box: "bg-rose-50 border-rose-200",
    icon_color: "text-rose-600",
    text: "text-rose-800",
  },
  warning: {
    icon: AlertTriangle,
    box: "bg-amber-50 border-amber-200",
    icon_color: "text-amber-600",
    text: "text-amber-800",
  },
  info: {
    icon: Info,
    box: "bg-sky-50 border-sky-200",
    icon_color: "text-sky-600",
    text: "text-sky-800",
  },
};

export default function Alert({ type = "info", title, message, onClose }) {
  const variant = VARIANTS[type] || VARIANTS.info;
  const Icon = variant.icon;

  return (
    <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 ${variant.box}`}>
      <Icon size={20} className={`shrink-0 mt-0.5 ${variant.icon_color}`} />
      <div className="min-w-0 flex-1">
        {title && <p className={`text-sm font-bold ${variant.text}`}>{title}</p>}
        {message && (
          <p className={`text-sm ${variant.text} ${title ? "mt-0.5" : ""}`}>
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`shrink-0 ${variant.icon_color} hover:opacity-70`}
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}