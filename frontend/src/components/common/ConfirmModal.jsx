import { useEffect } from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import Spinner from "./Spinner";

const VARIANTS = {
  danger: {
    icon: AlertTriangle,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    confirmBtn: "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-400",
  },
  default: {
    icon: HelpCircle,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    confirmBtn: "bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-sky-400",
  },
};

export default function ConfirmModal({
  open,
  title = "Êtes-vous sûr ?",
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "default", // "default" | "danger"
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  // Empêche le scroll de la page derrière le modal, et permet de fermer avec Échap
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) onCancel?.();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isLoading, onCancel]);

  if (!open) return null;

  const { icon: Icon, iconBg, iconColor, confirmBtn } =
    VARIANTS[variant] || VARIANTS.default;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 px-4"
      onClick={() => !isLoading && onCancel?.()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
          <Icon size={24} className={iconColor} />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
        {message && (
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{message}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl py-2.5 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 text-white font-semibold text-sm rounded-xl py-2.5 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 ${confirmBtn}`}
          >
            {isLoading && <Spinner size={16} className="text-white" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}