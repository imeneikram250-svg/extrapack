// ==========================================
// EXTRA PACK - Google Sheets (Variantes + Livraison Wilaya)
// ==========================================
import { google } from "googleapis";
import { Product, ProductVariant, WilayaDelivery, Order } from "@/types";
import { format } from "date-fns";

const getAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

const getSheets = async () => {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
};

// ── PARSER VARIANTES ─────────────────────────────────────
// Format colonne J: "Noir Corbeau:#0a0a0a:10|Châtain Foncé:#3b1f0a:5"
// Format colonne G: "img1.jpg,img2.jpg|img3.jpg,img4.jpg" (par variante)
function parseVariants(
  variantsStr: string,
  photosStr: string
): ProductVariant[] | undefined {
  if (!variantsStr || variantsStr.trim() === "") return undefined;

  const variantGroups = variantsStr.split("|");
  const photoGroups = photosStr ? photosStr.split("|") : [];

  return variantGroups
    .map((v, i) => {
      const parts = v.trim().split(":");
      if (parts.length < 2) return null;

      const name = parts[0].trim();
      const color = parts[1].trim();
      const stock = parseInt(parts[2] || "0");
      const images = photoGroups[i]
        ? photoGroups[i].split(",").map((u) => u.trim()).filter(Boolean)
        : [];

      return { name, color, stock, images };
    })
    .filter(Boolean) as ProductVariant[];
}

// ── PRODUITS ──────────────────────────────────────────────
export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.PRODUCTS_SHEET_ID,
      range: "Produits!A2:K1000",
    });

    const rows = response.data.values || [];

    return rows
      .filter((row) => row[7] === "Actif" && row[1])
      .map((row): Product => {
        const photosStr = row[6] || "";
        const variantsStr = row[9] || ""; // colonne J

        // Si variantes: photos groupées par variante
        // Si pas variantes: photos normales séparées par virgule
        const hasVariants = variantsStr.trim() !== "";
        const variants = hasVariants
          ? parseVariants(variantsStr, photosStr)
          : undefined;

        // Photos principales = première photo de chaque variante OU photos normales
        const mainImages = hasVariants
          ? (variants?.map((v) => v.images[0]).filter(Boolean) as string[]) || []
          : photosStr.split(",").map((u: string) => u.trim()).filter(Boolean);

        // Stock total = somme des stocks variantes OU stock direct
        const totalStock = variants
          ? variants.reduce((sum, v) => sum + v.stock, 0)
          : parseInt(row[5]) || 0;

        return {
          id: row[0] || `prod-${Date.now()}`,
          name: row[1] || "",
          category: row[2] || "Général",
          description: row[3] || "",
          price: parseFloat(row[4]) || 0,
          stock: totalStock,
          images: mainImages,
          status: (row[7] as "Actif" | "Inactif") || "Actif",
          promotion: row[8] ? parseFloat(row[8]) : undefined,
          originalPrice: row[8] && parseFloat(row[8]) > 0
            ? parseFloat(row[4])
            : undefined,
          variants,
          sold: 0,
        };
      })
      .filter((p) => p.name && p.price > 0);
  } catch (error) {
    console.error("Erreur lecture produits:", error);
    return [];
  }
}

// ── LIVRAISON PAR WILAYA ──────────────────────────────────
// Format Sheet: Wilaya | Domicile (DA) | Bureau (DA)
export async function fetchDeliveryFromSheet(): Promise<WilayaDelivery[]> {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.DELIVERY_SHEET_ID,
      range: "Livraison!A2:C100",
    });

    const rows = response.data.values || [];

    return rows
      .filter((row) => row[0] && row[1])
      .map((row): WilayaDelivery => ({
        wilaya: row[0].trim(),
        domicile: parseFloat(row[1]) || 0,
        bureau: parseFloat(row[2]) || 0,
      }))
      .sort((a, b) => a.wilaya.localeCompare(b.wilaya, "fr"));
  } catch (error) {
    console.error("Erreur lecture livraison:", error);
    return [];
  }
}

// ── ENREGISTREMENT COMMANDE ───────────────────────────────
export async function saveOrderToSheet(order: Order): Promise<boolean> {
  try {
    const sheets = await getSheets();

    const itemsSummary = order.items
      .map((i) => `${i.productName}${i.variant ? ` (${i.variant})` : ""} x${i.quantity}`)
      .join(" | ");

    const variantsSummary = order.items
      .filter((i) => i.variant)
      .map((i) => i.variant)
      .join(", ") || "-";

    const deliveryTypeLabel =
      order.customer.deliveryType === "domicile"
        ? "🏠 Domicile"
        : "🏢 Stop Desk";

    const addressInfo =
      order.customer.deliveryType === "domicile"
        ? order.customer.address || "-"
        : order.customer.agenceZR || "-";

    const row = [
      format(new Date(order.date), "dd/MM/yyyy HH:mm"),
      order.orderNumber,
      itemsSummary,
      order.items.reduce((sum, i) => sum + i.quantity, 0),
      order.productPrice,
      order.deliveryFee,
      order.total,
      order.customer.lastName,
      order.customer.firstName,
      order.customer.phone,
      order.customer.wilaya,
      deliveryTypeLabel,
      addressInfo,
      variantsSummary,
      order.status,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.ORDERS_SHEET_ID,
      range: "Commandes!A:O",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return true;
  } catch (error) {
    console.error("Erreur enregistrement commande:", error);
    return false;
  }
}
