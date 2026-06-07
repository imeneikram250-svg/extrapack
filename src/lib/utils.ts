// ==========================================
// EXTRA PACK - Utilitaires
// ==========================================
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-DZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + " DA";
};

export const generateOrderNumber = (): string => {
  const date = format(new Date(), "yyyyMMdd");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `EP-${date}-${random}`;
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "dd MMM yyyy à HH:mm", { locale: fr });
};

export const getDiscountedPrice = (price: number, promotion?: number): number => {
  if (!promotion) return price;
  return price * (1 - promotion / 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    "NOUVELLE COMMANDE": "bg-blue-100 text-blue-800",
    "CONFIRMÉE": "bg-purple-100 text-purple-800",
    "EN PRÉPARATION": "bg-yellow-100 text-yellow-800",
    "EXPÉDIÉE": "bg-orange-100 text-orange-800",
    "LIVRÉE": "bg-green-100 text-green-800",
    "RETOURNÉE": "bg-red-100 text-red-800",
    "ANNULÉE": "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    "NOUVELLE COMMANDE": "🆕",
    "CONFIRMÉE": "✅",
    "EN PRÉPARATION": "📦",
    "EXPÉDIÉE": "🚚",
    "LIVRÉE": "🎉",
    "RETOURNÉE": "↩️",
    "ANNULÉE": "❌",
  };
  return icons[status] || "📋";
};
