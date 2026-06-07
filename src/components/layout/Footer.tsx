"use client";
// ==========================================
// EXTRA PACK - Footer
// ==========================================
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 text-gray-300 pt-16 pb-6 mt-20">
      {/* Trust Banner */}
      <div className="border-b border-white/10 pb-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Livraison rapide", desc: "Partout en Algérie" },
            { icon: "💳", title: "Paiement à la livraison", desc: "Payez à la réception" },
            { icon: "✅", title: "Qualité garantie", desc: "Produits certifiés" },
            { icon: "📞", title: "Support 7j/7", desc: "On répond toujours" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-10 pb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <span className="font-display font-bold text-2xl text-gradient block mb-3">
            EXTRA PACK
          </span>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Votre destination beauté premium en Algérie. Qualité, élégance et confiance — livrés à votre porte.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-600 transition-colors"
              aria-label="Facebook"
            >
              <FiFacebook size={16} />
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-600 transition-colors"
              aria-label="Instagram"
            >
              <FiInstagram size={16} />
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-sm">💬</span>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-2.5">
            {[
              { href: "/", label: "Accueil" },
              { href: "/catalogue", label: "Catalogue" },
              { href: "/catalogue?promo=true", label: "Promotions" },
              { href: "/#about", label: "À propos" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Informations</h4>
          <ul className="space-y-2.5">
            {[
              { href: "/politique-confidentialite", label: "Politique de confidentialité" },
              { href: "/conditions-utilisation", label: "Conditions d'utilisation" },
              { href: "/politique-retour", label: "Politique de retour" },
              { href: "/livraison", label: "Informations de livraison" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div id="contact">
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-400">
              <FiMapPin size={16} className="mt-0.5 flex-shrink-0 text-brand-400" />
              <span>Algérie — Annaba — Livraison nationale</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <FiPhone size={16} className="flex-shrink-0 text-brand-400" />
              <a href="tel:+213673747771" className="hover:text-brand-400 transition-colors">
                +2136 73 74 77 71
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-400">
              <FiMail size={16} className="flex-shrink-0 text-brand-400" />
              <a href="mailto:contact@extrapack.dz" className="hover:text-brand-400 transition-colors">
                contact@extrapack.dz
              </a>
            </li>
          </ul>

          <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400 text-center">
              🕐 Commandes traitées<br />
              <span className="text-white font-medium">Lun–Sam · 8h–20h</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          © {year} Extra Pack. Tous droits réservés.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Paiement sécurisé</span>
          <span className="text-lg">🔒</span>
          <span className="text-xs text-gray-500 ml-2">Cash On Delivery</span>
          <span className="text-lg">💵</span>
        </div>
      </div>
    </footer>
  );
}
