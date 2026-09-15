import { useEffect, useState } from "react";
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

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const variant = VARIANTS[toast.type] || VARIANTS.info;
  const Icon = variant.icon;

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(enter);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 w-80 max-w-[90vw] border rounded-xl shadow-lg px-4 py-3 transition-all duration-300 ${
        variant.box
      } ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
    >
      <Icon size={20} className={`shrink-0 mt-0.5 ${variant.icon_color}`} />
      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className={`text-sm font-bold ${variant.text}`}>{toast.title}</p>
        )}
        {toast.message && (
          <p className={`text-sm ${variant.text} ${toast.title ? "mt-0.5" : ""}`}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className={`shrink-0 ${variant.icon_color} hover:opacity-70`}
        aria-label="Fermer la notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}