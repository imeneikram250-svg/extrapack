// ==========================================
// API: /api/orders - Sans Firebase (Google Sheets direct)
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { saveOrderToSheet } from "@/lib/sheets";
import { Order } from "@/types";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, productPrice, deliveryFee, total } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400 }
      );
    }

    if (!customer.firstName || !customer.lastName || !customer.phone || !customer.wilaya || !customer.commune) {
      return NextResponse.json(
        { success: false, error: "Informations client incomplètes" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const orderId = `EP-${Date.now()}`;

    const order: Order = {
      id: orderId,
      orderNumber,
      date: new Date().toISOString(),
      customer,
      items,
      productPrice,
      deliveryFee,
      total,
      status: "NOUVELLE COMMANDE",
    };

    // Sauvegarde directement dans Google Sheets
    const saved = await saveOrderToSheet(order);

    if (saved) {
      return NextResponse.json({ success: true, orderId, orderNumber });
    } else {
      return NextResponse.json(
        { success: false, error: "Erreur sauvegarde Google Sheets" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API order error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("x-admin-token");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }
    return NextResponse.json({ success: true, orders: [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}