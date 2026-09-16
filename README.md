# Portfolio — Bouzid Krita

Site personnel statique : **professionnel du numérique — développement, support, intégration**.
Astro + TypeScript + Content Collections + Markdown. Aucun CMS, aucune base de données,
aucun framework JS côté client. Déployé sur Netlify en statique.

Baseline : _« Je développe, j’intègre, je dépanne et j’expérimente. »_

## Commandes

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # build statique -> dist/
npm run preview  # prévisualiser le build
```

## Direction artistique

« Carnet d’atelier » éditorial : fond papier, encre, un seul accent (braise),
titres serif (stack système, zéro dépendance), sur-titres mono numérotés
(`01 — Sélection`), filets horizontaux, listes éditoriales avec flèches au survol.
Clair par défaut, sombre via bouton (mémorisé en `localStorage`).
Aucune carte générique, aucune jauge, aucun effet gamer.

## Architecture

```text
src/
  content/
    projects/     # un .md = un projet
    blog/         # un .md = un article
    experience/   # un .md = une expérience (timeline : Bien’ici, Habiteo, Mercateam)
  content.config.ts  # schémas Zod des 3 collections
  lib/slug.ts        # slug à partir de l'id (Content Layer)
  data/site.ts       # identité, liens, navigation (Projets, Parcours, Blog, À propos, Contact)
  layouts/Layout.astro   # UNIQUE layout : importe global.css UNE fois + SEO + scripts
  components/            # SiteHeader, SiteFooter, SectionHead, EntryRow, Icon
  pages/
    index.astro
    projets/index.astro + projets/[slug].astro
    parcours.astro    # expériences + section Formations (statique)
    blog/index.astro + blog/[slug].astro
    a-propos.astro
    contact.astro     # Netlify Forms
    robots.txt.ts
  styles/global.css  # design tokens + classes (.wrap, .eyebrow, .title-*, .entry-row, .card, .btn, .chip, .facts, .fiche, .social-btn, .prose-bk)
public/favicon.svg
netlify.toml
```

Règle anti-bug : `global.css` n’est importé que dans `src/layouts/Layout.astro`.
Ne jamais dupliquer le layout, ne jamais importer le CSS ailleurs.

## Ajouter un projet

`src/content/projects/mon-projet.md` :

```md
---
title: "Titre"
description: "Résumé en une phrase."
category: "developpement" # developpement | support | integration | infrastructure | monitoring | automatisation | ia | web | personnel
status: "En cours"
stack: ["Vue.js", "Docker"]
highlights: ["Ce que j’ai fait"]
github: "https://github.com/bouboudev/..."
demo: "https://..."   # optionnel
featured: false       # true = accueil
order: 5
---

Contexte, besoin, solution, difficultés, apprentissages...
```

## Ajouter un article

`src/content/blog/mon-article.md` :

```md
---
title: "Titre"
description: "Résumé."
date: 2026-09-16
tags: ["support applicatif"]
readingTime: "5 min"
draft: false
---
```

## Ajouter une fiche d’expérimentation

Pas de rubrique Lab : si une expérimentation devient concrète, ajoutez-la
comme un projet (voir ci-dessus).

## Modifier le parcours

Les 3 expériences de la timeline sont un fichier chacune dans `src/content/experience/`
(`company, role, location?, startDate, endDate?, current, type, summary, highlights, stack, order`).
La section Formations (AFPA, design web) est en dur dans `src/pages/parcours.astro`.

## Déployer sur Netlify

1. Pousser sur GitHub/GitLab.
2. Netlify → Add new site → Import from Git.
3. Build : `npm run build`, dossier : `dist` (déjà dans `netlify.toml`).
4. Le formulaire `/contact` fonctionne via Netlify Forms (`data-netlify="true"` + `form-name`).
5. SEO inclus : sitemap auto, `robots.txt`, OpenGraph, canonical, JSON-LD Person,
   skip-link, HTML sémantique.

## Notes de contenu

Aucune expérience ni compétence inventée : les éléments incertains
(téléconseil, AFPA, associatif) sont marqués « à compléter » dans les fichiers.
