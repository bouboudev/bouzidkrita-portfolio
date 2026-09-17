---
title: "Monter un monitoring applicatif de zéro : ce que j'apprends"
description: "Retour d'expérience sur la mise en place de Prometheus, Grafana, Loki et Promtail autour d'une app Docker."
date: 2026-09-10
tags:
  - "support applicatif"
  - "monitoring"
  - "docker"
readingTime: "6 min"
---

J'utilisais du monitoring en entreprise sans l'avoir monté moi-même.
Ce projet m'a forcé à comprendre chaque brique : exposition des métriques,
scrape Prometheus, dashboards Grafana, centralisation des logs avec Loki.

Le plus formateur : simuler une panne, puis croiser métriques et logs
pour remonter à la cause racine. Ce n'est pas toujours simple — parfois
on casse quelque chose en cherchant — mais c'est exactement le travail
de support N2/N3 : hypothèses, preuves, documentation.

Prochaine étape : ajouter des scénarios d'incidents documentés de bout en bout.
Voir le [projet EasyTravel](/projets/easytravel-support-lab/).
