"use client";
// ==========================================
// EXTRA PACK - Page Confirmation
// ==========================================
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { FiCheckCircle, FiTruck, FiPhone } from "react-icons/fi";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { lastOrder } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
      >
        <FiCheckCircle size={48} className="text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 text-[var(--text-primary)]">
          Commande confirmée ! 🎉
        </h1>
        <p className="text-[var(--text-secondary)] mb-2">
          Votre commande a bien été enregistrée.
        </p>
        {orderNumber && (
          <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-full px-4 py-2 my-4">
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
              N° {orderNumber}
            </span>
          </div>
        )}
      </motion.div>

      {lastOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 text-left mt-8 mb-8 space-y-4"
        >
          <h3 className="font-semibold text-[var(--text-primary)]">Détails de votre commande</h3>

          {lastOrder.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">
                {item.productName} × {item.quantity}
              </span>
              <span className="font-medium text-[var(--text-primary)]">
                {formatPrice(item.totalPrice)}
              </span>
            </div>
          ))}

          <div className="border-t border-[var(--border)] pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Livraison vers {lastOrder.customer.commune}</span>
              <span className="text-[var(--text-primary)]">{formatPrice(lastOrder.deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total à payer</span>
              <span className="text-brand-500 text-lg">{formatPrice(lastOrder.total)}</span>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-xl p-3 space-y-1">
            <p className="text-xs text-[var(--text-secondary)] font-medium">Livraison à :</p>
            <p className="text-sm text-[var(--text-primary)] font-semibold">
              {lastOrder.customer.firstName} {lastOrder.customer.lastName}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {lastOrder.customer.commune}, {lastOrder.customer.wilaya}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{lastOrder.customer.phone}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {/* Steps */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <FiCheckCircle size={20} />, title: "Commande reçue", desc: "Votre commande est enregistrée", done: true },
            { icon: <FiPhone size={20} />, title: "Confirmation", desc: "Nous vous appelons sous 24h", done: false },
            { icon: <FiTruck size={20} />, title: "Livraison", desc: "Livraison en 24–72h", done: false },
          ].map((step, i) => (
            <div key={i} className={`card p-3 text-center ${step.done ? "border-green-300 dark:border-green-700" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${step.done ? "bg-green-100 dark:bg-green-900/30 text-green-500" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
                {step.icon}
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">{step.title}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{step.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-[var(--text-secondary)] bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
          💡 Un agent Extra Pack vous contactera par téléphone pour confirmer votre commande et la date de livraison.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-secondary flex-1 text-center">
            Retour à l'accueil
          </Link>
          <Link href="/catalogue" className="btn-primary flex-1 text-center">
            Continuer mes achats
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
