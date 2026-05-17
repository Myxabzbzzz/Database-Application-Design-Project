/* =========================================================
   ALVA – designers.js
   ========================================================= */

var API = '/api/products';

document.addEventListener('DOMContentLoaded', function () {

  var viewList   = document.getElementById('view-list');
  var viewDetail = document.getElementById('view-detail');

  /* ---- Router: check URL for ?designer=<id> ---- */
  function getDesignerParam() {
    return new URLSearchParams(window.location.search).get('designer');
  }

  function navigate(designerId) {
    var url = designerId
      ? (window.location.pathname + '?designer=' + designerId)
      : window.location.pathname;
    history.pushState({}, '', url);
    designerId ? showDetail(designerId) : showList();
  }

  document.getElementById('btn-back').addEventListener('click', function () {
    navigate(null);
  });

  window.addEventListener('popstate', function () {
    var id = getDesignerParam();
    id ? showDetail(id) : showList();
  });

  /* =========================================================
     LIST VIEW
     ========================================================= */
  function showList() {
    viewDetail.style.display = 'none';
    viewList.style.display   = 'block';
    document.title = 'ALVA — Designers';
    loadDesigners();
  }

  function loadDesigners() {
    var loadingEl = document.getElementById('list-loading');
    var gridEl    = document.getElementById('designers-grid');
    var emptyEl   = document.getElementById('list-empty');

    loadingEl.style.display = 'block';
    gridEl.style.display    = 'none';
    emptyEl.style.display   = 'none';

    fetch(API + '/designers?per_page=50', {
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      loadingEl.style.display = 'none';
      var designers = (data.data && data.data.data) || data.data || data;
      if (!Array.isArray(designers)) designers = [];

      if (designers.length === 0) {
        emptyEl.style.display = 'block';
        return;
      }

      gridEl.innerHTML = designers.map(renderDesignerCard).join('');
      gridEl.style.display = 'grid';

      gridEl.querySelectorAll('.designer-card').forEach(function (card) {
        card.addEventListener('click', function () {
          navigate(card.dataset.id);
        });
      });
    })
    .catch(function () {
      loadingEl.style.display = 'none';
      emptyEl.style.display   = 'block';
    });
  }

  function renderDesignerCard(d) {
    var banner = d.banner_url
      ? '<img src="' + d.banner_url + '" alt="" loading="lazy">'
      : '<div class="designer-card-banner-placeholder"></div>';

    var avatar = d.avatar_url
      ? '<img src="' + d.avatar_url + '" alt="' + d.name + '">'
      : '<div class="designer-card-avatar-placeholder">' + d.name.charAt(0) + '</div>';

    var count = d.items_count != null ? d.items_count + ' pieces' : '';

    return [
      '<div class="designer-card" data-id="' + d.id + '">',
        '<div class="designer-card-banner">',
          banner,
          '<div class="designer-card-avatar">' + avatar + '</div>',
        '</div>',
        '<div class="designer-card-body">',
          '<div class="designer-card-name">' + escHtml(d.name) + '</div>',
          d.description ? '<div class="designer-card-desc">' + escHtml(d.description) + '</div>' : '',
          count ? '<div class="designer-card-meta">' + count + '</div>' : '',
        '</div>',
      '</div>'
    ].join('');
  }

  /* =========================================================
     DETAIL VIEW
     ========================================================= */
  function showDetail(id) {
    viewList.style.display   = 'none';
    viewDetail.style.display = 'block';

    /* reset */
    document.getElementById('detail-name').textContent = '—';
    document.getElementById('detail-desc').textContent = '';
    document.getElementById('detail-avatar').innerHTML = '';
    document.getElementById('detail-banner').style.display = 'none';
    document.getElementById('detail-items-loading').style.display = 'block';
    document.getElementById('detail-items-grid').style.display    = 'none';
    document.getElementById('detail-items-empty').style.display   = 'none';

    fetch(API + '/designers/' + id, {
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('not found');
      return res.json();
    })
    .then(function (data) {
      var d = data.data || data;
      document.title = 'ALVA — ' + d.name;
      document.getElementById('detail-name').textContent = d.name;
      document.getElementById('detail-desc').textContent = d.description || '';

      var avatarEl = document.getElementById('detail-avatar');
      avatarEl.innerHTML = d.avatar_url
        ? '<img src="' + d.avatar_url + '" alt="' + d.name + '">'
        : '<div class="designer-detail-avatar-placeholder">' + d.name.charAt(0) + '</div>';

      var bannerEl = document.getElementById('detail-banner');
      if (d.banner_url) {
        bannerEl.innerHTML = '<img src="' + d.banner_url + '" alt="">';
        bannerEl.style.display = 'block';
      }

      loadItems(id);
    })
    .catch(function () {
      navigate(null);
    });
  }

  function loadItems(designerId) {
    var loadingEl = document.getElementById('detail-items-loading');
    var gridEl    = document.getElementById('detail-items-grid');
    var emptyEl   = document.getElementById('detail-items-empty');

    fetch(API + '/items?designer_id=' + designerId + '&per_page=100', {
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      loadingEl.style.display = 'none';
      var items = (data.data && data.data.data) || data.data || data;
      if (!Array.isArray(items)) items = [];

      if (items.length === 0) {
        emptyEl.style.display = 'block';
        return;
      }

      gridEl.innerHTML = items.map(renderItemCard).join('');
      gridEl.style.display = 'grid';

      gridEl.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('click', function () {
          window.location.href = 'product.html?id=' + card.dataset.id + '&source=designer';
        });
      });

      gridEl.querySelectorAll('.product-card-like').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = btn.dataset.id;
          var added = toggleWishlist(id);
          btn.classList.toggle('liked', added);
          showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
        });
      });
    })
    .catch(function () {
      loadingEl.style.display = 'none';
      emptyEl.style.display   = 'block';
    });
  }

  /* renderItemCard and escHtml come from main.js */

  /* ---- Boot ---- */
  var initialId = getDesignerParam();
  if (initialId) {
    showDetail(initialId);
  } else {
    showList();
  }

});
