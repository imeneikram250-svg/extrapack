"use client";
// ==========================================
// EXTRA PACK - Home Sections
// ==========================================
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiCheck } from "react-icons/fi";
import { Product, Category } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import Image from "next/image";

// ── TRUST SECTION ─────────────────────────────────────────
export function TrustSection() {
  const features = [
    { icon: "🚚", title: "Livraison Express", desc: "24–72h partout en Algérie" },
    { icon: "💵", title: "Paiement à la livraison", desc: "Payez à la réception" },
    { icon: "↩️", title: "Retours faciles", desc: "Satisfaite ou remboursée" },
    { icon: "🔒", title: "Commande sécurisée", desc: "Vos données protégées" },
  ];

  return (
    <section className="py-8 border-y border-[var(--border)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 py-2"
          >
            <span className="text-2xl flex-shrink-0">{f.icon}</span>
            <div>
              <p className="font-semibold text-xs md:text-sm text-[var(--text-primary)]">{f.title}</p>
              <p className="text-xs text-[var(--text-secondary)] hidden md:block">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── CATEGORIES SECTION ────────────────────────────────────
export function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const catEmojis: Record<string, string> = {
    "Soin visage": "🧴", "Maquillage": "💄", "Parfum": "🌸",
    "Soin corps": "✨", "Cheveux": "💆", "Accessoires": "👜",
    "Général": "🛍️",
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="section-title mb-3">Nos Catégories</h2>
        <div className="divider" />
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/catalogue"
          className="px-5 py-2.5 rounded-full border-2 border-brand-500 text-brand-500 font-semibold text-sm hover:bg-brand-500 hover:text-white transition-all duration-200"
        >
          Tout voir ({categories.reduce((s, c) => s + c.count, 0)})
        </Link>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/catalogue?category=${encodeURIComponent(cat.name)}`}
              className="px-5 py-2.5 rounded-full border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-primary)] font-medium text-sm hover:border-brand-400 hover:text-brand-500 transition-all duration-200 flex items-center gap-2"
            >
              <span>{catEmojis[cat.name] || "🏷️"}</span>
              {cat.name}
              <span className="text-xs text-[var(--text-secondary)]">({cat.count})</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── FEATURED PRODUCTS ─────────────────────────────────────
export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="section-title mb-3">Produits Vedettes</h2>
            <div className="divider mx-0" />
          </div>
          <Link
            href="/catalogue"
            className="flex items-center gap-2 text-brand-500 font-semibold text-sm hover:gap-3 transition-all"
          >
            Voir tout <FiArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROMO SECTION ─────────────────────────────────────────
export function PromoSection({ products }: { products: Product[] }) {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full px-3 py-1 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wide">
              Offres limitées
            </span>
          </div>
          <h2 className="section-title">Promotions du Moment</h2>
          <div className="divider mx-0 mt-3" />
        </div>
        <Link
          href="/catalogue?promo=true"
          className="flex items-center gap-2 text-brand-500 font-semibold text-sm hover:gap-3 transition-all"
        >
          Toutes les promos <FiArrowRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}

// ── TESTIMONIALS SECTION ──────────────────────────────────
export function TestimonialsSection() {
  const reviews = [
    { name: "Amira B.", city: "Alger", rating: 5, comment: "Produits excellents, livraison rapide ! Je recommande vivement Extra Pack à toutes mes amies. La qualité est vraiment au rendez-vous.", avatar: "👩🏻" },
    { name: "Leila M.", city: "Oran", rating: 5, comment: "Super satisfaite de ma commande. Le paiement à la livraison c'est parfait, je n'ai pas eu à m'inquiéter. J'adore la qualité !", avatar: "👩🏽" },
    { name: "Fatima Z.", city: "Constantine", rating: 5, comment: "J'ai commandé plusieurs fois chez Extra Pack et je suis toujours ravie. Les produits correspondent exactement aux photos.", avatar: "👩🏾" },
    { name: "Nour A.", city: "Tizi Ouzou", rating: 5, comment: "Emballage soigné, produit de qualité, livraison en 2 jours. Que demander de plus ? Extra Pack c'est la référence !", avatar: "👱🏻‍♀️" },
    { name: "Yasmine K.", city: "Annaba", rating: 5, comment: "Magnifiques produits ! Service client très réactif sur WhatsApp. Je suis une cliente fidèle depuis des mois.", avatar: "👩🏻‍🦱" },
    { name: "Sara H.", city: "Sétif", rating: 5, comment: "Première commande et je suis déjà conquise. Qualité premium à prix raisonnable. La livraison était impeccable.", avatar: "👩" },
  ];

  return (
    <section className="py-16 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Ce que disent nos clientes</h2>
          <div className="divider" />
          <p className="text-[var(--text-secondary)] mt-4">
            +500 clientes satisfaites à travers l'Algérie
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex text-yellow-400 mb-3">
                {Array(review.rating).fill(0).map((_, j) => (
                  <FiStar key={j} size={14} className="fill-current" />
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 italic">
                "{review.comment}"
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{review.avatar}</span>
                <div>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{review.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{review.city}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <FiCheck size={12} /> Achat vérifié
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
