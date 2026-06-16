"use client";
// ==========================================
// EXTRA PACK - Page Produit avec Variantes
// ==========================================
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag, FiMinus, FiPlus, FiChevronRight,
  FiStar, FiCheck, FiTruck
} from "react-icons/fi";
import { Product, ProductVariant } from "@/types";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import { ProductCard } from "@/components/product/ProductCard";
import { VariantSelector } from "@/components/product/VariantSelector";
import { OrderModal } from "@/components/product/OrderModal";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetailClient({ product, related }: Props) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderOpen, setOrderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "delivery" | "reviews">("desc");
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const { addItem } = useCartStore();

  const price = getDiscountedPrice(product.price, product.promotion);
  const hasVariants = product.variants && product.variants.length > 0;

  // Images affichées = images de la variante sélectionnée OU images du produit
  const displayImages =
    selectedVariant?.images?.length
      ? selectedVariant.images
      : product.images?.length
      ? product.images
      : [];

  // Stock disponible
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock;
  const inStock = availableStock > 0;

  // Changer variante → reset image index
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImg(0);
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Veuillez choisir une couleur");
      return;
    }
    if (!inStock) return;
    addItem(product, quantity);
    toast.success("Ajouté au panier !");
  };

  const handleOrder = () => {
    if (hasVariants && !selectedVariant) {
      toast.error("Veuillez choisir une couleur");
      return;
    }
    setOrderOpen(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-8">
          <Link href="/" className="hover:text-brand-500 transition-colors">Accueil</Link>
          <FiChevronRight size={14} />
          <Link href="/catalogue" className="hover:text-brand-500 transition-colors">Catalogue</Link>
          <FiChevronRight size={14} />
          <Link href={`/catalogue?category=${product.category}`} className="hover:text-brand-500 transition-colors">
            {product.category}
          </Link>
          <FiChevronRight size={14} />
          <span className="text-[var(--text-primary)] font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-secondary)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedVariant?.name}-${selectedImg}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  {displayImages[selectedImg] ? (
                    <Image
                      src={displayImages[selectedImg]}
                      alt={`${product.name} ${selectedVariant?.name || ""}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🛍️
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.promotion && product.promotion > 0 && (
                  <span className="badge-promo text-sm px-3 py-1.5">
                    -{product.promotion}%
                  </span>
                )}
                {!inStock && (
                  <span className="bg-gray-800/90 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    Rupture
                  </span>
                )}
              </div>

              {/* Couleur active badge */}
              {selectedVariant && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white/90 dark:bg-dark-800/90 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: selectedVariant.color }}
                  />
                  <span className="text-xs font-medium text-[var(--text-primary)]">
                    {selectedVariant.name}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {displayImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImg === i ? "border-brand-500" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt={`Vue ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="space-y-5">
            <div>
              <p className="text-brand-500 text-sm font-semibold uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => <FiStar key={i} size={14} className="fill-current" />)}
                </div>
                <span className="text-sm text-[var(--text-secondary)]">(4.9 · 47 avis)</span>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-3xl text-brand-500">
                  {formatPrice(price)}
                </span>
                {product.promotion && product.originalPrice && (
                  <>
                    <span className="text-lg text-[var(--text-secondary)] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                      -{product.promotion}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Sélecteur de variantes */}
            {hasVariants && product.variants && (
              <VariantSelector
                variants={product.variants}
                selected={selectedVariant}
                onSelect={handleVariantSelect}
              />
            )}

            {/* Stock */}
            <div className={`flex items-center gap-2 text-sm font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
              <div className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
              {inStock
                ? availableStock <= 5
                  ? `Plus que ${availableStock} disponible${availableStock > 1 ? "s" : ""} !`
                  : "En stock — Livraison rapide"
                : "Rupture de stock"}
            </div>

            {/* Quantité */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Quantité :</span>
                <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 py-2.5 font-semibold min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                    className="px-3 py-2.5 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOrder}
                disabled={!inStock || (hasVariants && !selectedVariant)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingBag size={20} />
                {!inStock ? "Rupture de stock" : hasVariants && !selectedVariant ? "Choisir une couleur" : "Commander maintenant"}
              </button>
              {inStock && (
                <button
                  onClick={handleAddToCart}
                  className="btn-secondary flex items-center justify-center gap-2 py-4 sm:px-6"
                >
                  Ajouter au panier
                </button>
              )}
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <FiTruck size={16} />, text: "Livraison domicile ou bureau" },
                { icon: <FiCheck size={16} />, text: "Paiement à la livraison" },
                { icon: "🔒", text: "Commande sécurisée" },
                { icon: "↩️", text: "Retour facile" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl p-2.5">
                  <span className="text-brand-500 flex-shrink-0">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-[var(--border)]">
          <div className="flex gap-6">
            {(["desc", "delivery", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab ? "border-brand-500 text-brand-500" : "border-transparent text-[var(--text-secondary)]"
                }`}>
                {tab === "desc" ? "Description" : tab === "delivery" ? "Livraison" : "Avis"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 mb-12">
          {activeTab === "desc" && (
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {product.description || "Aucune description disponible."}
            </p>
          )}
          {activeTab === "delivery" && (
            <div className="space-y-4 text-sm text-[var(--text-secondary)]">
              <div className="card p-4 flex items-start gap-3">
                <span className="text-xl">🏠</span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Livraison à domicile</p>
                  <p>Livré directement chez vous en 24–72h</p>
                </div>
              </div>
              <div className="card p-4 flex items-start gap-3">
                <span className="text-xl">🏢</span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Stop Desk / Bureau</p>
                  <p>Récupérez votre colis à l'agence ZR Express la plus proche — moins cher !</p>
                </div>
              </div>
              <div className="card p-4 flex items-start gap-3">
                <span className="text-xl">💵</span>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">Paiement à la livraison</p>
                  <p>Payez en espèces uniquement à la réception</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "reviews" && (
            <p className="text-[var(--text-secondary)] text-sm italic">
              Les avis clients seront affichés ici.
            </p>
          )}
        </div>

        {/* Produits similaires */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold mb-6 text-[var(--text-primary)]">
              Produits similaires
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal commande */}
      <OrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        items={[{ product, quantity, selectedVariant: selectedVariant || undefined }]}
      />
    </>
  );
}
