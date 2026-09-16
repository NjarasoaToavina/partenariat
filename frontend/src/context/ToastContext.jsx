import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ToastContainer from "../components/common/ToastContainer";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message, { title, duration = 4000 } = {}) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, type, message, title }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const success = useCallback((message, options) => show("success", message, options), [show]);
  const error = useCallback((message, options) => show("error", message, options), [show]);
  const warning = useCallback((message, options) => show("warning", message, options), [show]);
  const info = useCallback((message, options) => show("info", message, options), [show]);

  // Mémorisé : sans ça, "value" serait un nouvel objet à chaque render de
  // ToastProvider, ce qui casserait l'identité de "toast" pour tout composant
  // qui le met dans un tableau de dépendances (useEffect/useCallback).
  const value = useMemo(
    () => ({ success, error, warning, info, dismiss }),
    [success, error, warning, info, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast doit être utilisé à l'intérieur de <ToastProvider>");
  }
  return ctx;
}