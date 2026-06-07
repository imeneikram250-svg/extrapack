// ==========================================
// API: /api/orders/[id] - Mise à jour commande
// ==========================================
import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus, getOrderById } from "@/lib/firestore";
import { updateOrderStatusInSheet } from "@/lib/sheets";
import { OrderStatus } from "@/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("x-admin-token");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { status } = await req.json();
    const validStatuses: OrderStatus[] = [
      "NOUVELLE COMMANDE", "CONFIRMÉE", "EN PRÉPARATION",
      "EXPÉDIÉE", "LIVRÉE", "RETOURNÉE", "ANNULÉE"
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Statut invalide" }, { status: 400 });
    }

    await updateOrderStatus(params.id, status);

    // Update in Google Sheets too
    const order = await getOrderById(params.id);
    if (order) {
      updateOrderStatusInSheet(order.orderNumber, status).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("x-admin-token");
    if (authHeader !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
