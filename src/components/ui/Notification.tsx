"use client";
// ==========================================
// EXTRA PACK - Notification composant réutilisable
// ==========================================
import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

type NotifType = "success" | "error" | "info" | "warning";

interface NotifProps {
  type: NotifType;
  title: string;
  message?: string;
  onClose?: () => void;
}

const icons = {
  success: <FiCheckCircle className="text-green-500" size={20} />,
  error: <FiAlertCircle className="text-red-500" size={20} />,
  info: <FiInfo className="text-blue-500" size={20} />,
  warning: <FiAlertCircle className="text-yellow-500" size={20} />,
};

const colors = {
  success: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
  error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20",
  info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
  warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
};

export function Notification({ type, title, message, onClose }: NotifProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`flex items-start gap-3 p-4 rounded-2xl border ${colors[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--text-primary)]">{title}</p>
        {message && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <FiX size={14} className="text-[var(--text-secondary)]" />
        </button>
      )}
    </motion.div>
  );
}

// ── Badge composant ───────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success" | "warning" | "error" | "neutral";
}

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  const styles = {
    brand: "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300",
    success: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    neutral: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}
