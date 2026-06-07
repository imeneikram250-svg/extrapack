// ==========================================
// API: /api/delivery - Zones de livraison
// ==========================================
import { NextResponse } from "next/server";
import { fetchDeliveryZonesFromSheet } from "@/lib/sheets";
import { Wilaya } from "@/types";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const zones = await fetchDeliveryZonesFromSheet();

    // Group communes by wilaya
    const wilayaMap = new Map<string, Wilaya>();

    zones.forEach((zone) => {
      if (!wilayaMap.has(zone.wilaya)) {
        wilayaMap.set(zone.wilaya, {
          id: zone.wilaya,
          name: zone.wilaya,
          communes: [],
        });
      }
      wilayaMap.get(zone.wilaya)!.communes.push({
        name: zone.commune,
        deliveryFee: zone.fee,
      });
    });

    // Sort wilayas alphabetically
    const wilayas = Array.from(wilayaMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

    return NextResponse.json({ success: true, wilayas });
  } catch (error) {
    console.error("API delivery error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du chargement des zones de livraison" },
      { status: 500 }
    );
  }
}
