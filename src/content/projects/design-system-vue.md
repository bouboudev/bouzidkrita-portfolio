---
title: "Design System Vue"
description: "Design System modulaire construit avec Vue 3, documenté sous Storybook, avec tests et approche Atomic Design."
category: "web"
status: "Terminé (démonstrateur)"
stack:
  - "Vue 3"
  - "TypeScript"
  - "PrimeVue"
  - "Storybook"
  - "Vitest"
  - "Playwright"
highlights:
  - "Architecture en Atomic Design (atoms, molecules, organisms) avec composants préfixés \"Ds\""
  - "Encapsulation de PrimeVue derrière une API propre au Design System pour réduire le couplage"
  - "Documentation complète des composants sous Storybook"
  - "Tests unitaires (Vitest, Testing Library) et tests end-to-end (Playwright)"
  - "Tooling de qualité : ESLint, Prettier, couverture de code"
github: "https://github.com/bouboudev/design-system-vue"
demo: "https://design-system-vue.netlify.app/"
featured: true
order: 2
---

Ce Design System construit avec Vue 3 a été conçu comme démonstrateur d'une approche réaliste de
Design System d'entreprise, avec une attention particulière portée à l'architecture, la
documentation et la qualité.

Les composants suivent une organisation en Atomic Design (atoms, molecules, organisms) et sont
préfixés `Ds` pour bien identifier la couche de design system. La librairie PrimeVue est utilisée
comme base pour certains composants, mais toujours encapsulée derrière une API propre au projet afin
de limiter le couplage avec la dépendance tierce.

L'ensemble des composants est documenté sous Storybook, avec des tests unitaires (Vitest, Testing
Library Vue, Vue Test Utils) et des tests end-to-end (Playwright), ainsi qu'un tooling de qualité
complet (ESLint, Prettier, couverture de code).

*Le projet n'a volontairement pas vocation à être exhaustif fonctionnellement : son objectif est de
démontrer une approche et une méthodologie, pas de constituer une librairie UI complète.*