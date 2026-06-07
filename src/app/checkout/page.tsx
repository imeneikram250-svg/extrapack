"use client";
// ==========================================
// EXTRA PACK - Page Checkout
// ==========================================
import { useCartStore } from "@/lib/store";
import { OrderModal } from "@/components/product/OrderModal";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Auto-open modal if cart has items
    if (items.length > 0) setOpen(true);
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-6xl mb-4">🛍️</span>
        <h1 className="font-display text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Ajoutez des produits avant de commander
        </p>
        <Link href="/catalogue" className="btn-primary">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Préparation de votre commande...</p>
        </div>
      </div>
      <OrderModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
