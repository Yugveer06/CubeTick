import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconCircleCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";

const ToastContext = createContext({});

const Toast = React.forwardRef(({ toast, onRemove }, ref) => {
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const remainingTimeRef = useRef(5000);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, remainingTimeRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onRemove]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsedTime = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsedTime);
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
    if (remainingTimeRef.current > 0) {
      timerRef.current = setTimeout(() => {
        onRemove(toast.id);
      }, remainingTimeRef.current);
    }
  };

  const getIcon = () => {
    switch (toast.variant) {
      case "success":
        return <IconCircleCheck className="h-5 w-5 text-green-600" />;
      case "error":
        return <IconAlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <IconAlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <IconInfoCircle className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getGradient = () => {
    switch (toast.variant) {
      case "success":
        return "from-green-400 to-green-600";
      case "error":
        return "from-red-400 to-red-600";
      case "warning":
        return "from-yellow-400 to-yellow-600";
      case "info":
        return "from-blue-400 to-blue-600";
      default:
        return "from-purple-400 to-pink-600";
    }
  };

  const getBg = () => {
    switch (toast.variant) {
      case "success":
        return "bg-green-50";
      case "error":
        return "bg-red-50";
      case "warning":
        return "bg-yellow-50";
      case "info":
        return "bg-blue-50";
      default:
        return "bg-slate-50";
    }
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md p-0.5 shadow-lg bg-gradient-to-r ${getGradient()}`}
    >
      <div className={`flex w-full flex-col overflow-hidden rounded-[5px] ${getBg()}`}>
        <div className="flex items-center space-x-4 p-4 pr-10">
          {getIcon()}
          <div className="flex-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => onRemove(toast.id)}
            className="absolute right-2 top-2 rounded-md p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-100">
          <motion.div
            className={`h-full w-full origin-left bg-gradient-to-r ${getGradient()}`}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: "linear" }}
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          />
        </div>
      </div>
    </motion.div>
  );
});

Toast.displayName = "Toast";

export function ToastContextProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = ({ title, description, variant = "success" }) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastContextProvider");
  }
  return context;
}
