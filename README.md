# Bibliothèque Web

Ce dépôt regroupe plusieurs projets web indépendants : portfolios, templates de landing pages, maquettes 3D et une petite bibliothèque de ressources visuelles. Il ne s’agit pas d’une seule application unique, mais d’un espace de travail contenant plusieurs expérimentations et modèles prêts à être consultés ou réutilisés.

## Contenu du dépôt

- `3d-portfolio-main/` : portfolio moderne en Next.js avec design 3D, admin panel, SEO et intégration Supabase.
- `Bibliotheque-Web/` : galerie locale pour parcourir et catégoriser des templates, sites et assets présents dans `web-templates-main/`.
- `Portfolio -2/` : autre template de portfolio avec structure HTML/Vite.
- `my-portfolio/` : portfolio personnel ou template inspiré d’un style cosmic / immersif en Vite + Three.js.
- `web-templates-main/` : grande collection de templates et pages web, landing pages, sites React et expériences visuelles.

## Structure générale

```text
Bibliotheque web/
├── README.md
├── 3d-portfolio-main/
├── Bibliotheque-Web/
├── Portfolio -2/
├── my-portfolio/
├── web-templates-main/
├── LICENSE
└── ...
```

## Comment l’utiliser

### 1) Explorer les projets

Ouvre directement le dossier qui correspond à ton besoin :

- Portfolio premium / Next.js : `3d-portfolio-main/`
- Galerie de ressources : `Bibliotheque-Web/`
- Portfolio Vue/Vite léger : `Portfolio -2/`
- Portfolio 3D stylé : `my-portfolio/`
- Templates HTML / landing pages : `web-templates-main/`

### 2) Lancer un projet

Chaque dossier est autonome. Il faut généralement ouvrir le projet concerné et suivre son README interne.

Exemples :

```bash
cd 3d-portfolio-main
npm install
npm run dev
```

ou

```bash
cd my-portfolio
npm install
npm run dev
```

### 3) Utiliser la bibliothèque locale

Le dossier `Bibliotheque-Web/` contient une galerie HTML autonome :

```bash
cd Bibliotheque-Web
# puis ouvre index.html dans le navigateur
```

## Objectif du projet

Ce dépôt sert de coffre-fort de ressources web :

- découverte de styles de portfolio,
- comparaison de stacks (Next.js, Vite, Three.js, HTML/CSS),
- récupération de templates prêts à personnaliser,
- organisation visuelle d’un ensemble de références de sites web.

## Remarques

- Il n’y a pas de monorepo unique avec un seul lancement global.
- Chaque projet peut avoir ses propres dépendances, scripts et configuration.
- La plupart des sous-dossiers disposent déjà de leur propre README spécifique ; il faut les consulter pour les instructions exactes.

## Licence

Le dépôt racine contient une licence générale, mais certains sous-projets peuvent avoir leurs propres licences ou notices d’usage. Vérifie le fichier `LICENSE` ou les fichiers internes avant toute réutilisation commerciale.

