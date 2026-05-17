/* =========================================================
   ALVA – collection.js
   Product listing, filters, sort, search, wishlist, cart
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

  var PRODUCTS = window.PRODUCTS || [];

  /* ---- State ---- */
  var state = {
    category: 'All',
    sizes: [],
    colors: [],
    priceMin: 0,
    priceMax: 999999,
    rating: 0,
    sort: 'featured',
    search: '',
    page: 1,
    perPage: 8
  };

  /* ---- Elements ---- */
  var gridEl      = document.getElementById('product-grid');
  var countEl     = document.getElementById('results-count');
  var loadMoreBtn = document.getElementById('load-more-btn');

  /* ---- RENDER ---- */
  function getFiltered() {
    return PRODUCTS.filter(function(p) {
      if (state.category !== 'All' && p.category !== state.category) return false;
      if (state.sizes.length > 0) {
        var hasSz = state.sizes.some(function(sz) { return p.sizes.indexOf(sz) !== -1; });
        if (!hasSz) return false;
      }
      if (p.price < state.priceMin || p.price > state.priceMax) return false;
      if (p.rating < state.rating) return false;
      if (state.search) {
        var q = state.search.toLowerCase();
        if (p.name.toLowerCase().indexOf(q) === -1 && p.brand.toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function getSorted(arr) {
    var copy = arr.slice();
    switch (state.sort) {
      case 'price-asc':
        copy.sort(function(a, b) { return a.price - b.price; });
        break;
      case 'price-desc':
        copy.sort(function(a, b) { return b.price - a.price; });
        break;
      case 'rating':
        copy.sort(function(a, b) { return b.rating - a.rating; });
        break;
      case 'newest':
        copy.sort(function(a, b) { return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); });
        break;
      default:
        break; /* featured = original order */
    }
    return copy;
  }

  function render() {
    var filtered = getSorted(getFiltered());
    var shown    = filtered.slice(0, state.page * state.perPage);

    if (countEl) {
      countEl.textContent = filtered.length + ' products';
    }

    if (!gridEl) return;

    if (filtered.length === 0) {
      gridEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--text-3);font-size:0.9rem;">No products match your filters.</div>';
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    gridEl.innerHTML = shown.map(function(p, i) {
      return renderProductCard(p, i);
    }).join('');

    /* wire up card clicks */
    gridEl.querySelectorAll('.product-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        var id = card.dataset.id;
        window.location.href = 'product.html?id=' + id;
      });
    });

    /* show/hide load more */
    if (loadMoreBtn) {
      if (shown.length < filtered.length) {
        loadMoreBtn.style.display = 'inline-flex';
        loadMoreBtn.textContent = 'Load More (' + (filtered.length - shown.length) + ' remaining)';
      } else {
        loadMoreBtn.style.display = 'none';
      }
    }
  }

  /* ---- CATEGORY TABS (filter bar) ---- */
  var filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      filterTabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      state.category = tab.dataset.category;
      state.page = 1;
      /* also sync category pills in hero strip if present */
      syncCategoryPills(state.category);
      render();
    });
  });

  /* ---- CATEGORY PILLS (home-style strip on this page) ---- */
  var categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      categoryPills.forEach(function(p) { p.classList.remove('active'); });
      pill.classList.add('active');
      state.category = pill.dataset.category;
      state.page = 1;
      syncFilterTabs(state.category);
      render();
    });
  });

  function syncCategoryPills(cat) {
    categoryPills.forEach(function(p) {
      p.classList.toggle('active', p.dataset.category === cat);
    });
  }

  function syncFilterTabs(cat) {
    filterTabs.forEach(function(t) {
      t.classList.toggle('active', t.dataset.category === cat);
    });
  }

  /* ---- SORT ---- */
  var sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      state.sort = sortSelect.value;
      state.page = 1;
      render();
    });
  }

  /* ---- SIDEBAR: SIZE ---- */
  var sizeCheckboxes = document.querySelectorAll('.size-checkbox');
  sizeCheckboxes.forEach(function(cb) {
    cb.addEventListener('change', function() {
      state.sizes = Array.from(sizeCheckboxes)
        .filter(function(c) { return c.checked; })
        .map(function(c) { return c.value; });
      state.page = 1;
      render();
    });
  });

  /* ---- SIDEBAR: COLOR SWATCHES ---- */
  var colorSwatches = document.querySelectorAll('.color-swatch[data-color]');
  colorSwatches.forEach(function(sw) {
    sw.addEventListener('click', function() {
      sw.classList.toggle('active');
      state.colors = Array.from(colorSwatches)
        .filter(function(s) { return s.classList.contains('active'); })
        .map(function(s) { return s.dataset.color; });
      state.page = 1;
      render();
    });
  });

  /* ---- SIDEBAR: PRICE RANGE ---- */
  var priceMin = document.getElementById('price-min');
  var priceMax = document.getElementById('price-max');

  function updatePriceFilter() {
    state.priceMin = parseInt(priceMin && priceMin.value) || 0;
    state.priceMax = parseInt(priceMax && priceMax.value) || 999999;
    state.page = 1;
    render();
  }

  if (priceMin) priceMin.addEventListener('input', updatePriceFilter);
  if (priceMax) priceMax.addEventListener('input', updatePriceFilter);

  /* ---- SIDEBAR: RATING ---- */
  var ratingRadios = document.querySelectorAll('.rating-radio');
  ratingRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      state.rating = parseFloat(radio.value) || 0;
      state.page = 1;
      render();
    });
  });

  /* ---- SIDEBAR: CATEGORY RADIO ---- */
  var categoryRadios = document.querySelectorAll('.category-radio');
  categoryRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      state.category = radio.value;
      state.page = 1;
      syncFilterTabs(state.category);
      syncCategoryPills(state.category);
      render();
    });
  });

  /* ---- CLEAR ALL ---- */
  var clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      state.category = 'All';
      state.sizes = [];
      state.colors = [];
      state.priceMin = 0;
      state.priceMax = 999999;
      state.rating = 0;
      state.search = '';
      state.page = 1;

      /* reset UI */
      sizeCheckboxes.forEach(function(cb) { cb.checked = false; });
      colorSwatches.forEach(function(sw) { sw.classList.remove('active'); });
      if (priceMin) priceMin.value = '';
      if (priceMax) priceMax.value = '';
      ratingRadios.forEach(function(r) { r.checked = false; });
      categoryRadios.forEach(function(r) { r.checked = r.value === 'All'; });
      filterTabs.forEach(function(t) { t.classList.toggle('active', t.dataset.category === 'All'); });
      categoryPills.forEach(function(p) { p.classList.toggle('active', p.dataset.category === 'All'); });
      render();
    });
  }

  /* ---- LOAD MORE ---- */
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      state.page += 1;
      render();
    });
  }

  /* ---- FILTER SIDEBAR TOGGLE (mobile) ---- */
  var filterToggle = document.getElementById('filter-toggle');
  var sidebar = document.querySelector('.sidebar-filter');
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }

  /* ---- INITIAL RENDER ---- */
  render();

});
