// ==========================================
// EXTRA PACK - Schema.org JSON-LD
// ==========================================
import { Product } from "@/types";

export function ProductSchema({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: "Extra Pack",
    },
    offers: {
      "@type": "Offer",
      price: product.promotion
        ? product.price * (1 - product.promotion / 100)
        : product.price,
      priceCurrency: "DZD",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Extra Pack" },
    },
    ...(product.promotion && {
      offers: {
        "@type": "AggregateOffer",
        lowPrice: product.price * (1 - product.promotion / 100),
        highPrice: product.price,
        priceCurrency: "DZD",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Extra Pack",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.extrapack.dz",
    description: "Boutique en ligne de produits beauté premium — Livraison partout en Algérie",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/catalogue?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Extra Pack",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+213-XX-XX-XX-XX",
      contactType: "customer service",
      areaServed: "DZ",
      availableLanguage: ["French", "Arabic"],
    },
    sameAs: [
      "https://www.facebook.com/extrapack",
      "https://www.instagram.com/extrapack",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
