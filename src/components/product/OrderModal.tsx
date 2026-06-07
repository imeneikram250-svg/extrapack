"use client";
// ==========================================
// EXTRA PACK - Formulaire de Commande (Modal)
// ==========================================
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiPhone, FiMapPin, FiLoader, FiCheckCircle } from "react-icons/fi";
import { Product, Wilaya, OrderFormData } from "@/types";
import { formatPrice, getDiscountedPrice, generateOrderNumber } from "@/lib/utils";
import { useAppStore, useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  quantity?: number;
}

export function OrderModal({ isOpen, onClose, product, quantity = 1 }: Props) {
  const router = useRouter();
  const { setLastOrder } = useAppStore();
  const { items: cartItems, clearCart } = useCartStore();

  // If no specific product, use cart items
  const orderItems = product
    ? [{ product, quantity }]
    : cartItems;

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");

  const [form, setForm] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    wilaya: "",
    commune: "",
    notes: "",
  });

  const [deliveryFee, setDeliveryFee] = useState(0);

  const selectedWilaya = wilayas.find((w) => w.name === form.wilaya);
  const communes = selectedWilaya?.communes || [];
  const selectedCommune = communes.find((c) => c.name === form.commune);

  const productTotal = orderItems.reduce((sum, item) => {
    const price = getDiscountedPrice(item.product.price, item.product.promotion);
    return sum + price * item.quantity;
  }, 0);

  const total = productTotal + deliveryFee;

  // Load delivery zones
  useEffect(() => {
    if (isOpen && wilayas.length === 0) {
      setLoadingZones(true);
      fetch("/api/delivery")
        .then((r) => r.json())
        .then((data) => {
          setWilayas(data.wilayas || []);
          setLoadingZones(false);
        })
        .catch(() => setLoadingZones(false));
    }
  }, [isOpen]);

  // Update delivery fee when commune changes
  useEffect(() => {
    if (selectedCommune) {
      setDeliveryFee(selectedCommune.deliveryFee);
    } else {
      setDeliveryFee(0);
    }
  }, [selectedCommune]);

  // Reset when wilaya changes
  useEffect(() => {
    setForm((f) => ({ ...f, commune: "" }));
  }, [form.wilaya]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    form.firstName &&
    form.lastName &&
    form.phone.length >= 9 &&
    form.wilaya &&
    form.commune;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setSubmitting(true);

    try {
      const items = orderItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: getDiscountedPrice(item.product.price, item.product.promotion),
        totalPrice: getDiscountedPrice(item.product.price, item.product.promotion) * item.quantity,
        image: item.product.images?.[0],
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            wilaya: form.wilaya,
            commune: form.commune,
          },
          items,
          productPrice: productTotal,
          deliveryFee,
          total,
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setLastOrder({
          id: data.orderId,
          orderNumber: data.orderNumber,
          date: new Date().toISOString(),
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            wilaya: form.wilaya,
            commune: form.commune,
          },
          items,
          productPrice: productTotal,
          deliveryFee,
          total,
          status: "NOUVELLE COMMANDE",
        });

        if (!product) clearCart(); // Clear cart if ordering from cart
        setStep("success");
        setTimeout(() => {
          onClose();
          router.push(`/confirmation?order=${data.orderNumber}`);
        }, 2000);
      } else {
        toast.error("Erreur lors de la commande. Réessayez.");
      }
    } catch (error) {
      toast.error("Erreur de connexion. Vérifiez votre internet.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.96 }}
          transition={{ type: "spring", damping: 30 }}
          className="relative w-full sm:max-w-lg bg-[var(--bg-primary)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {step === "success" ? (
            // Success state
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4"
              >
                <FiCheckCircle size={40} className="text-green-500" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold mb-2 text-[var(--text-primary)]">
                Commande envoyée !
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Nous vous contacterons très prochainement pour confirmer votre livraison.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)] rounded-t-3xl z-10">
                <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
                  🛍️ Passer la commande
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Order Summary */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 space-y-3">
                  <p className="font-semibold text-sm text-[var(--text-secondary)] uppercase tracking-wide">
                    Récapitulatif
                  </p>
                  {orderItems.map((item) => {
                    const price = getDiscountedPrice(item.product.price, item.product.promotion);
                    return (
                      <div key={item.product.id} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">🛍️</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-[var(--text-primary)]">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            Qté: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-brand-500 flex-shrink-0">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Form */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm flex items-center gap-2 text-[var(--text-primary)]">
                    <FiUser size={16} className="text-brand-500" />
                    Vos informations
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">Nom *</label>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Benali"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">Prénom *</label>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Amira"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                      <FiPhone size={12} /> Téléphone *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0550 000 000"
                      type="tel"
                      className="input-field text-sm"
                    />
                  </div>
                </div>

                {/* Delivery Form */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm flex items-center gap-2 text-[var(--text-primary)]">
                    <FiMapPin size={16} className="text-brand-500" />
                    Adresse de livraison
                  </p>

                  {loadingZones ? (
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] py-3">
                      <FiLoader size={16} className="animate-spin" />
                      Chargement des wilayas...
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Wilaya *</label>
                        <select
                          name="wilaya"
                          value={form.wilaya}
                          onChange={handleChange}
                          className="input-field text-sm"
                        >
                          <option value="">Sélectionner une wilaya</option>
                          {wilayas.map((w) => (
                            <option key={w.id} value={w.name}>{w.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs text-[var(--text-secondary)] mb-1 block">Commune *</label>
                        <select
                          name="commune"
                          value={form.commune}
                          onChange={handleChange}
                          disabled={!form.wilaya}
                          className="input-field text-sm disabled:opacity-50"
                        >
                          <option value="">
                            {form.wilaya ? "Sélectionner une commune" : "Choisissez d'abord une wilaya"}
                          </option>
                          {communes.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name} — {formatPrice(c.deliveryFee)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                      Notes (optionnel)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Instructions spéciales, repères..."
                      rows={2}
                      className="input-field text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Order Total */}
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-4 border border-brand-200 dark:border-brand-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Sous-total</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatPrice(productTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Frais de livraison</span>
                    <span className={`font-medium ${deliveryFee === 0 && form.commune ? "text-green-600" : "text-[var(--text-primary)]"}`}>
                      {form.commune
                        ? deliveryFee === 0 ? "Gratuit 🎉" : formatPrice(deliveryFee)
                        : "—"}
                    </span>
                  </div>
                  <div className="border-t border-brand-200 dark:border-brand-800 pt-2 flex justify-between">
                    <span className="font-bold text-[var(--text-primary)]">Total à payer</span>
                    <span className="font-display font-bold text-xl text-brand-500">
                      {form.commune ? formatPrice(total) : formatPrice(productTotal) + " + livraison"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] text-center pt-1">
                    💵 Paiement en espèces à la livraison uniquement
                  </p>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || submitting}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      🛍️ Confirmer la commande — {form.commune ? formatPrice(total) : ""}
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-[var(--text-secondary)]">
                  En confirmant, vous acceptez nos conditions. Un agent vous contactera pour confirmer la livraison.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
