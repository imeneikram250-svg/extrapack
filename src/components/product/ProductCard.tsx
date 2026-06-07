"use client";
// ==========================================
// EXTRA PACK - ProductCard
// ==========================================
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiShoppingBag, FiHeart, FiEye } from "react-icons/fi";
import { Product } from "@/types";
import { formatPrice, getDiscountedPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCartStore();

  const price = getDiscountedPrice(product.price, product.promotion);
  const inStock = product.stock > 0;
  const mainImage = product.images?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="card overflow-hidden">
          {/* Image */}
          <div className="relative aspect-[4/5] bg-[var(--bg-secondary)] overflow-hidden">
            {mainImage && !imgError ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover product-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                🛍️
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.promotion && product.promotion > 0 && (
                <span className="badge-promo">-{product.promotion}%</span>
              )}
              {!inStock && (
                <span className="bg-gray-800/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Rupture
                </span>
              )}
              {inStock && product.stock <= 5 && (
                <span className="bg-orange-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Plus que {product.stock}!
                </span>
              )}
            </div>

            {/* Actions on hover */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setLiked(!liked);
                }}
                className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
                  liked ? "text-brand-500" : "text-gray-400 hover:text-brand-500"
                }`}
              >
                <FiHeart size={14} className={liked ? "fill-current" : ""} />
              </button>
              <Link
                href={`/product/${product.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-brand-500 transition-colors"
              >
                <FiEye size={14} />
              </Link>
            </div>

            {/* Add to cart button */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`w-full py-2.5 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                  inStock
                    ? "bg-gradient-brand hover:opacity-90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <FiShoppingBag size={15} />
                {inStock ? "Ajouter au panier" : "Rupture de stock"}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wide">
              {product.category}
            </p>
            <h3 className="font-semibold text-sm text-[var(--text-primary)] line-clamp-2 mb-2 leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-500 text-base">
                {formatPrice(price)}
              </span>
              {product.promotion && product.originalPrice && (
                <span className="text-xs text-[var(--text-secondary)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
