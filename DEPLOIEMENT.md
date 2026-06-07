# 🚀 Guide Déploiement — Extra Pack sur Vercel

## Prérequis
- Node.js 18+ installé
- Compte Vercel (gratuit sur vercel.com)
- Firebase configuré
- Google Sheets configuré

---

## Déploiement en 5 minutes

### Option A : Via GitHub (recommandé)

1. **Créez un repo GitHub** et poussez le code :
```bash
git init
git add .
git commit -m "🚀 Initial commit Extra Pack"
git remote add origin https://github.com/votre-user/extrapack.git
git push -u origin main
```

2. **Connectez Vercel** :
   - Allez sur vercel.com → New Project
   - Importez votre repo GitHub
   - Framework : **Next.js** (détecté automatiquement)

3. **Ajoutez les variables d'environnement** dans Vercel :
   - Settings → Environment Variables
   - Copiez toutes les variables de votre `.env.local`

4. Cliquez **Deploy** → Votre site est en ligne ! 🎉

### Option B : Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Domaine personnalisé extrapack.dz

1. Vercel → Votre projet → Settings → Domains
2. Ajoutez : `www.extrapack.dz`
3. Chez votre registraire DNS, ajoutez :
   - Type : **CNAME**
   - Nom : `www`
   - Valeur : `cname.vercel-dns.com`

---

## Commandes utiles

```bash
npm run dev      # Développement local
npm run build    # Vérifier la build avant déploiement
npm run lint     # Vérifier les erreurs
vercel --prod    # Déployer en production
```
