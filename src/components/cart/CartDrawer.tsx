"use client";
// ==========================================
// EXTRA PACK - Cart Drawer
// ==========================================
import { useCartStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[var(--bg-primary)] shadow-2xl flex flex-col border-l border-[var(--border)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FiShoppingBag size={20} className="text-brand-500" />
                <h2 className="font-display font-bold text-lg">Mon Panier</h2>
                {items.length > 0 && (
                  <span className="bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
                  <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-3xl">
                    🛍️
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">Votre panier est vide</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      Ajoutez des produits pour continuer
                    </p>
                  </div>
                  <Link
                    href="/catalogue"
                    onClick={closeCart}
                    className="btn-primary text-sm"
                  >
                    Voir le catalogue
                  </Link>
                </div>
              ) : (
                items.map((item) => {
                  const price = getDiscountedPrice(item.product.price, item.product.promotion);
                  return (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[var(--text-primary)] line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-brand-500 font-bold text-sm mt-0.5">
                          {formatPrice(price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-colors"
                          >
                            <FiMinus size={10} />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.stock))}
                            className="w-6 h-6 rounded-full border border-[var(--border)] flex items-center justify-center hover:border-brand-500 hover:text-brand-500 transition-colors"
                          >
                            <FiPlus size={10} />
                          </button>
                          <span className="ml-auto text-xs font-bold text-[var(--text-primary)]">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors self-start"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)] text-sm">Sous-total</span>
                  <span className="font-bold text-lg text-[var(--text-primary)]">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] text-center">
                  + Frais de livraison calculés à la commande
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center block"
                >
                  Commander maintenant
                </Link>
                <button
                  onClick={closeCart}
                  className="btn-outline w-full text-center text-sm"
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
