// ==========================================
// API: /api/products - Sync depuis Google Sheets
// ==========================================
import { NextResponse } from "next/server";
import { fetchProductsFromSheet } from "@/lib/sheets";

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    const products = await fetchProductsFromSheet();
    return NextResponse.json({ success: true, products, count: products.length });
  } catch (error) {
    console.error("API products error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du chargement des produits" },
      { status: 500 }
    );
  }
}
