// ==========================================
// EXTRA PACK - Sitemap
// ==========================================
import { MetadataRoute } from "next";
import { fetchProductsFromSheet } from "@/lib/sheets";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.extrapack.dz";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${baseUrl}/catalogue`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/catalogue?promo=true`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchProductsFromSheet();
    productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {}

  return [...staticPages, ...productPages];
}
