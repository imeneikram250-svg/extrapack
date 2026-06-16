// ==========================================
// API: /api/delivery - Livraison par Wilaya
// ==========================================
import { NextResponse } from "next/server";
import { fetchDeliveryFromSheet } from "@/lib/sheets";

export const revalidate = 3600;

export async function GET() {
  try {
    const wilayas = await fetchDeliveryFromSheet();
    return NextResponse.json({ success: true, wilayas });
  } catch (error) {
    console.error("API delivery error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur chargement livraison" },
      { status: 500 }
    );
  }
}
