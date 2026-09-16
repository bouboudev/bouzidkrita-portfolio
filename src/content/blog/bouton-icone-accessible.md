---
title: "Accessibilité : un bouton icône doit avoir un nom"
description: "aria-label et aria-hidden en pratique pour les lecteurs d'écran."
date: 2026-08-20
tags:
  - "accessibilité"
  - "frontend"
  - "html"
readingTime: "3 min"
---

Un bouton avec uniquement une icône peut être annoncé simplement comme « bouton »
par un lecteur d'écran, sans préciser l'action.

À éviter :

```html
<button><svg>...</svg></button>
```

Mieux :

```html
<button aria-label="Supprimer le document">
  <svg aria-hidden="true">...</svg>
</button>
```

`aria-label` donne un nom accessible, `aria-hidden` évite d'annoncer l'icône décorative.
Une interface compréhensible ne doit pas dépendre uniquement du visuel.
