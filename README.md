# 🌸 Extra Pack — E-commerce Algérie

Site e-commerce premium Next.js avec synchronisation Google Sheets, Firebase, et paiement à la livraison.

---

## 🚀 Démarrage rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration des variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez `.env.local` avec vos credentials (voir sections ci-dessous).

### 3. Lancement

```bash
npm run dev       # Développement
npm run build     # Production
npm start         # Démarrer en production
```

---

## 🔥 Configuration Firebase

### Étapes :

1. Créer un projet sur [firebase.google.com](https://firebase.google.com)
2. Activer **Firestore Database** (mode Production)
3. Aller dans Paramètres du projet → **Vos applications** → Ajouter une application Web
4. Copier les credentials dans `.env.local`

### Règles Firestore (sécurité) :

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders: only server can write (via API routes)
    match /orders/{orderId} {
      allow read, write: if false; // Server-side only via Admin SDK
    }
  }
}
```

---

## 📊 Configuration Google Sheets

### Service Account :

1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un projet → Activer l'API **Google Sheets API**
3. IAM & Admin → Comptes de service → Créer un compte
4. Créer une clé JSON → télécharger
5. Copier `client_email` et `private_key` dans `.env.local`

### Structure des Google Sheets :

#### Sheet 1 : Produits (PRODUCTS_SHEET_ID)
Onglet nommé : `Produits`

| A (ID) | B (Nom) | C (Catégorie) | D (Description) | E (Prix DA) | F (Stock) | G (Photos URLs) | H (Statut) | I (Promo %) |
|--------|---------|---------------|-----------------|-------------|-----------|-----------------|------------|-------------|
| PROD001 | Crème visage | Soin visage | Description... | 1500 | 50 | https://img1.jpg,https://img2.jpg | Actif | 20 |

- **Photos** : URLs séparées par des virgules
- **Statut** : `Actif` ou `Inactif`
- **Promo** : Pourcentage de réduction (ex: `20` pour -20%)

#### Sheet 2 : Livraison (DELIVERY_SHEET_ID)
Onglet nommé : `Livraison`

| A (Wilaya) | B (Commune) | C (Frais DA) |
|------------|-------------|--------------|
| Alger | Bab El Oued | 400 |
| Alger | Hydra | 400 |
| Oran | Oran Centre | 500 |

#### Sheet 3 : Commandes (ORDERS_SHEET_ID)
Onglet nommé : `Commandes`

Créez ces colonnes dans l'ordre :
```
Date | N° Commande | Produits | Quantité | Prix produits | Frais livraison | Total | Nom | Prénom | Téléphone | Wilaya | Commune | Statut
```

**Important** : Partagez chaque Google Sheet avec l'email du compte de service (avec droits d'éditeur).

---

## 🏗️ Architecture du projet

```
extrapack/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx            # Accueil
│   │   ├── catalogue/          # Catalogue produits
│   │   ├── product/[id]/       # Page produit
│   │   ├── checkout/           # Panier / Commande
│   │   ├── confirmation/       # Confirmation commande
│   │   ├── admin/              # Panneau admin
│   │   └── api/                # API Routes
│   │       ├── products/       # GET produits depuis Sheets
│   │       ├── delivery/       # GET zones livraison
│   │       ├── orders/         # POST/GET commandes
│   │       └── admin/stats/    # Statistiques admin
│   │
│   ├── components/
│   │   ├── layout/             # Navbar, Footer
│   │   ├── home/               # Sections page d'accueil
│   │   ├── product/            # ProductCard, OrderModal
│   │   ├── cart/               # CartDrawer
│   │   └── ui/                 # Skeleton, WhatsApp, DarkMode
│   │
│   ├── lib/
│   │   ├── firebase.ts         # Config Firebase
│   │   ├── firestore.ts        # Opérations Firestore
│   │   ├── sheets.ts           # Google Sheets API
│   │   ├── store.ts            # État global (Zustand)
│   │   └── utils.ts            # Utilitaires
│   │
│   └── types/index.ts          # Types TypeScript
│
├── public/                     # Assets statiques
├── .env.example               # Template variables d'environnement
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🔐 Panneau Administrateur

Accès : `/admin`

**Fonctionnalités :**
- 📊 Dashboard avec statistiques en temps réel
- 📦 Liste de toutes les commandes
- 🔍 Recherche par nom, téléphone, numéro de commande
- 🏷️ Filtre par statut
- ✏️ Mise à jour du statut (en un clic)
- 🔄 Synchronisation automatique avec Google Sheets

**Mot de passe** : Défini dans `ADMIN_PASSWORD` dans `.env.local`

---

## 🎨 Personnalisation

### Logo
Remplacez le texte "EXTRA PACK" dans `Navbar.tsx` par votre logo :
```jsx
<Image src="/logo.png" alt="Extra Pack" width={140} height={40} />
```
Placez votre logo dans `/public/logo.png`

### Couleurs
Modifiez les couleurs dans `tailwind.config.ts` → section `brand`.

### WhatsApp
Mettez votre numéro dans `.env.local` :
```
NEXT_PUBLIC_WHATSAPP_NUMBER=213XXXXXXXXX
```

---

## 🚢 Déploiement sur Vercel

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel

# 3. Configurer les variables d'environnement
# Sur le dashboard Vercel → Settings → Environment Variables
# Copier toutes les variables de .env.local
```

### Domaine personnalisé
Sur Vercel → Settings → Domains → Ajouter `extrapack.dz`

---

## 📱 Optimisation Mobile (Priority Mobile-First)

Le site est construit mobile-first :
- Formulaire de commande en bottom sheet sur mobile
- Images optimisées avec `next/image`
- Tailwind breakpoints : `sm:`, `md:`, `lg:`
- Meta viewport configuré

---

## 🎯 Optimisation Facebook Ads & TikTok Ads

### Meta Pixel (Facebook)
Ajoutez dans `layout.tsx` :
```html
<Script id="fb-pixel">
{`
  !function(f,b,e,v,n,t,s){...}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'VOTRE_PIXEL_ID');
  fbq('track', 'PageView');
`}
</Script>
```

### TikTok Pixel
```html
<Script id="tiktok-pixel">
{`
  !function (w, d, t) {...}(window, document, 'ttq');
  ttq.load('VOTRE_PIXEL_ID');
  ttq.page();
`}
</Script>
```

---

## 📞 Support

Pour toute question technique : contact@extrapack.dz

---

*Développé avec ❤️ pour le marché algérien · Extra Pack © 2024*
