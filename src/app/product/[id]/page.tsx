// ==========================================
// EXTRA PACK - Page Produit
// ==========================================
import { fetchProductsFromSheet } from "@/lib/sheets";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const products = await fetchProductsFromSheet().catch(() => []);
  const product = products.find((p) => p.id === params.id);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const products = await fetchProductsFromSheet().catch(() => []);
  const product = products.find((p) => p.id === params.id);

  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && p.stock > 0)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
