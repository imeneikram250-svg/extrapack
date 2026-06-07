// ==========================================
// EXTRA PACK - Types TypeScript
// ==========================================

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  status: "Actif" | "Inactif";
  promotion?: number; // % de réduction
  sold?: number;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Wilaya {
  id: string;
  name: string;
  communes: Commune[];
}

export interface Commune {
  name: string;
  deliveryFee: number;
}

export interface DeliveryZone {
  wilaya: string;
  commune: string;
  fee: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    wilaya: string;
    commune: string;
  };
  items: OrderItem[];
  productPrice: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
}

export type OrderStatus =
  | "NOUVELLE COMMANDE"
  | "CONFIRMÉE"
  | "EN PRÉPARATION"
  | "EXPÉDIÉE"
  | "LIVRÉE"
  | "RETOURNÉE"
  | "ANNULÉE";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  notes?: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProductsSold: number;
  outOfStockProducts: number;
  newOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatar?: string;
}
