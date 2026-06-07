# 📊 Guide Complet — Configuration Google Sheets pour Extra Pack

---

## ÉTAPE 1 : Créer les 3 Google Sheets

Allez sur **sheets.google.com** et créez **3 fichiers séparés** :

| Fichier | Nom suggéré |
|---------|-------------|
| Sheet 1 | `ExtraPack - Produits` |
| Sheet 2 | `ExtraPack - Livraison` |
| Sheet 3 | `ExtraPack - Commandes` |

---

## ÉTAPE 2 : Structure exacte de chaque Sheet

### 📦 SHEET 1 — Produits (onglet nommé `Produits`)

Copiez exactement ces en-têtes en **ligne 1** :

```
A1: ID
B1: Nom
C1: Catégorie
D1: Description
E1: Prix
F1: Stock
G1: Photos
H1: Statut
I1: Promotion
```

**Exemple de données (ligne 2) :**

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| PROD001 | Crème hydratante visage | Soin visage | Crème légère ultra-hydratante pour peau sèche et mixte. Enrichie en acide hyaluronique. | 1500 | 50 | https://i.imgur.com/example1.jpg,https://i.imgur.com/example2.jpg | Actif | 20 |
| PROD002 | Rouge à lèvres mat longue tenue | Maquillage | Rouge à lèvres mat intense, tenue 12h, sans transfert. Disponible en 8 teintes. | 800 | 30 | https://i.imgur.com/example3.jpg | Actif | |
| PROD003 | Sérum vitamine C | Soin visage | Sérum éclat à la vitamine C pure 20%. Anti-taches, anti-rides, lumière naturelle. | 2200 | 15 | https://i.imgur.com/example4.jpg | Actif | 15 |

**⚠️ Règles importantes :**
- Colonne **G (Photos)** : URLs séparées par des virgules, pas d'espaces
- Colonne **H (Statut)** : exactement `Actif` ou `Inactif` (avec majuscule)
- Colonne **I (Promotion)** : juste le chiffre (ex: `20` pour -20%), laissez vide si pas de promo
- Colonne **E (Prix)** : chiffre seul, sans "DA" ni espace
- Colonne **F (Stock)** : chiffre entier. Mettez `0` pour rupture de stock

---

### 🚚 SHEET 2 — Livraison (onglet nommé `Livraison`)

En-têtes en **ligne 1** :

```
A1: Wilaya
B1: Commune
C1: Frais
```

**Données complètes Algérie (copiez-collez ce tableau) :**

