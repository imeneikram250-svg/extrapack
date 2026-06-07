// ==========================================
// EXTRA PACK - Page d'accueil (avec Instagram)
// ==========================================
import { Suspense } from "react";
import { fetchProductsFromSheet } from "@/lib/sheets";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoSection } from "@/components/home/PromoSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TrustSection } from "@/components/home/TrustSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { WebsiteSchema, OrganizationSchema } from "@/components/ui/Schema";

export const revalidate = 300;

export default async function HomePage() {
  const products = await fetchProductsFromSheet().catch(() => []);
  const featured = products.filter((p) => p.stock > 0).slice(0, 8);
  const promoProducts = products
    .filter((p) => p.promotion && p.promotion > 0 && p.stock > 0)
    .slice(0, 4);

  const categories = Array.from(
    products.reduce((map, p) => {
      map.set(p.category, (map.get(p.category) || 0) + 1);
      return map;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ id: name, name, count }));

  return (
    <>
      <WebsiteSchema />
      <OrganizationSchema />
      <HeroSection />
      <TrustSection />
      <CategoriesSection categories={categories} />
      {featured.length > 0 && (
        <Suspense fallback={<div className="py-16 max-w-7xl mx-auto px-4"><ProductCardSkeleton count={8} /></div>}>
          <FeaturedProducts products={featured} />
        </Suspense>
      )}
      {promoProducts.length > 0 && (
        <PromoSection products={promoProducts} />
      )}
      <InstagramSection />
      <TestimonialsSection />
    </>
  );
}
