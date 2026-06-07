"use client";
// ==========================================
// EXTRA PACK - Section Instagram Feed
// Affiche les derniers posts Instagram via lien public
// ==========================================
import { motion } from "framer-motion";
import { FiInstagram, FiExternalLink } from "react-icons/fi";

const INSTAGRAM_HANDLE = "extension_extra_pack";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

// Posts statiques en fallback (remplacez par vos vraies photos)
// Pour une intégration dynamique, utilisez l'API Instagram Basic Display
const DEMO_POSTS = [
  { id: "1", emoji: "💄", caption: "Nouvelle arrivée ✨" },
  { id: "2", emoji: "🌸", caption: "Collection printemps 🌷" },
  { id: "3", emoji: "✨", caption: "Qualité premium 💎" },
  { id: "4", emoji: "🛍️", caption: "Commandez maintenant 🚀" },
  { id: "5", emoji: "💅", caption: "Beauté au quotidien 🌟" },
  { id: "6", emoji: "🎀", caption: "Livraison express 🚚" },
];

export function InstagramSection() {
  return (
    <section className="py-16 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-brand-500 to-orange-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <FiInstagram size={22} className="text-white" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-xl text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
                @{INSTAGRAM_HANDLE}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">Suivez-nous sur Instagram</p>
            </div>
            <FiExternalLink size={16} className="text-[var(--text-secondary)] group-hover:text-brand-500 transition-colors ml-1" />
          </motion.a>

          <h2 className="section-title mb-3">Notre Instagram</h2>
          <div className="divider" />
          <p className="text-[var(--text-secondary)] mt-4 text-sm">
            Découvrez nos nouveautés, conseils beauté et coulisses sur Instagram
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {DEMO_POSTS.map((post, i) => (
            <motion.a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/20 group cursor-pointer"
            >
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
                <span className="text-3xl md:text-4xl">{post.emoji}</span>
                <p className="text-xs text-brand-700 dark:text-brand-300 text-center font-medium hidden md:block">
                  {post.caption}
                </p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-brand-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FiInstagram size={28} className="text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-500 text-brand-500 font-semibold text-sm hover:bg-brand-500 hover:text-white transition-all duration-200"
          >
            <FiInstagram size={18} />
            Voir tous nos posts
          </a>
        </div>
      </div>
    </section>
  );
}
