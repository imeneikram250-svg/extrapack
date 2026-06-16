"use client";
// ==========================================
// EXTRA PACK - Formulaire Commande (Variantes + Livraison domicile/bureau)
// ==========================================
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiUser, FiPhone, FiMapPin, FiLoader,
  FiCheckCircle, FiHome, FiPackage
} from "react-icons/fi";
import { Product, WilayaDelivery, OrderFormData, DeliveryType, ProductVariant } from "@/types";
import { formatPrice, getDiscountedPrice, generateOrderNumber } from "@/lib/utils";
import { useAppStore, useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface OrderItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
}

export function OrderModal({ isOpen, onClose, items }: Props) {
  const router = useRouter();
  const { setLastOrder } = useAppStore();
  const { clearCart } = useCartStore();

  const [wilayas, setWilayas] = useState<WilayaDelivery[]>([]);
  const [loadingZones, setLoadingZones] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const [form, setForm] = useState<OrderFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    wilaya: "",
    deliveryType: "domicile",
    address: "",
    agenceZR: "",
    notes: "",
  });

  const selectedWilaya = wilayas.find((w) => w.wilaya === form.wilaya);
  const deliveryFee = selectedWilaya
    ? form.deliveryType === "domicile"
      ? selectedWilaya.domicile
      : selectedWilaya.bureau
    : 0;

  const productTotal = (items || []).reduce((sum, item) => {
    const price = getDiscountedPrice(item.product.price, item.product.promotion);
    return sum + price * item.quantity;
  }, 0);

  const total = productTotal + deliveryFee;

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const isFormValid =
    form.firstName &&
    form.lastName &&
    form.phone.length >= 9 &&
    form.wilaya &&
    (form.deliveryType === "domicile" ? form.address : true);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setSubmitting(true);

    try {
      const orderItems = (items || []).map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: getDiscountedPrice(item.product.price, item.product.promotion),
        totalPrice: getDiscountedPrice(item.product.price, item.product.promotion) * item.quantity,
        image: item.selectedVariant?.images?.[0] || item.product.images?.[0],
        variant: item.selectedVariant?.name,
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
            deliveryType: form.deliveryType,
            address: form.deliveryType === "domicile" ? form.address : undefined,
            agenceZR: form.deliveryType === "bureau" ? form.agenceZR : undefined,
          },
          items: orderItems,
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
            deliveryType: form.deliveryType,
            address: form.address,
            agenceZR: form.agenceZR,
          },
          items: orderItems,
          productPrice: productTotal,
          deliveryFee,
          total,
          status: "NOUVELLE COMMANDE",
        });

        clearCart();
        setStep("success");
        setTimeout(() => {
          onClose();
          router.push(`/confirmation?order=${data.orderNumber}`);
        }, 2000);
      } else {
        toast.error("Erreur lors de la commande. Réessayez.");
      }
    } catch {
      toast.error("Erreur de connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 30 }}
          className="relative w-full sm:max-w-lg bg-[var(--bg-primary)] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {step === "success" ? (
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
                Commande envoyée ! 🎉
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Nous vous contacterons très prochainement.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-primary)] rounded-t-3xl z-10">
                <h2 className="font-display font-bold text-xl">🛍️ Passer la commande</h2>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-secondary)]">
                  <FiX size={20} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Récapitulatif produits */}
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-4 space-y-3">
                  <p className="font-semibold text-xs text-[var(--text-secondary)] uppercase tracking-wide">
                    Récapitulatif
                  </p>
                  {(items || []).map((item, i) => {
                    const price = getDiscountedPrice(item.product.price, item.product.promotion);
                    const img = item.selectedVariant?.images?.[0] || item.product.images?.[0];
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          {img ? (
                            <Image src={img} alt={item.product.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">🛍️</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-[var(--text-primary)]">
                            {item.product.name}
                          </p>
                          {item.selectedVariant && (
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-200"
                                style={{ backgroundColor: item.selectedVariant.color }}
                              />
                              <span className="text-xs text-[var(--text-secondary)]">
                                {item.selectedVariant.name}
                              </span>
                            </div>
                          )}
                          <p className="text-xs text-[var(--text-secondary)]">Qté: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-brand-500">
                          {formatPrice(price * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Infos client */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm flex items-center gap-2 text-[var(--text-primary)]">
                    <FiUser size={16} className="text-brand-500" /> Vos informations
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">Nom *</label>
                      <input name="lastName" value={form.lastName} onChange={handleChange}
                        placeholder="Benali" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">Prénom *</label>
                      <input name="firstName" value={form.firstName} onChange={handleChange}
                        placeholder="Amira" className="input-field text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 flex items-center gap-1">
                      <FiPhone size={12} /> Téléphone *
                    </label>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="0550 000 000" type="tel" className="input-field text-sm" />
                  </div>
                </div>

                {/* Livraison */}
                <div className="space-y-3">
                  <p className="font-semibold text-sm flex items-center gap-2 text-[var(--text-primary)]">
                    <FiMapPin size={16} className="text-brand-500" /> Livraison
                  </p>

                  {/* Wilaya */}
                  {loadingZones ? (
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] py-2">
                      <FiLoader size={16} className="animate-spin" /> Chargement...
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">Wilaya *</label>
                      <select name="wilaya" value={form.wilaya} onChange={handleChange}
                        className="input-field text-sm">
                        <option value="">Sélectionner une wilaya</option>
                        {wilayas.map((w) => (
                          <option key={w.wilaya} value={w.wilaya}>
                            {w.wilaya} — Domicile: {formatPrice(w.domicile)} | Bureau: {formatPrice(w.bureau)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Type de livraison */}
                  {form.wilaya && selectedWilaya && (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setForm((f) => ({ ...f, deliveryType: "domicile" }))}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.deliveryType === "domicile"
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-[var(--border)] hover:border-brand-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FiHome size={16} className={form.deliveryType === "domicile" ? "text-brand-500" : "text-[var(--text-secondary)]"} />
                          <span className={`text-xs font-semibold ${form.deliveryType === "domicile" ? "text-brand-500" : "text-[var(--text-primary)]"}`}>
                            À domicile
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">
                          {formatPrice(selectedWilaya.domicile)}
                        </p>
                      </button>

                      <button
                        onClick={() => setForm((f) => ({ ...f, deliveryType: "bureau" }))}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          form.deliveryType === "bureau"
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-[var(--border)] hover:border-brand-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FiPackage size={16} className={form.deliveryType === "bureau" ? "text-brand-500" : "text-[var(--text-secondary)]"} />
                          <span className={`text-xs font-semibold ${form.deliveryType === "bureau" ? "text-brand-500" : "text-[var(--text-primary)]"}`}>
                            Stop Desk
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">
                          {formatPrice(selectedWilaya.bureau)}
                        </p>
                      </button>
                    </div>
                  )}

                  {/* Adresse ou Agence */}
                  {form.wilaya && form.deliveryType === "domicile" && (
                    <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                        Adresse complète *
                      </label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Rue, quartier, commune..."
                        className="input-field text-sm"
                      />
                    </div>
                  )}

                  

                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">
                      Notes (optionnel)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Instructions spéciales..."
                      rows={2}
                      className="input-field text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-4 border border-brand-200 dark:border-brand-800 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Sous-total</span>
                    <span className="font-medium">{formatPrice(productTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">
                      Livraison {form.deliveryType === "domicile" ? "🏠 domicile" : "🏢 stop desk"}
                    </span>
                    <span className="font-medium">
                      {form.wilaya ? formatPrice(deliveryFee) : "—"}
                    </span>
                  </div>
                  <div className="border-t border-brand-200 dark:border-brand-800 pt-2 flex justify-between">
                    <span className="font-bold text-[var(--text-primary)]">Total à payer</span>
                    <span className="font-display font-bold text-xl text-brand-500">
                      {form.wilaya ? formatPrice(total) : formatPrice(productTotal) + " + livraison"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] text-center pt-1">
                    💵 Paiement en espèces à la livraison uniquement
                  </p>
                </div>

                {/* Bouton */}
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || submitting}
                  className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <><FiLoader size={18} className="animate-spin" /> Envoi...</>
                  ) : (
                    <>🛍️ Confirmer — {form.wilaya ? formatPrice(total) : ""}</>
                  )}
                </button>

                <p className="text-xs text-center text-[var(--text-secondary)]">
                  Un agent vous contactera pour confirmer la livraison.
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
