// ==========================================
// EXTRA PACK - Google Sheets API Service
// ==========================================
import { google } from "googleapis";
import { Product, DeliveryZone, Order } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const getAuth = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return auth;
};

const getSheets = async () => {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
};

// ── PRODUITS ──────────────────────────────────────────────
export async function fetchProductsFromSheet(): Promise<Product[]> {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.PRODUCTS_SHEET_ID,
      range: "Produits!A2:I1000", // Skip header row
    });

    const rows = response.data.values || [];

    return rows
      .filter((row) => row[7] === "Actif") // Statut = Actif
      .map((row): Product => ({
        id: row[0] || uuidv4(),
        name: row[1] || "",
        category: row[2] || "Général",
        description: row[3] || "",
        price: parseFloat(row[4]) || 0,
        stock: parseInt(row[5]) || 0,
        images: row[6]
          ? row[6].split(",").map((url: string) => url.trim()).filter(Boolean)
          : [],
        status: (row[7] as "Actif" | "Inactif") || "Actif",
        promotion: row[8] ? parseFloat(row[8]) : undefined,
        originalPrice: row[8] && parseFloat(row[8]) > 0
          ? parseFloat(row[4])
          : undefined,
        sold: 0,
      }))
      .filter((p) => p.name && p.price > 0);
  } catch (error) {
    console.error("Erreur lecture produits Google Sheets:", error);
    return [];
  }
}

// ── ZONES DE LIVRAISON ────────────────────────────────────
export async function fetchDeliveryZonesFromSheet(): Promise<DeliveryZone[]> {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.DELIVERY_SHEET_ID,
      range: "Livraison!A2:C5000",
    });

    const rows = response.data.values || [];

    return rows
      .filter((row) => row[0] && row[1] && row[2])
      .map((row): DeliveryZone => ({
        wilaya: row[0].trim(),
        commune: row[1].trim(),
        fee: parseFloat(row[2]) || 0,
      }));
  } catch (error) {
    console.error("Erreur lecture livraison Google Sheets:", error);
    return [];
  }
}

// ── ENREGISTREMENT COMMANDE ───────────────────────────────
export async function saveOrderToSheet(order: Order): Promise<boolean> {
  try {
    const sheets = await getSheets();

    const itemsSummary = order.items
      .map((i) => `${i.productName} x${i.quantity}`)
      .join(" | ");

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
      order.customer.commune,
      order.status,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.ORDERS_SHEET_ID,
      range: "Commandes!A:M",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    return true;
  } catch (error) {
    console.error("Erreur enregistrement commande Google Sheets:", error);
    return false;
  }
}

// ── MISE À JOUR STOCK ─────────────────────────────────────
export async function updateProductStockInSheet(
  productId: string,
  newStock: number
): Promise<boolean> {
  try {
    const sheets = await getSheets();

    // Find the row with this product ID
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.PRODUCTS_SHEET_ID,
      range: "Produits!A:A",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === productId);

    if (rowIndex === -1) return false;

    const rowNumber = rowIndex + 1; // 1-indexed, +1 for header
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.PRODUCTS_SHEET_ID,
      range: `Produits!F${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[newStock]] },
    });

    return true;
  } catch (error) {
    console.error("Erreur mise à jour stock:", error);
    return false;
  }
}

// ── MISE À JOUR STATUT COMMANDE SHEET ─────────────────────
export async function updateOrderStatusInSheet(
  orderNumber: string,
  newStatus: string
): Promise<boolean> {
  try {
    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.ORDERS_SHEET_ID,
      range: "Commandes!B:B",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === orderNumber);

    if (rowIndex === -1) return false;

    const rowNumber = rowIndex + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.ORDERS_SHEET_ID,
      range: `Commandes!M${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[newStatus]] },
    });

    return true;
  } catch (error) {
    console.error("Erreur mise à jour statut commande:", error);
    return false;
  }
}