| A (Wilaya) | B (Commune) | C (Frais DA) |
|------------|-------------|--------------|
| Adrar | Adrar | 800 |
| Adrar | Aoulef | 800 |
| Chlef | Chlef | 500 |
| Chlef | Ténès | 500 |
| Laghouat | Laghouat | 650 |
| Oum El Bouaghi | Oum El Bouaghi | 550 |
| Oum El Bouaghi | Ain Beida | 550 |
| Batna | Batna | 500 |
| Batna | Barika | 500 |
| Béjaïa | Béjaïa | 450 |
| Béjaïa | Akbou | 450 |
| Biskra | Biskra | 600 |
| Biskra | Tolga | 600 |
| Blida | Blida | 350 |
| Blida | Boufarik | 350 |
| Bouira | Bouira | 450 |
| Tamanrasset | Tamanrasset | 1000 |
| Tébessa | Tébessa | 600 |
| Tlemcen | Tlemcen | 550 |
| Tlemcen | Maghnia | 550 |
| Tiaret | Tiaret | 550 |
| Tizi Ouzou | Tizi Ouzou | 400 |
| Tizi Ouzou | Azazga | 450 |
| Tizi Ouzou | Draa El Mizan | 450 |
| Alger | Alger Centre | 300 |
| Alger | Bab El Oued | 300 |
| Alger | Hydra | 300 |
| Alger | El Harrach | 300 |
| Alger | Kouba | 300 |
| Alger | Dar El Beida | 300 |
| Alger | Bordj El Kiffan | 350 |
| Alger | Rouiba | 350 |
| Alger | Draria | 350 |
| Alger | Birkhadem | 300 |
| Alger | Hussein Dey | 300 |
| Alger | Bourouba | 300 |
| Alger | El Biar | 300 |
| Alger | Ben Aknoun | 300 |
| Alger | Cheraga | 300 |
| Alger | Bouzareah | 300 |
| Jijel | Jijel | 500 |
| Sétif | Sétif | 500 |
| Sétif | El Eulma | 500 |
| Saïda | Saïda | 600 |
| Skikda | Skikda | 500 |
| Sidi Bel Abbès | Sidi Bel Abbès | 550 |
| Annaba | Annaba | 450 |
| Annaba | El Bouni | 450 |
| Guelma | Guelma | 500 |
| Constantine | Constantine | 450 |
| Constantine | El Khroub | 450 |
| Médéa | Médéa | 400 |
| Médéa | Ksar El Boukhari | 400 |
| Mostaganem | Mostaganem | 500 |
| M'Sila | M'Sila | 550 |
| Mascara | Mascara | 550 |
| Ouargla | Ouargla | 700 |
| Oran | Oran | 400 |
| Oran | Es Senia | 400 |
| Oran | Bir El Djir | 400 |
| Oran | Ain El Turk | 450 |
| Oran | Arzew | 450 |
| El Bayadh | El Bayadh | 700 |
| Illizi | Illizi | 1000 |
| Bordj Bou Arreridj | Bordj Bou Arreridj | 500 |
| Boumerdès | Boumerdès | 350 |
| Boumerdès | Dellys | 400 |
| Boumerdès | Khemis El Khechna | 350 |
| El Tarf | El Tarf | 550 |
| Tindouf | Tindouf | 1000 |
| Tissemsilt | Tissemsilt | 600 |
| El Oued | El Oued | 700 |
| Khenchela | Khenchela | 600 |
| Souk Ahras | Souk Ahras | 550 |
| Tipaza | Tipaza | 350 |
| Tipaza | Hadjout | 350 |
| Mila | Mila | 500 |
| Ain Defla | Ain Defla | 500 |
| Naâma | Naâma | 700 |
| Ain Témouchent | Ain Témouchent | 550 |
| Ghardaïa | Ghardaïa | 700 |
| Relizane | Relizane | 550 |

**💡 Tip :** Personnalisez les frais selon votre accord avec votre livreur.

---

### 📋 SHEET 3 — Commandes (onglet nommé `Commandes`)

En-têtes en **ligne 1** (ne jamais modifier) :

```
A1: Date
B1: N° Commande
C1: Produits
D1: Quantité
E1: Prix Produits
F1: Frais Livraison
G1: Total
H1: Nom
I1: Prénom
J1: Téléphone
K1: Wilaya
L1: Commune
M1: Statut
```

**Les commandes seront ajoutées automatiquement par le site** ✅

Vous pouvez ajouter une mise en forme conditionnelle pour colorer les statuts :
- 🔵 NOUVELLE COMMANDE → Bleu clair
- 🟢 LIVRÉE → Vert
- 🔴 ANNULÉE → Rouge
- 🟡 EN PRÉPARATION → Jaune

---

## ÉTAPE 3 : Créer le compte de service Google

### 3.1 — Google Cloud Console

1. Allez sur → **console.cloud.google.com**
2. Créez un **nouveau projet** (ex: "extrapack-site")
3. Dans le menu → **APIs et services** → **Bibliothèque**
4. Cherchez **"Google Sheets API"** → Cliquez → **Activer**

### 3.2 — Créer le compte de service

1. Menu → **IAM et administration** → **Comptes de service**
2. Cliquez → **Créer un compte de service**
3. Nom : `extrapack-sheets` → Continuer → Terminer
4. Cliquez sur le compte créé → **Clés** → **Ajouter une clé** → **JSON**
5. Un fichier `.json` sera téléchargé automatiquement

