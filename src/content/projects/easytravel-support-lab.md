---
title: "EasyTravel Application Support Lab"
description: "Laboratoire de support applicatif basé sur Dynatrace EasyTravel pour simuler, investiguer et documenter des incidents en conditions réalistes."
category: "support"
status: "En cours"
stack:
  - "Docker"
  - "Docker Compose"
  - "Dynatrace EasyTravel"
  - "Prometheus"
  - "Grafana"
  - "Loki"
  - "Telegraf"
highlights:
  - "Simulation d'incidents applicatifs réalistes (panne, dégradation, comportement anormal)"
  - "Pipeline de supervision : conteneurs Docker → Telegraf → Prometheus → Grafana"
  - "Pipeline de logs : conteneurs Docker → Grafana Alloy → Loki → Grafana"
  - "Investigation via métriques et logs (LogQL) pour identifier la cause racine"
  - "Documentation structurée de chaque incident (contexte, diagnostic, résolution)"
github: "https://github.com/bouboudev/easytravel-application-support-lab"
featured: true
order: 1
---

Ce laboratoire personnel a pour objectif de reproduire une démarche de support applicatif N2/N3 en
conditions proches du réel, à partir de l'application de démonstration Dynatrace EasyTravel
déployée via Docker.

La stack de supervision repose sur deux pipelines distincts : un pipeline de métriques (Telegraf →
Prometheus → Grafana) et un pipeline de logs (Grafana Alloy → Loki → Grafana), permettant de croiser
les deux sources d'information lors d'une investigation.

Chaque scénario de panne est simulé, analysé à l'aide des métriques et des logs (via des requêtes
LogQL), puis documenté avec la démarche complète : contexte, hypothèses, diagnostic, cause racine et
résolution. L'objectif est de démontrer une méthodologie rigoureuse de diagnostic d'incidents plutôt
qu'un simple exercice technique isolé.

*Projet en cours : de nouveaux scénarios d'incidents sont progressivement ajoutés et documentés.*