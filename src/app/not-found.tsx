// ==========================================
// EXTRA PACK - Page 404
// ==========================================
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable | Extra Pack",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="animate-float mb-6">
        <span className="text-8xl">🌸</span>
      </div>
      <h1 className="font-display text-6xl font-bold text-gradient mb-4">404</h1>
      <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)] mb-3">
        Page introuvable
      </h2>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
        <Link href="/catalogue" className="btn-secondary">
          Voir le catalogue
        </Link>
      </div>
    </div>
  );
}