**Exemple de fichier JSON téléchargé :**
```json
{
  "type": "service_account",
  "project_id": "extrapack-site",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBAD...\n-----END PRIVATE KEY-----\n",
  "client_email": "extrapack-sheets@extrapack-site.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

### 3.3 — Partager vos Sheets avec le compte de service

Pour **chacun des 3 Google Sheets** :
1. Ouvrez le Sheet → Cliquez **Partager** (bouton vert en haut à droite)
2. Dans le champ email, collez l'`client_email` du JSON
   > Ex: `extrapack-sheets@extrapack-site.iam.gserviceaccount.com`
3. Rôle → **Éditeur**
4. Décochez "Notifier par e-mail" → **Partager**

---

## ÉTAPE 4 : Copier dans .env.local

Ouvrez le fichier JSON téléchargé et copiez :

```env
# Dans votre fichier .env.local

GOOGLE_SHEETS_CLIENT_EMAIL=extrapack-sheets@extrapack-site.iam.gserviceaccount.com

# Copiez la private_key en ENTIER, gardez les \n
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVOTRE_CLE_ICI\n-----END PRIVATE KEY-----\n"

# IDs des Sheets (dans l'URL : /spreadsheets/d/SHEET_ID/edit)
PRODUCTS_SHEET_ID=1ABC123xyz...
DELIVERY_SHEET_ID=1DEF456uvw...
ORDERS_SHEET_ID=1GHI789rst...
```

**Comment trouver le Sheet ID ?**
Exemple d'URL : `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`**`/edit`
→ Le Sheet ID est la partie en gras.

---

## ÉTAPE 5 : Tester la connexion

Démarrez le site en dev :
```bash
npm run dev
```

Ouvrez : `http://localhost:3000/api/products`

✅ Si vous voyez vos produits en JSON → **Tout fonctionne !**
❌ Si erreur → Vérifiez les credentials et que le Sheet est bien partagé.

---

## 🔄 Fonctionnement automatique

| Action | Ce qui se passe |
|--------|-----------------|
| Vous modifiez un prix dans le Sheet | Le site se met à jour en **5 minutes** |
| Vous changez le statut en "Inactif" | Le produit disparaît du catalogue |
| Une commande est passée | Elle apparaît dans le Sheet Commandes **instantanément** |
| Vous changez un statut dans l'admin | Il se met à jour dans le Sheet aussi |

---

## ⚡ Conseils pratiques

### Photos des produits
- Hébergez vos photos sur : **Imgur** (gratuit) ou **Cloudinary** (recommandé)
- Sur Cloudinary : créez un compte gratuit → Upload → copiez l'URL publique
- Format recommandé : **JPEG, 800×800px, fond blanc**

### Ajouter un nouveau produit
1. Allez dans Sheet "Produits"
2. Ajoutez une nouvelle ligne
3. Remplissez toutes les colonnes
4. Mettez le statut sur **"Actif"**
5. Le site se met à jour dans 5 minutes ✅

### Mettre en promotion
1. Trouvez le produit dans le Sheet
2. Dans la colonne **I (Promotion)**, entrez le % (ex: `30` pour -30%)
3. Le badge "-30%" apparaîtra automatiquement sur le site ✅

### Rupture de stock
1. Mettez le **Stock (colonne F)** à `0`
2. Le bouton "Commander" sera désactivé automatiquement ✅

---

## 🚨 Dépannage fréquent

| Problème | Solution |
|----------|----------|
| `Error: The caller does not have permission` | Vérifiez que le Sheet est partagé avec le bon email du compte de service |
| `Error: Unable to parse private key` | Vérifiez que `\n` est bien dans la clé privée (pas de vrais sauts de ligne) |
| Produits non affichés | Vérifiez que l'onglet s'appelle exactement `Produits` (avec majuscule) |
| Commande non enregistrée | Vérifiez que l'onglet s'appelle exactement `Commandes` |
| Photos non affichées | Vérifiez que les URLs sont publiques et accessibles |

---

*Guide Extra Pack — Configuration Google Sheets v1.0*
