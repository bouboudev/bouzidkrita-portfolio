# Bouzid Krita — Portfolio

Portfolio personnel de Bouzid Krita, positionné développement web, support applicatif et intégration.
Site statique, orienté performance, simplicité et maintenabilité : pas de CMS, pas de base de données, pas de framework JS côté client.

## Stack technique

- **Astro** : framework du site, génération statique.
- **HTML / CSS / JavaScript** : aucun framework JS côté client, scripts inline limités (menu mobile, thème, révélation au scroll).
- **Tailwind CSS** (via `@tailwindcss/vite`) : utilitaires CSS, combiné à un `global.css` maison (design tokens et classes).
- **TypeScript** : typage du projet (`tsconfig` strict), schémas de contenu validés avec Zod.
- **Content Collections / Markdown** : contenus projets, blog et expériences en Markdown (`src/content/`).
- **Netlify** : hébergement et déploiement du site statique.
- **Netlify Forms** : formulaire de contact, sans backend custom.
- **Umami Analytics (Cloud)** : mesure d'audience respectueuse de la vie privée, script intégré globalement.
- **GitHub Actions** : workflow du rapport analytics hebdomadaire.
- **Resend** : envoi du rapport hebdomadaire par email via API REST.
- **Node.js** : scripts (`>= 22.12.0` pour le projet, voir `package.json`) ; le script de rapport fonctionne avec Node 20 et `fetch` natif, sans dépendance.

## Fonctionnalités

- Pages : accueil, projets (liste + détail), parcours, blog (liste + article), à propos, contact, remerciement (`/merci/`), 404.
- Projets, articles et expériences gérés en Markdown via les Content Collections.
- Page parcours : timeline d'expériences + section formations.
- Formulaire de contact Netlify avec redirection vers `/merci/` et honeypot anti-spam.
- Responsive (navigation desktop + menu mobile accessible).
- Thème clair / sombre avec mémorisation (`localStorage`).
- SEO : sitemap automatique (`@astrojs/sitemap`), `robots.txt`, canonical, Open Graph / Twitter Cards, JSON-LD `Person`, HTML sémantique, skip-link.
- Analytics Umami avec événements personnalisés :
  - `github-click`
  - `linkedin-click`
  - `contact-click`
  - `contact-submit`
  - `contact-success` (déclenché au chargement de `/merci/` via `umami.track`)

## Structure du projet

```text
src/
  components/      # SiteHeader, SiteFooter, SectionHead, EntryRow, Icon
  layouts/         # Layout.astro : layout unique (CSS global, SEO, scripts)
  pages/           # index, projets, parcours, blog, a-propos, contact, merci, 404, robots.txt
  content/         # projects, blog, experience (Markdown)
  content.config.ts# schémas Zod des collections
  data/site.ts     # identité, liens, navigation
  lib/slug.ts      # slug à partir de l'id des contenus
  styles/global.css# design tokens et classes
public/            # favicon.svg
scripts/           # weekly-analytics-report.mjs
.github/workflows/ # weekly-analytics-report.yml
astro.config.mjs
netlify.toml
```

`global.css` n'est importé que dans `src/layouts/Layout.astro`. Le layout est unique : il porte le SEO, le script Umami et les scripts inline.

## Installation locale

```bash
git clone https://github.com/bouboudev/bouzidkrita-portfolio.git
cd bouzidkrita-portfolio
npm install
npm run dev
```

URL locale par défaut : `http://localhost:4321`.

## Build

```bash
npm run build
```

Le build statique génère `dist/`. Prévisualisation locale (script présent dans `package.json`) :

```bash
npm run preview
```

## Déploiement

Site déployé sur Netlify. Configuration effective dans `netlify.toml` :

- build command : `npm run build`
- publish directory : `dist`

URL canonique configurée dans le projet (`astro.config.mjs`, `src/data/site.ts`) : `https://www.bouzidkrita.com`.
En-têtes de sécurité définis dans `netlify.toml` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

## Formulaire de contact

- Géré par Netlify Forms (`data-netlify="true"`, `form-name="contact"`).
- Soumission en `POST` avec redirection vers `/merci/`.
- Honeypot anti-spam (`bot-field`).
- Aucune logique backend custom.

## Analytics

- Umami Cloud, approche privacy-friendly (pas de cookies publicitaires).
- Script intégré globalement dans le `<head>` du layout unique, chargé sur toutes les pages.
- Événements suivis via attributs natifs `data-umami-event` (`github-click`, `linkedin-click`, `contact-click`, `contact-submit`) et appel `umami.track('contact-success')` au chargement de `/merci/`.
- Statistiques consultables dans le dashboard Umami (partage via Share URL).
- Aucun token, clé ou secret n'est versionné dans le repo.

## Rapport analytics hebdomadaire automatisé

Fichiers :

- `scripts/weekly-analytics-report.mjs`
- `.github/workflows/weekly-analytics-report.yml`

Flux :

Umami (Share URL) → script Node.js → GitHub Actions → Resend → email de synthèse.

Le workflow :

- récupère les statistiques des 7 derniers jours (`startAt` = maintenant − 7 jours, `endAt` = maintenant) ;
- calcule visiteurs, visites, pages vues, taux de rebond (`bounces / visits * 100`), durée totale et durée moyenne par visite ;
- récupère top pages, sources (referrers, vide = « Direct ») et événements (`github-click`, `linkedin-click`, `contact-click`, `contact-submit`, `contact-success`, 0 si absent) ;
- envoie un email HTML via l'API Resend ;
- tourne automatiquement chaque lundi à 07:00 UTC ;
- peut être lancé manuellement avec `workflow_dispatch`.

Secrets GitHub requis (noms uniquement, jamais de valeurs dans le repo) :

- `UMAMI_SHARE_TOKEN`
- `UMAMI_WEBSITE_ID`
- `RESEND_API_KEY`
- `REPORT_EMAIL`
- `REPORT_FROM_EMAIL`

À ajouter dans : GitHub → Settings → Secrets and variables → Actions → Repository secrets.

## Test manuel du rapport

GitHub → Actions → Weekly Analytics Report → Run workflow.

Le domaine utilisé comme expéditeur doit être validé dans Resend, sinon l'envoi échoue (le workflow affiche le statut et sort en erreur).

## DNS / email

- Le repo ne contient aucune configuration DNS : rien n'est documenté ici à ce sujet.
- Resend sert uniquement à l'envoi du rapport hebdomadaire.
- Aucune valeur DKIM/SPF ni donnée sensible n'est documentée.

## Scripts utiles

| Commande          | Usage                          |
| ----------------- | ------------------------------ |
| `npm run dev`     | serveur de développement local |
| `npm run build`   | build statique de production   |
| `npm run preview` | prévisualiser le build         |
| `npm run astro`   | CLI Astro                      |

Le script de rapport se lance hors npm : `node scripts/weekly-analytics-report.mjs` (variables d'environnement requises, voir section rapport).

## Sécurité / secrets

- Aucun secret dans le repo.
- Secrets uniquement dans GitHub Actions (Repository secrets).
- Ne jamais committer de `.env` contenant des secrets.
- En cas d'exposition, renouveler le Share token Umami (via le Share URL) et les clés concernées.

## Licence

Projet personnel. Aucune licence open source n'est actuellement définie.

## Liens

- Site : https://www.bouzidkrita.com
- GitHub : https://github.com/bouboudev
- LinkedIn : https://fr.linkedin.com/in/bouzidkrita
