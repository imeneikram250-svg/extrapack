"use client";
// ==========================================
// EXTRA PACK - Navbar (version corrigée)
// ==========================================
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore, useAppStore } from "@/lib/store";
import { FiShoppingBag, FiSearch, FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { getCount, openCart } = useCartStore();
  const { darkMode, toggleDarkMode } = useAppStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const count = mounted ? getCount() : 0;

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/catalogue", label: "Catalogue" },
    { href: "/catalogue?promo=true", label: "Promotions" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg-primary)]/95 backdrop-blur-lg shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
  		src="/logo.png" 
		alt="Extra Pack" 
		className="h-10 w-auto object-contain"
	    />
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--text-secondary)] hover:text-brand-500 font-medium text-sm transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-brand-500 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 text-[var(--text-secondary)] hover:text-brand-500 transition-colors"
              aria-label="Rechercher"
            >
              <FiSearch size={20} />
            </button>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 text-[var(--text-secondary)] hover:text-brand-500 transition-colors"
              aria-label="Mode sombre"
            >
              {mounted && darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 text-[var(--text-secondary)] hover:text-brand-500 transition-colors"
              aria-label="Panier"
            >
              <FiShoppingBag size={22} />
              {mounted && count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-brand text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-brand">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-lg overflow-hidden"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/catalogue?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    autoFocus
                    className="input-field flex-1"
                  />
                  <button type="submit" className="btn-primary px-4">
                    <FiSearch size={18} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[var(--bg-primary)] shadow-2xl md:hidden border-l border-[var(--border)]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-bold text-lg text-gradient">
                    EXTRA PACK
                  </span>
                  <button onClick={() => setMobileOpen(false)} className="p-2">
                    <FiX size={22} />
                  </button>
                </div>
                <ul className="space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl font-medium text-[var(--text-primary)] hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 pt-8 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)] mb-3">Livraison partout en Algérie</p>
                  <p className="text-xs text-[var(--text-secondary)]">Paiement à la livraison</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}