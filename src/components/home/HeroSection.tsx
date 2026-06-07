"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiStar } from "react-icons/fi";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-gradient">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
            <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wide">
              Nouvelle collection disponible
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Beauté{" "}
            <span className="text-gradient italic">Premium</span>
            <br />Livrée Chez Vous
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)] mb-8 max-w-md leading-relaxed">
            Découvrez notre collection exclusive de produits beauté de qualité supérieure.
            Livraison rapide partout en Algérie — paiement à la livraison.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4">
            <Link href="/catalogue" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Découvrir la collection <FiArrowRight size={18} />
            </Link>
            <Link href="/catalogue?promo=true" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              Voir les promos
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex gap-8 mt-10 pt-10 border-t border-[var(--border)]">
            {[
              { value: "5k+", label: "Clientes satisfaites" },
              { value: "100%", label: "Paiement livraison" },
              { value: "58", label: "Wilayas livrées" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-bold text-2xl text-gradient">{stat.value}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9, x: 40 }} animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }} className="relative hidden md:block">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/20 aspect-[4/5] shadow-brand-lg">
            <video
  		autoPlay
  		muted
  		loop
  		playsInline
  		className="absolute inset-0 w-full h-full object-cover"
	    >
  		<source src="/hero-video.mp4" type="video/mp4" />
	    </video>
	    <div className="absolute inset-0 bg-brand-500/20" />
          </div>
          
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 bottom-1/4 bg-[var(--card-bg)] rounded-2xl p-4 shadow-card border border-[var(--border)]">
            <div className="flex text-yellow-400">
              {[1,2,3,4,5].map(i => <FiStar key={i} size={12} className="fill-current" />)}
            </div>
            <p className="font-semibold text-xs text-[var(--text-primary)] mt-1">4.9/5 étoiles</p>
            <p className="text-xs text-[var(--text-secondary)]">+500 avis clients</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}