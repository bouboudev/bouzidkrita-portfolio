---
title: "Quittance de Loyer"
description: "Application Vue 3 permettant de générer une quittance de loyer avec aperçu en direct et export PDF."
category: "web"
status: "Terminé"
stack:
  - "Vue 3"
  - "TypeScript"
  - "Tailwind CSS"
  - "jsPDF"
  - "html2canvas"
highlights:
  - "Formulaire réactif avec calcul automatique du total loyer + charges"
  - "Aperçu de la quittance mis à jour en temps réel"
  - "Génération de PDF A4 téléchargeable"
  - "Interface responsive mobile / desktop"
  - "Architecture simple sans router ni store (Composition API)"
github: "https://github.com/bouboudev/quittance-loyer"
demo: "https://quittanceloyer.netlify.app/"
featured: true
order: 3
---

Mini application Vue 3 répondant à un besoin métier concret : générer facilement une quittance de
loyer avec aperçu en temps réel et export PDF.

Le projet démontre une approche pragmatique du développement frontend : utiliser les technologies
modernes (Vue 3, TypeScript, Tailwind) sans sur-engineer l'architecture. Il n'y a volontairement pas
de store (Pinia), pas de router (Vue Router) — l'état est géré avec les primitives Vue et la
réactivité de la Composition API.

Le formulaire capture les informations propriétaire et locataire, calcule automatiquement les totaux,
affiche un aperçu de la quittance mise à jour en temps réel, et permet de générer un PDF A4
téléchargeable. L'interface est entièrement responsive.

C'est un bon exemple de la capacité à créer un outil web utile et fiable sans ajouter de complexité
inutile.