// ==========================================
// EXTRA PACK - Global State (Zustand)
// ==========================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Order } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.product.promotion
            ? i.product.price * (1 - i.product.promotion / 100)
            : i.product.price;
          return sum + price * i.quantity;
        }, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "extrapack-cart" }
  )
);

// ── APP STORE ─────────────────────────────────────────────
interface AppStore {
  darkMode: boolean;
  toggleDarkMode: () => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    { name: "extrapack-app" }
  )
);
