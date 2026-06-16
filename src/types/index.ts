// ==========================================
// EXTRA PACK - Types mis à jour (Variantes + Livraison)
// ==========================================

export interface ProductVariant {
  name: string;        // "Noir Corbeau"
  color: string;       // "#0a0a0a"
  stock: number;       // 10
  images: string[];    // photos spécifiques à cette variante
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;           // stock total (ou stock si pas de variantes)
  images: string[];        // photos principales
  status: "Actif" | "Inactif";
  promotion?: number;
  sold?: number;
  variants?: ProductVariant[]; // undefined = pas de variantes
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

// Livraison par wilaya (domicile + bureau)
export interface WilayaDelivery {
  wilaya: string;
  domicile: number;   // frais livraison à domicile
  bureau: number;     // frais stop desk / bureau
}

export type DeliveryType = "domicile" | "bureau";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
  variant?: string;   // "Noir Corbeau" par exemple
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
    address?: string;      // adresse si domicile
    agenceZR?: string;     // agence si bureau
    deliveryType: DeliveryType;
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
  selectedVariant?: ProductVariant;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  deliveryType: DeliveryType;
  address?: string;
  agenceZR?: string;
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
