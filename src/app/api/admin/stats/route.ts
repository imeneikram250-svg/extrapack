// ==========================================
// API: /api/admin/stats - Statistiques Admin
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { getAdminStats } from "@/lib/firestore";
import { fetchProductsFromSheet } from "@/lib/sheets";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-token");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const [stats, products] = await Promise.all([
      getAdminStats(),
      fetchProductsFromSheet(),
    ]);

    const outOfStockProducts = products.filter((p) => p.stock === 0).length;

    return NextResponse.json({
      success: true,
      stats: { ...stats, outOfStockProducts },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
