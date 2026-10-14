(function () {
  const state = {
    search: '',
    category: 'all',
    type: 'all',
    technology: 'all',
    feature: 'all'
  };

  function getLibrary() {
    const library = window.WEB_LIBRARY || {};
    const resources = Array.isArray(library.resources) ? library.resources.filter(Boolean) : [];
    return {
      generatedAt: library.generatedAt || '',
      resources,
      exactDuplicateGroups: Array.isArray(library.exactDuplicateGroups) ? library.exactDuplicateGroups : []
    };
  }

  function setText(node, value) {
    if (!node) return;
    node.textContent = value == null ? '' : String(value);
  }

  function normalizeStatus(value) {
    const raw = String(value || '').trim();
    if (!raw) return 'Inconnu';

    const map = {
      ready: 'Prêt',
      stable: 'Stable',
      active: 'Actif',
      draft: 'Brouillon',
      preview: 'Prévisualisation',
      archived: 'Archivé',
      deprecated: 'Obsolète',
      experimental: 'Expérimental',
      beta: 'Bêta',
      review: 'À vérifier',
      'in-progress': 'En cours',
      unknown: 'Inconnu'
    };

    const normalized = raw.toLowerCase();
    if (map[normalized]) {
      return map[normalized];
    }

    return raw
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function statusClass(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (!raw) return 'status-neutral';
    if (['ready', 'stable', 'active'].includes(raw)) return 'status-ready';
    if (['preview', 'beta', 'review', 'experimental'].includes(raw)) return 'status-warning';
    if (['archived', 'deprecated'].includes(raw)) return 'status-archive';
    return 'status-neutral';
  }

  function flattenUnique(values) {
    return Array.from(new Set((values || []).map((entry) => String(entry || '').trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  }

  function sanitizeHref(value) {
    if (!value) return '#';
    const stringValue = String(value).trim();
    if (!stringValue) return '#';
    if (/^(https?:|mailto:|file:|data:|#)/i.test(stringValue)) {
      return stringValue;
    }
    const normalized = stringValue.replace(/\\/g, '/');
    if (normalized.startsWith('./') || normalized.startsWith('../') || normalized.startsWith('/')) {
      return normalized;
    }
    return '../' + normalized;
  }

  function isExactDuplicate(resource) {
    if (!resource) return false;
    return Boolean(resource.exactDuplicate) || String(resource.exactDuplicate || '').toLowerCase() === 'true';
  }

  function countUnexecuted(resources) {
    return resources.filter((resource) => {
      const raw = String(resource.status || '').trim().toLowerCase();
      return raw !== 'ready';
    }).length;
  }

  function renderSummary(library) {
    const summaryNode = document.getElementById('librarySummary');
    const totalNode = document.getElementById('metricTotal');
    const categoriesNode = document.getElementById('metricCategories');
    const technologiesNode = document.getElementById('metricTechnologies');
    const readyNode = document.getElementById('metricReady');

    const resources = library.resources;
    const categories = flattenUnique(resources.flatMap((resource) => resource.categories || []));
    const technologies = flattenUnique(resources.flatMap((resource) => resource.technologies || []));
    const untestedCount = countUnexecuted(resources);

    setText(totalNode, resources.length);
    setText(categoriesNode, categories.length);
    setText(technologiesNode, technologies.length);
    setText(readyNode, untestedCount);

    if (library.generatedAt) {
      setText(summaryNode, 'Bibliothèque locale active · dernière mise à jour : ' + library.generatedAt);
    } else {
      setText(summaryNode, 'Bibliothèque locale active · ' + resources.length + ' ressource(s) indexée(s).');
    }
  }

  function populateSelect(select, options, labelFallback) {
    const values = flattenUnique(options);
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = 'all';
    defaultOption.textContent = labelFallback;
    select.appendChild(defaultOption);

    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function renderFilters(library) {
    const resources = library.resources;
    const categories = flattenUnique(resources.flatMap((resource) => resource.categories || []));
    const types = flattenUnique(resources.map((resource) => resource.type || 'Autre'));
    const technologies = flattenUnique(resources.flatMap((resource) => resource.technologies || []));
    const features = flattenUnique(resources.flatMap((resource) => resource.features || []));

    populateSelect(document.getElementById('categoryFilter'), categories, 'Toutes');
    populateSelect(document.getElementById('typeFilter'), types, 'Tous');
    populateSelect(document.getElementById('technologyFilter'), technologies, 'Toutes');
    populateSelect(document.getElementById('featureFilter'), features, 'Toutes');

    document.getElementById('categoryFilter').value = state.category;
    document.getElementById('typeFilter').value = state.type;
    document.getElementById('technologyFilter').value = state.technology;
    document.getElementById('featureFilter').value = state.feature;
  }

  function renderDuplicateGroups(library) {
    const container = document.getElementById('duplicateGroups');
    const groups = Array.isArray(library.exactDuplicateGroups) ? library.exactDuplicateGroups : [];
    container.innerHTML = '';

    if (!groups.length) {
      const note = document.createElement('p');
      note.className = 'duplicate-note';
      note.textContent = 'Aucun groupe de doublons exacts n’a été signalé pour cette collection.';
      container.appendChild(note);
      return;
    }

    groups.forEach((group, index) => {
      const root = document.createElement('div');
      root.className = 'duplicate-group';

      const title = document.createElement('h4');
      title.textContent = 'Groupe ' + (index + 1);
      root.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'duplicate-list';
      const paths = Array.isArray(group && group.paths) ? group.paths : [];

      paths.forEach((item) => {
        const line = document.createElement('li');
        line.textContent = item || 'Chemin inconnu';
        list.appendChild(line);
      });

      root.appendChild(list);

      if (group && group.hash) {
        const hash = document.createElement('div');
        hash.className = 'duplicate-hash';
        hash.textContent = 'SHA-256 : ' + group.hash;
        root.appendChild(hash);
      }

      const note = document.createElement('p');
      note.className = 'duplicate-note';
      note.textContent = 'Aucun fichier n’a été supprimé : ces chemins sont listés uniquement pour information.';
      root.appendChild(note);

      container.appendChild(root);
    });
  }

  function filterResources(resources) {
    const query = state.search.trim().toLowerCase();

    return resources.filter((resource) => {
      const haystack = [
        resource.name,
        resource.description,
        resource.type,
        ...(resource.categories || []),
        ...(resource.technologies || []),
        ...(resource.features || []),
        resource.sourcePath,
        resource.status,
        resource.href,
        resource.previewPath
      ].join(' ').toLowerCase();

      const matchesSearch = !query || haystack.includes(query);
      const matchesCategory = state.category === 'all' || (resource.categories || []).includes(state.category);
      const matchesType = state.type === 'all' || resource.type === state.type;
      const matchesTechnology = state.technology === 'all' || (resource.technologies || []).includes(state.technology);
      const matchesFeature = state.feature === 'all' || (resource.features || []).includes(state.feature);

      return matchesSearch && matchesCategory && matchesType && matchesTechnology && matchesFeature;
    });
  }

  function renderActiveFilters() {
    const activeFilters = [];
    if (state.search) activeFilters.push('Recherche: ' + state.search);
    if (state.category !== 'all') activeFilters.push('Catégorie: ' + state.category);
    if (state.type !== 'all') activeFilters.push('Type: ' + state.type);
    if (state.technology !== 'all') activeFilters.push('Technologie: ' + state.technology);
    if (state.feature !== 'all') activeFilters.push('Fonctionnalité: ' + state.feature);

    const container = document.getElementById('activeFilters');
    container.innerHTML = '';

    if (!activeFilters.length) {
      const chip = document.createElement('span');
      chip.className = 'filter-chip';
      chip.textContent = 'Tout afficher';
      container.appendChild(chip);
      return;
    }

    activeFilters.forEach((label) => {
      const chip = document.createElement('span');
      chip.className = 'filter-chip';
      chip.textContent = label;
      container.appendChild(chip);
    });
  }

  function renderCards(resources) {
    const grid = document.getElementById('resourceGrid');
    grid.innerHTML = '';

    if (!resources.length) {
      document.getElementById('emptyState').hidden = false;
      return;
    }

    document.getElementById('emptyState').hidden = true;

    resources.forEach((resource) => {
      const card = document.createElement('article');
      card.className = 'resource-card';

      const categoryText = (resource.categories && resource.categories.length) ? resource.categories[0] : 'Divers';
      const topRow = document.createElement('div');
      topRow.className = 'card-header';

      const categoryBadge = document.createElement('span');
      categoryBadge.className = 'category-badge';
      categoryBadge.textContent = categoryText;

      const badges = document.createElement('div');
      badges.style.display = 'flex';
      badges.style.flexWrap = 'wrap';
      badges.style.gap = '8px';
      badges.style.justifyContent = 'flex-end';

      const statusBadge = document.createElement('span');
      statusBadge.className = 'status-badge ' + statusClass(resource.status);
      statusBadge.textContent = normalizeStatus(resource.status);
      badges.appendChild(statusBadge);

      if (isExactDuplicate(resource)) {
        const duplicateBadge = document.createElement('span');
        duplicateBadge.className = 'duplicate-badge';
        duplicateBadge.textContent = 'Doublon exact';
        badges.appendChild(duplicateBadge);
      }

      topRow.appendChild(categoryBadge);
      topRow.appendChild(badges);
      card.appendChild(topRow);

      if (resource.previewPath) {
        const previewWrap = document.createElement('div');
        previewWrap.className = 'preview-frame';

        const preview = document.createElement('img');
        preview.className = 'resource-preview';
        preview.loading = 'lazy';
        preview.decoding = 'async';
        preview.alt = 'Aperçu de ' + (resource.name || 'cette ressource');
        preview.src = sanitizeHref(resource.previewPath);
        preview.onerror = function () {
          preview.remove();
        };

        previewWrap.appendChild(preview);
        card.appendChild(previewWrap);
      }

      const title = document.createElement('h3');
      title.textContent = resource.name || 'Sans titre';
      card.appendChild(title);

      const description = document.createElement('p');
      description.className = 'description';
      description.textContent = resource.description || 'Aucune description fournie.';
      card.appendChild(description);

      const metaList = document.createElement('div');
      metaList.className = 'meta-list';

      const typeItem = document.createElement('div');
      typeItem.className = 'meta-item';
      const typeLabel = document.createElement('span');
      typeLabel.textContent = 'Type';
      const typeValue = document.createElement('strong');
      typeValue.textContent = resource.type || 'Inconnu';
      typeItem.appendChild(typeLabel);
      typeItem.appendChild(typeValue);
      metaList.appendChild(typeItem);

      if ((resource.technologies || []).length) {
        const techItem = document.createElement('div');
        techItem.className = 'meta-item';
        const techLabel = document.createElement('span');
        techLabel.textContent = 'Technologies';
        const tagList = document.createElement('div');
        tagList.className = 'tag-list';

        (resource.technologies || []).slice(0, 6).forEach((technology) => {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = technology;
          tagList.appendChild(tag);
        });

        techItem.appendChild(techLabel);
        techItem.appendChild(tagList);
        metaList.appendChild(techItem);
      }

      if ((resource.features || []).length) {
        const featureItem = document.createElement('div');
        featureItem.className = 'meta-item';
        const featureLabel = document.createElement('span');
        featureLabel.textContent = 'Fonctionnalités';
        const featureTags = document.createElement('div');
        featureTags.className = 'tag-list';

        (resource.features || []).slice(0, 6).forEach((feature) => {
          const tag = document.createElement('span');
          tag.className = 'tag';
          tag.textContent = feature;
          featureTags.appendChild(tag);
        });

        featureItem.appendChild(featureLabel);
        featureItem.appendChild(featureTags);
        metaList.appendChild(featureItem);
      }

      const sourceItem = document.createElement('div');
      sourceItem.className = 'meta-item';
      const sourceLabel = document.createElement('span');
      sourceLabel.textContent = 'Source';
      const sourcePath = document.createElement('code');
      sourcePath.className = 'source-path';
      sourcePath.textContent = resource.sourcePath || resource.href || 'Source non fournie';
      sourceItem.appendChild(sourceLabel);
      sourceItem.appendChild(sourcePath);
      metaList.appendChild(sourceItem);

      card.appendChild(metaList);

      const actions = document.createElement('div');
      actions.className = 'card-actions';

      const sourceLink = document.createElement('a');
      sourceLink.className = 'action-link primary';
      sourceLink.href = sanitizeHref(resource.href || resource.sourcePath);
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = 'Ouvrir la source';
      actions.appendChild(sourceLink);

      const instructionsPanel = document.createElement('details');
      instructionsPanel.className = 'instructions-panel';
      const summary = document.createElement('summary');
      summary.textContent = 'Instructions de lancement';
      const instructionsBlock = document.createElement('pre');
      instructionsBlock.textContent = resource.startInstructions || 'Aucune instruction de lancement n’a été fournie pour cette ressource.';
      instructionsPanel.appendChild(summary);
      instructionsPanel.appendChild(instructionsBlock);
      card.appendChild(instructionsPanel);
      card.appendChild(actions);

      grid.appendChild(card);
    });
  }

  function render() {
    const library = getLibrary();
    renderSummary(library);
    renderFilters(library);
    renderDuplicateGroups(library);
    renderActiveFilters();

    const visibleResources = filterResources(library.resources);
    renderCards(visibleResources);

    if (!library.resources.length) {
      document.getElementById('noDataState').hidden = false;
      document.getElementById('emptyState').hidden = true;
      document.getElementById('errorState').hidden = true;
      return;
    }

    document.getElementById('noDataState').hidden = true;
    document.getElementById('errorState').hidden = true;
  }

  function bindEvents() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (event) => {
      state.search = event.target.value.trim();
      render();
    });

    document.getElementById('categoryFilter').addEventListener('change', (event) => {
      state.category = event.target.value;
      render();
    });

    document.getElementById('typeFilter').addEventListener('change', (event) => {
      state.type = event.target.value;
      render();
    });

    document.getElementById('technologyFilter').addEventListener('change', (event) => {
      state.technology = event.target.value;
      render();
    });

    document.getElementById('featureFilter').addEventListener('change', (event) => {
      state.feature = event.target.value;
      render();
    });

    document.getElementById('resetFilters').addEventListener('click', () => {
      state.search = '';
      state.category = 'all';
      state.type = 'all';
      state.technology = 'all';
      state.feature = 'all';

      document.getElementById('searchInput').value = '';
      document.getElementById('categoryFilter').value = 'all';
      document.getElementById('typeFilter').value = 'all';
      document.getElementById('technologyFilter').value = 'all';
      document.getElementById('featureFilter').value = 'all';
      render();
    });
  }

  function init() {
    const library = getLibrary();
    if (!window.WEB_LIBRARY || !Array.isArray(window.WEB_LIBRARY.resources)) {
      document.getElementById('errorState').hidden = false;
      document.getElementById('resourceGrid').innerHTML = '';
      return;
    }

    bindEvents();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());


