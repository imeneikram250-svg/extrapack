// ==========================================
// EXTRA PACK - Root Layout
// ==========================================
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { DarkModeProvider } from "@/components/ui/DarkModeProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.extrapack.dz"),
  icons: {
  icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>",
  },
  title: {
    default: "Extra Pack | Beauté & Élégance — Livraison partout en Algérie",
    template: "%s | Extra Pack",
  },
  description:
    "Découvrez les produits Extra Pack — qualité premium, livraison rapide partout en Algérie, paiement à la livraison. Beauté, élégance et confiance.",
  keywords: ["Extra Pack", "beauté algérie", "livraison algérie", "paiement livraison", "produits premium"],
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Extra Pack",
    title: "Extra Pack | Beauté & Élégance",
    description: "Qualité premium, livraison rapide, paiement à la livraison partout en Algérie.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extra Pack | Beauté & Élégance",
    description: "Qualité premium, livraison rapide, paiement à la livraison.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const dark = localStorage.getItem('extrapack-app');
                if (dark && JSON.parse(dark).state?.darkMode) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable} font-body antialiased`}
      >
        <DarkModeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1a1a26",
                color: "#fff",
                borderRadius: "12px",
                border: "1px solid rgba(255,32,128,0.2)",
              },
              success: { iconTheme: { primary: "#ff2080", secondary: "#fff" } },
            }}
          />
        </DarkModeProvider>
      </body>
    </html>
  );
}
