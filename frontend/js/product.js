/* =========================================================
   ALVA – product.js
   Fetches item from API by ULID, renders detail page
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var API = window.API_BASE;
  var id  = new URLSearchParams(window.location.search).get('id');

  if (!id) { window.location.href = 'collection.html'; return; }

  var selectedSize  = null;
  var selectedColor = null;
  var quantity      = 1;
  var item          = null;

  /* =========================================================
     LOAD ITEM
     ========================================================= */
  fetch(API + '/items/' + id, { headers: { 'Accept': 'application/json' } })
    .then(function (res) {
      if (!res.ok) throw new Error('not found');
      return res.json();
    })
    .then(function (data) {
      item = data.data || data;
      populatePage(item);
      loadRelated(item.category, item.id);
    })
    .catch(function () {
      window.location.href = 'collection.html';
    });

  /* =========================================================
     POPULATE PAGE
     ========================================================= */
  function populatePage(p) {
    var brand = (p.designer && p.designer.name) ? p.designer.name : '';
    var price = '$' + parseFloat(p.price).toLocaleString('en-US', { minimumFractionDigits: 0 });
    var images = (p.images && p.images.length) ? p.images : [];
    var mainImg = images[0] ? images[0].url : 'https://placehold.co/600x800/1a1a1a/555?text=No+Image';

    setText('bc-product-name', p.name);
    setText('product-brand',   brand);
    setText('product-name',    p.name);
    setText('product-price',   price);

    var oldPriceEl = document.getElementById('product-price-old');
    if (oldPriceEl) oldPriceEl.style.display = 'none';

    /* hide rating row since we don't store ratings */
    var ratingEl = document.querySelector('.product-rating');
    if (ratingEl) ratingEl.style.display = 'none';

    /* description */
    var descEl = document.querySelector('.product-desc');
    if (descEl) descEl.textContent = p.description || '';

    /* main image */
    var mainImgEl = document.getElementById('main-product-image');
    if (mainImgEl) { mainImgEl.src = mainImg; mainImgEl.alt = p.name; }

    /* thumbnails */
    var thumbsEl = document.getElementById('product-thumbs');
    if (thumbsEl) {
      thumbsEl.innerHTML = images.slice(0, 4).map(function (img, i) {
        return '<div class="product-thumb' + (i === 0 ? ' active' : '') + '" data-src="' + img.url + '">' +
          '<img src="' + img.url + '" alt="' + escHtml(p.name) + '" loading="lazy">' +
          '</div>';
      }).join('');
      thumbsEl.querySelectorAll('.product-thumb').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          thumbsEl.querySelectorAll('.product-thumb').forEach(function (t) { t.classList.remove('active'); });
          thumb.classList.add('active');
          if (mainImgEl) mainImgEl.src = thumb.dataset.src;
        });
      });
    }

    /* size — single string from DB */
    var sizeEl = document.getElementById('size-selector');
    if (sizeEl) {
      if (p.size) {
        sizeEl.innerHTML = '<button class="size-btn active" data-size="' + p.size + '">' + p.size + '</button>';
        selectedSize = p.size;
      } else {
        sizeEl.innerHTML = '<span style="color:var(--text-3);font-size:0.8rem;">One Size</span>';
        selectedSize = 'One Size';
      }
    }

    /* color */
    var colorEl = document.getElementById('color-selector');
    if (colorEl) {
      if (p.color) {
        colorEl.innerHTML = '<div class="color-swatch active" style="background:' + escHtml(p.color) + ';" title="' + escHtml(p.color) + '"></div>';
        selectedColor = p.color;
      } else {
        colorEl.innerHTML = '';
      }
    }

    /* wishlist button */
    var wishBtn = document.getElementById('wishlist-btn');
    if (wishBtn) {
      wishBtn.classList.toggle('active', isWishlisted(p.id));
      wishBtn.addEventListener('click', function () {
        var added = toggleWishlist(p.id);
        wishBtn.classList.toggle('active', added);
        showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
      });
    }

    document.title = 'ALVA — ' + p.name;
  }

  /* =========================================================
     QUANTITY CONTROLS
     ========================================================= */
  var qtyValue = document.getElementById('qty-value');
  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus  = document.getElementById('qty-plus');

  if (qtyMinus) qtyMinus.addEventListener('click', function () {
    if (quantity > 1) { quantity--; if (qtyValue) qtyValue.textContent = quantity; }
  });
  if (qtyPlus)  qtyPlus.addEventListener('click', function () {
    quantity++; if (qtyValue) qtyValue.textContent = quantity;
  });

  /* =========================================================
     ADD TO CART
     ========================================================= */
  var addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function () {
      if (!item) return;
      var size  = selectedSize || 'One Size';
      var brand = (item.designer && item.designer.name) ? item.designer.name : '';
      var image = (item.images && item.images[0]) ? item.images[0].url : '';
      addToCart({ id: item.id, name: item.name, brand: brand, price: item.price, image: image }, size, quantity);
      showToast('Added to cart — ' + item.name);
      updateCartBadge();
    });
  }

  /* =========================================================
     ACCORDION
     ========================================================= */
  document.querySelectorAll('.accordion-item').forEach(function (acc) {
    var header = acc.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', function () {
      var wasOpen = acc.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(function (a) { a.classList.remove('open'); });
      if (!wasOpen) acc.classList.add('open');
    });
  });

  /* =========================================================
     RELATED PRODUCTS
     ========================================================= */
  function loadRelated(category, excludeId) {
    var relatedEl = document.getElementById('related-products');
    if (!relatedEl) return;

    fetch(API + '/items?per_page=8&category=' + encodeURIComponent(category), {
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      var items = (data.data && data.data.data) || data.data || [];
      var related = items.filter(function (i) { return i.id !== excludeId; }).slice(0, 4);
      if (related.length === 0) {
        relatedEl.closest && relatedEl.closest('section') && (relatedEl.closest('section').style.display = 'none');
        return;
      }
      relatedEl.innerHTML = related.map(renderItemCard).join('');
      relatedEl.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('button')) return;
          window.location.href = 'product.html?id=' + card.dataset.id;
        });
      });
    })
    .catch(function () {});
  }

  /* =========================================================
     HELPERS
     ========================================================= */
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

});
