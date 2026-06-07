// ==========================================
// EXTRA PACK - Firebase Firestore Service
// ==========================================
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  getDoc,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "./firebase";
import { Order, OrderStatus } from "@/types";

const ORDERS_COLLECTION = "orders";

// ── CRÉER UNE COMMANDE ────────────────────────────────────
export async function createOrderInFirestore(order: Omit<Order, "id">): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

// ── RÉCUPÉRER TOUTES LES COMMANDES ────────────────────────
export async function getAllOrders(limitCount = 100): Promise<Order[]> {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

// ── RÉCUPÉRER UNE COMMANDE ────────────────────────────────
export async function getOrderById(id: string): Promise<Order | null> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Order;
}

// ── METTRE À JOUR LE STATUT ───────────────────────────────
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, id);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

// ── STATISTIQUES ADMIN ────────────────────────────────────
export async function getAdminStats() {
  const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
  const orders = snapshot.docs.map((doc) => doc.data() as Order);

  const totalRevenue = orders
    .filter((o) => o.status === "LIVRÉE")
    .reduce((sum, o) => sum + o.total, 0);

  const totalProductsSold = orders
    .filter((o) => o.status === "LIVRÉE")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return {
    totalOrders: orders.length,
    totalRevenue,
    totalProductsSold,
    newOrders: orders.filter((o) => o.status === "NOUVELLE COMMANDE").length,
    confirmedOrders: orders.filter((o) => o.status === "CONFIRMÉE").length,
    shippedOrders: orders.filter((o) => o.status === "EXPÉDIÉE").length,
    deliveredOrders: orders.filter((o) => o.status === "LIVRÉE").length,
  };
}

// ── RECHERCHE COMMANDES ───────────────────────────────────
export async function searchOrders(searchTerm: string): Promise<Order[]> {
  const allOrders = await getAllOrders(500);
  const term = searchTerm.toLowerCase();
  return allOrders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(term) ||
      o.customer.firstName.toLowerCase().includes(term) ||
      o.customer.lastName.toLowerCase().includes(term) ||
      o.customer.phone.includes(term)
  );
}
