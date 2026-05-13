/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const TOAST_TYPES = {
  success: { icon: CheckCircle, className: "bg-emerald-500 text-white" },
  error: { icon: AlertCircle, className: "bg-red-500 text-white" },
  info: { icon: Info, className: "bg-blue-500 text-white" }
};

let toastCallback = null;

function showToast(message, type = "success") {
  if (toastCallback) {
    toastCallback({ message, type });
  }
}

export function Toast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    toastCallback = addToast;
    return () => (toastCallback = null);
  }, [addToast]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => {
        const { icon: Icon, className } = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl ${className} animate-slide-in`}
          >
            <Icon size={18} />
            <span className="text-sm font-semibold">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-70">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { showToast };