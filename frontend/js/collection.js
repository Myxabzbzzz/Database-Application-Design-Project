/* =========================================================
   ALVA – collection.js
   Fetches items from API, handles filters & sort
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var API      = window.API_BASE;
  var allItems = [];   /* full list from API */

  var state = {
    category: 'All',
    priceMin: 0,
    priceMax: Infinity,
    sort:     'featured',
    search:   '',
    page:     1,
    perPage:  12
  };

  var gridEl      = document.getElementById('product-grid');
  var countEl     = document.getElementById('results-count');
  var loadMoreBtn = document.getElementById('load-more-btn');

  /* =========================================================
     LOAD CATEGORIES → populate filter tabs + sidebar
     ========================================================= */
  function loadCategories() {
    fetch(API + '/categories', { headers: { 'Accept': 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var cats = (data.data) || [];
        buildCategoryUI(cats.map(function (c) { return c.value; }));
        applyUrlCategory();
      })
      .catch(function () { applyUrlCategory(); });
  }

  function buildCategoryUI(categories) {
    /* filter tabs */
    var tabsEl = document.getElementById('filter-tabs');
    if (tabsEl) {
      tabsEl.innerHTML =
        '<button class="filter-tab active" data-category="All">All</button>' +
        categories.map(function (c) {
          return '<button class="filter-tab" data-category="' + c + '">' + c + '</button>';
        }).join('');
      wireTabClicks();
    }

    /* sidebar category radios */
    var sidebarCatEl = document.getElementById('sidebar-categories');
    if (sidebarCatEl) {
      sidebarCatEl.innerHTML =
        '<label class="sidebar-option"><input type="radio" class="category-radio" name="cat" value="All" checked><span class="sidebar-option-label">All</span></label>' +
        categories.map(function (c) {
          return '<label class="sidebar-option"><input type="radio" class="category-radio" name="cat" value="' + c + '"><span class="sidebar-option-label">' + c + '</span></label>';
        }).join('');
      wireSidebarCatRadios();
    }
  }

  /* =========================================================
     LOAD ITEMS
     ========================================================= */
  function loadItems() {
    if (countEl) countEl.textContent = 'Loading…';
    if (gridEl)  gridEl.innerHTML    = '';

    var url = API + '/items?per_page=200&is_active=1';
    fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = (data.data && data.data.data) || data.data || [];
        if (!Array.isArray(items)) items = [];
        allItems = items;
        state.page = 1;
        render();
      })
      .catch(function () {
        if (countEl) countEl.textContent = '0 products';
        if (gridEl)  gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-3);">Failed to load products.</div>';
      });
  }

  /* =========================================================
     FILTER + SORT + RENDER
     ========================================================= */
  function getFiltered() {
    return allItems.filter(function (item) {
      if (state.category !== 'All' && item.category !== state.category) return false;
      var price = parseFloat(item.price);
      if (price < state.priceMin || price > state.priceMax) return false;
      if (state.search) {
        var q    = state.search.toLowerCase();
        var name = (item.name || '').toLowerCase();
        var brand = ((item.designer && item.designer.name) || '').toLowerCase();
        if (name.indexOf(q) === -1 && brand.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function getSorted(arr) {
    var copy = arr.slice();
    switch (state.sort) {
      case 'price-asc':  copy.sort(function (a, b) { return parseFloat(a.price) - parseFloat(b.price); }); break;
      case 'price-desc': copy.sort(function (a, b) { return parseFloat(b.price) - parseFloat(a.price); }); break;
      case 'newest':     copy.sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at); }); break;
    }
    return copy;
  }

  function render() {
    var filtered = getSorted(getFiltered());
    var shown    = filtered.slice(0, state.page * state.perPage);

    if (countEl) countEl.textContent = filtered.length + ' product' + (filtered.length !== 1 ? 's' : '');
    if (!gridEl) return;

    if (filtered.length === 0) {
      gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-3);font-size:0.9rem;">No products match your filters.</div>';
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    gridEl.innerHTML = shown.map(renderItemCard).join('');

    gridEl.querySelectorAll('.product-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        window.location.href = 'product.html?id=' + card.dataset.id;
      });
    });

    gridEl.querySelectorAll('.product-card-like').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var added = toggleWishlist(btn.dataset.id);
        btn.classList.toggle('liked', added);
        showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
      });
    });

    if (loadMoreBtn) {
      var remaining = filtered.length - shown.length;
      loadMoreBtn.style.display = remaining > 0 ? 'inline-flex' : 'none';
      if (remaining > 0) loadMoreBtn.textContent = 'Load More (' + remaining + ' remaining)';
    }
  }

  /* =========================================================
     EVENT WIRING
     ========================================================= */
  function wireTabClicks() {
    document.querySelectorAll('.filter-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        state.category = tab.dataset.category;
        state.page = 1;
        syncSidebarCat(state.category);
        render();
      });
    });
  }

  function wireSidebarCatRadios() {
    document.querySelectorAll('.category-radio').forEach(function (radio) {
      radio.addEventListener('change', function () {
        state.category = radio.value;
        state.page = 1;
        syncTabs(state.category);
        render();
      });
    });
  }

  function syncTabs(cat) {
    document.querySelectorAll('.filter-tab').forEach(function (t) {
      t.classList.toggle('active', t.dataset.category === cat);
    });
  }

  function syncSidebarCat(cat) {
    document.querySelectorAll('.category-radio').forEach(function (r) {
      r.checked = r.value === cat;
    });
  }

  /* Sort */
  var sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      state.page = 1;
      render();
    });
  }

  /* Price range */
  var priceMinEl = document.getElementById('price-min');
  var priceMaxEl = document.getElementById('price-max');
  function updatePrice() {
    state.priceMin = parseInt(priceMinEl && priceMinEl.value) || 0;
    state.priceMax = parseInt(priceMaxEl && priceMaxEl.value) || Infinity;
    state.page = 1;
    render();
  }
  if (priceMinEl) priceMinEl.addEventListener('input', updatePrice);
  if (priceMaxEl) priceMaxEl.addEventListener('input', updatePrice);

  /* Search (if there's a search input on the page) */
  var searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      state.search = searchEl.value.trim();
      state.page = 1;
      render();
    });
  }

  /* Clear filters */
  var clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      state.category = 'All';
      state.priceMin = 0;
      state.priceMax = Infinity;
      state.search   = '';
      state.page     = 1;
      if (priceMinEl) priceMinEl.value = '';
      if (priceMaxEl) priceMaxEl.value = '';
      if (searchEl)   searchEl.value   = '';
      syncTabs('All');
      syncSidebarCat('All');
      render();
    });
  }

  /* Load more */
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      state.page += 1;
      render();
    });
  }

  /* Sidebar toggle (mobile) */
  var filterToggle = document.getElementById('filter-toggle');
  var sidebar      = document.querySelector('.sidebar-filter');
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
  }

  /* =========================================================
     URL PARAM: ?cat=
     ========================================================= */
  function applyUrlCategory() {
    var cat = new URLSearchParams(window.location.search).get('cat');
    if (cat) {
      state.category = cat;
      syncTabs(cat);
      syncSidebarCat(cat);
    }
  }

  /* =========================================================
     BOOT
     ========================================================= */
  loadCategories();
  loadItems();
});
