// ==========================================
// EXTRA PACK - Google Apps Script
// Collez ce code dans Extensions > Apps Script
// du fichier "ExtraPack - Commandes"
// ==========================================

/**
 * Mise en forme automatique des nouvelles commandes
 * Ajoute des couleurs selon le statut
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() !== "Commandes") return;
  
  const col = e.range.getColumn();
  const row = e.range.getRow();
  
  // Colonne M = Statut (colonne 13)
  if (col === 13 && row > 1) {
    colorierLigne(sheet, row, e.value);
  }
}

function colorierLigne(sheet, row, statut) {
  const range = sheet.getRange(row, 1, 1, 13);
  
  const couleurs = {
    "NOUVELLE COMMANDE": "#E3F2FD",   // Bleu clair
    "CONFIRMÉE":         "#EDE7F6",   // Violet clair
    "EN PRÉPARATION":    "#FFF9C4",   // Jaune clair
    "EXPÉDIÉE":          "#FFF3E0",   // Orange clair
    "LIVRÉE":            "#E8F5E9",   // Vert clair
    "RETOURNÉE":         "#FFF0F5",   // Rose clair
    "ANNULÉE":           "#F5F5F5",   // Gris
  };
  
  const couleur = couleurs[statut] || "#FFFFFF";
  range.setBackground(couleur);
}

/**
 * Formatage initial du Sheet Commandes
 * Lancez cette fonction une seule fois manuellement
 */
function initialiserCommandes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Commandes");
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Onglet 'Commandes' introuvable !");
    return;
  }
  
  // En-têtes
  const headers = [
    "Date", "N° Commande", "Produits", "Quantité",
    "Prix Produits", "Frais Livraison", "Total",
    "Nom", "Prénom", "Téléphone", "Wilaya", "Commune", "Statut"
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground("#1a1a26");
  headerRange.setFontColor("#ff2080");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  
  // Figer la première ligne
  sheet.setFrozenRows(1);
  
  // Largeurs de colonnes
  sheet.setColumnWidth(1, 140); // Date
  sheet.setColumnWidth(2, 160); // N° Commande
  sheet.setColumnWidth(3, 250); // Produits
  sheet.setColumnWidth(4, 80);  // Quantité
  sheet.setColumnWidth(5, 120); // Prix
  sheet.setColumnWidth(6, 120); // Frais
  sheet.setColumnWidth(7, 120); // Total
  sheet.setColumnWidth(8, 120); // Nom
  sheet.setColumnWidth(9, 120); // Prénom
  sheet.setColumnWidth(10, 130); // Téléphone
  sheet.setColumnWidth(11, 150); // Wilaya
  sheet.setColumnWidth(12, 150); // Commune
  sheet.setColumnWidth(13, 160); // Statut
  
  SpreadsheetApp.getUi().alert("✅ Sheet Commandes initialisé avec succès !");
}

/**
 * Formatage initial du Sheet Produits
 * Lancez cette fonction une seule fois manuellement
 */
function initialiserProduits() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Produits");
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Onglet 'Produits' introuvable !");
    return;
  }
  
  const headers = [
    "ID", "Nom", "Catégorie", "Description",
    "Prix (DA)", "Stock", "Photos (URLs)", "Statut", "Promotion (%)"
  ];
  
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setBackground("#1a1a26");
  headerRange.setFontColor("#ff2080");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  
  sheet.setFrozenRows(1);
  
  // Largeurs
  sheet.setColumnWidth(1, 120); // ID
  sheet.setColumnWidth(2, 220); // Nom
  sheet.setColumnWidth(3, 150); // Catégorie
  sheet.setColumnWidth(4, 300); // Description
  sheet.setColumnWidth(5, 100); // Prix
  sheet.setColumnWidth(6, 80);  // Stock
  sheet.setColumnWidth(7, 350); // Photos
  sheet.setColumnWidth(8, 100); // Statut
  sheet.setColumnWidth(9, 120); // Promotion
  
  // Validation du statut
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Actif", "Inactif"])
    .setAllowInvalid(false)
    .build();
  sheet.getRange("H2:H1000").setDataValidation(statusRule);
  
  // Coloration stock faible
  const stockRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(5)
    .setBackground("#FFCCCC")
    .setFontColor("#CC0000")
    .setRanges([sheet.getRange("F2:F1000")])
    .build();
  
  const rules = sheet.getConditionalFormatRules();
  rules.push(stockRule);
  sheet.setConditionalFormatRules(rules);
  
  SpreadsheetApp.getUi().alert("✅ Sheet Produits initialisé avec succès !");
}

/**
 * Statistiques rapides dans la console
 */
function voirStatistiques() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const commandes = ss.getSheetByName("Commandes");
  const produits = ss.getSheetByName("Produits");
  
  if (!commandes || !produits) return;
  
  const commandeData = commandes.getDataRange().getValues().slice(1);
  const total = commandeData.length;
  const livrees = commandeData.filter(r => r[12] === "LIVRÉE").length;
  const nouvelles = commandeData.filter(r => r[12] === "NOUVELLE COMMANDE").length;
  const ca = commandeData
    .filter(r => r[12] === "LIVRÉE")
    .reduce((sum, r) => sum + (parseFloat(r[6]) || 0), 0);
  
  const msg = `📊 Statistiques Extra Pack\n\n` +
    `📦 Total commandes: ${total}\n` +
    `🆕 Nouvelles: ${nouvelles}\n` +
    `✅ Livrées: ${livrees}\n` +
    `💰 CA réalisé: ${ca.toLocaleString()} DA`;
  
  SpreadsheetApp.getUi().alert(msg);
}

/**
 * Menu personnalisé dans Google Sheets
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🌸 Extra Pack")
    .addItem("📦 Initialiser Produits", "initialiserProduits")
    .addItem("📋 Initialiser Commandes", "initialiserCommandes")
    .addSeparator()
    .addItem("📊 Voir les statistiques", "voirStatistiques")
    .addToUi();
}
