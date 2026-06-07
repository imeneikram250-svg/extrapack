// ==========================================
// EXTRA PACK - Catalogue wrapper (server)
// ==========================================
import { Suspense } from "react";
import { Metadata } from "next";
import CatalogueContent from "./page";
import { PageSkeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Catalogue — Tous nos produits",
  description: "Découvrez toute la gamme Extra Pack : soins, beauté, accessoires. Livraison partout en Algérie, paiement à la livraison.",
};

export default function CataloguePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CatalogueContent />
    </Suspense>
  );
}
