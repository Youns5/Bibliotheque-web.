# Bibliothèque Web

Catalogue local limité aux templates, sites, expériences et assets contenus dans [`web-templates-main`](../web-templates-main/). Les anciens portfolios GitHub et les autres dossiers personnels ne font pas partie de cette bibliothèque.

## Parcourir la collection

Ouvrir [`index.html`](./index.html) dans un navigateur. La galerie est autonome, en français, fonctionne depuis `file://` et ne nécessite ni serveur, ni dépendances, ni accès réseau. La recherche porte sur les noms, descriptions, types, technologies, fonctionnalités et chemins. Les liens « Ouvrir la source » pointent vers les fichiers ou points d’entrée originaux.

Les aperçus affichés proviennent de fichiers image déjà présents dans les projets. Aucun site n’a été lancé pour produire des captures; les fiches indiquent explicitement les projets non exécutés et les éléments incomplets.

## Contenu inventorié

Le catalogue représente les fichiers HTML et les assets de `web-templates-main`. Les fiches de sites multi-pages regroupent leurs pages liées; les templates HTML autonomes restent consultables séparément. Les catégories peuvent se recouper lorsqu’une ressource est utile depuis plusieurs filtres, sans multiplier ni copier les sources.

- **Sites 3D** : scènes et rendus identifiés par la présence de Three.js, React Three Fiber ou d’éléments de rendu/caméra WebGL. Une animation CSS seule n’est pas classée comme scène 3D.
- **Sites 2D / landing pages** : templates HTML autonomes, landings complètes et sites multi-pages.
- **Applications Web / portfolios** : projets Vite, React et Next.js, classés selon leur usage réel.
- **Expériences visuelles** : prototypes, shaders et pages expérimentales; les entrées avec scène 3D restent aussi accessibles dans « Sites 3D ».
- **Ressources graphiques** : modèles, images, icônes SVG, vidéo et autres médias présents dans le workspace, ainsi que les icônes du projet pédagogique inclus.
- **Outils et bases de projets** : notamment le fragment Flask/Jinja, signalé incomplet car le module d’application, les routes et les fichiers statiques référencés ne sont pas présents dans son dossier.

Les animations et fonctions UI sont indexées comme technologies/fonctionnalités des projets qui les hébergent. Aucun kit indépendant de composants UI n’a été repéré; les composants restent donc à leur emplacement dans le portfolio ou le site concerné, plutôt que d’être présentés comme des projets autonomes.

Le scan inclut uniquement [`web-templates-main`](../web-templates-main/), avec ses expériences, templates React, pages multi-sites et assets associés. Les portfolios ou projets trouvés dans d’autres dossiers ne sont pas inclus.

## Préservation et doublons

Aucun projet original ni asset n’a été déplacé, renommé, remplacé ou supprimé. Le classement est logique : catégories et tags permettent de retrouver une même fiche depuis plusieurs filtres sans créer de copies ni casser les chemins relatifs des projets.

`catalogue.json` et la section repliable « Groupes de doublons exacts » recensent les groupes de fichiers identiques par SHA-256 à l’intérieur de `web-templates-main`. Ce sont des résultats au niveau fichier, pas la preuve que des projets entiers sont identiques. Aucune copie n’est supprimée.

Les variantes et pages strictement identiques restent distinctes et accessibles dans leurs emplacements d’origine.

Les licences et mentions d’origine sont restées avec les projets. Consulter les licences et notices fournies par la collection avant réutilisation.

## Données et mise à jour

- [`catalogue.json`](./catalogue.json) : inventaire lisible par machine, avec emplacements relatifs à `Downloads`, technologies, fonctionnalités, instructions et groupes de doublons.
- [`catalogue-data.js`](./catalogue-data.js) : même inventaire sous forme de variable globale pour que la galerie fonctionne directement en `file://`.
- [`build-catalog.ps1`](./build-catalog.ps1) : générateur sans dépendances qui rescane les familles de projets connues et recalcule les SHA-256.

Pour rafraîchir le catalogue après ajout de ressources dans les familles suivies, ouvrir PowerShell dans ce dossier puis exécuter :

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\build-catalog.ps1
```

Le script ne change pas la stratégie d’exécution PowerShell; il ne scanne que `web-templates-main` et écrit les deux fichiers de catalogue. Les autres projets, même s’ils se trouvent à proximité, ne seront pas ajoutés au catalogue.

## État des vérifications

Les chemins sources et liens ont été vérifiés; les scripts de la galerie ont été contrôlés. **Les projets ne sont pas déclarés testés** : leurs dépendances n’ont pas été installées et aucun projet n’a été démarré. Les projets à lancer indiquent leurs commandes seulement lorsque la configuration ou la documentation les fournit.
