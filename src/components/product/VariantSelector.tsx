"use client";
// ==========================================
// EXTRA PACK - Sélecteur de Variantes/Couleurs
// ==========================================
import { motion } from "framer-motion";
import { ProductVariant } from "@/types";

interface Props {
  variants: ProductVariant[];
  selected: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          Couleur :
        </p>
        {selected && (
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {selected.name}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = selected?.name === variant.name;
          const isOutOfStock = variant.stock === 0;

          return (
            <motion.button
              key={variant.name}
              onClick={() => !isOutOfStock && onSelect(variant)}
              whileHover={!isOutOfStock ? { scale: 1.1 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
              disabled={isOutOfStock}
              title={`${variant.name}${isOutOfStock ? " — Rupture" : ` (${variant.stock} restants)`}`}
              className={`relative group flex flex-col items-center gap-1.5 ${
                isOutOfStock ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {/* Cercle couleur */}
              <div
                className={`w-9 h-9 rounded-full border-2 transition-all duration-200 shadow-sm ${
                  isSelected
                    ? "border-brand-500 scale-110 shadow-brand"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                style={{ backgroundColor: variant.color }}
              >
                {/* Checkmark si sélectionné */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="white"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Croix si rupture */}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-red-500/70 rotate-45 absolute" />
                  </div>
                )}
              </div>

              {/* Nom couleur */}
              <span className={`text-xs font-medium text-center max-w-[60px] leading-tight ${
                isSelected
                  ? "text-brand-500"
                  : "text-[var(--text-secondary)]"
              }`}>
                {variant.name}
              </span>

              {/* Stock badge */}
              {!isOutOfStock && variant.stock <= 3 && (
                <span className="text-xs text-orange-500 font-bold">
                  {variant.stock} restant{variant.stock > 1 ? "s" : ""}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Message sélection */}
      {!selected && variants.some((v) => v.stock > 0) && (
        <p className="text-xs text-brand-500 font-medium animate-pulse">
          ← Choisissez une couleur
        </p>
      )}
    </div>
  );
}
