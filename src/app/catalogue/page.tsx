"use client";
// ==========================================
// EXTRA PACK - Page Catalogue
// ==========================================
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { FiSearch, FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { PageSkeleton } from "@/components/ui/Skeleton";

export default function CataloguePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const promoOnly = searchParams.get("promo") === "true";

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.stock > 0 || p.status === "Actif");

    if (promoOnly) result = result.filter((p) => p.promotion && p.promotion > 0);
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price_asc": return [...result].sort((a, b) => a.price - b.price);
      case "price_desc": return [...result].sort((a, b) => b.price - a.price);
      case "popular": return [...result].sort((a, b) => (b.sold || 0) - (a.sold || 0));
      case "promo": return [...result].sort((a, b) => (b.promotion || 0) - (a.promotion || 0));
      default: return result;
    }
  }, [products, promoOnly, selectedCategory, searchQuery, sortBy]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">
          {promoOnly ? "🏷️ Promotions" : selectedCategory || "Catalogue"}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search + Filters bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="input-field pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-brand-500"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="default">Trier par défaut</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="popular">Popularité</option>
            <option value="promo">Meilleures promos</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-secondary)]" size={16} />
        </div>

        {/* Filter toggle (mobile) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline flex items-center gap-2 md:hidden"
        >
          <FiFilter size={16} />
          Filtrer
          {selectedCategory && <span className="w-2 h-2 rounded-full bg-brand-500" />}
        </button>
      </div>

      {/* Category filters */}
      <AnimatePresence>
        {(showFilters || true) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-brand-500 text-white shadow-brand"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-brand-500 border border-[var(--border)]"
                }`}
              >
                Tout ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-brand-500 text-white shadow-brand"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-brand-500 border border-[var(--border)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="font-display text-xl font-semibold mb-2">Aucun produit trouvé</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Essayez avec d'autres mots-clés ou filtres
          </p>
          <button
            onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
            className="btn-primary"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
