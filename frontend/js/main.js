/* =========================================================
   ALVA – main.js
   Global utilities: cart, wishlist, nav, toast
   ========================================================= */

window.STORAGE_BASE = 'http://localhost/storage/storage';
window.API_BASE     = 'http://localhost/api/products';

/* =========================================================
   CART UTILITIES
   Logged-in users  → synced with /api/products/cart (DB)
   Guest users      → localStorage 'alva_cart_guest'
   ========================================================= */
var _CART_API = 'http://localhost/api/products/cart';

function _token() { return localStorage.getItem('alva_token'); }

function _cartKey() { return _token() ? 'alva_cart' : 'alva_cart_guest'; }

function _authHeaders() {
  var t = _token();
  if (!t) return null;
  return { 'Authorization': 'Bearer ' + t, 'Content-Type': 'application/json', 'Accept': 'application/json' };
}

function _mapApiItem(ci) {
  var it = ci.item || {};
  return {
    cartItemId: ci.id,
    key:   it.id,
    id:    it.id,
    name:  it.name  || '',
    brand: (it.designer && it.designer.name) ? it.designer.name : '',
    price: parseFloat(it.price) || 0,
    image: (it.images && it.images[0]) ? it.images[0].url : '',
    size:  it.size  || '',
    qty:   ci.quantity
  };
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(_cartKey())) || []; } catch (e) { return []; }
}

function _saveCartLocal(cart) {
  localStorage.setItem(_cartKey(), JSON.stringify(cart));
  updateCartBadge();
}

/* Fetch server cart → overwrite local cache. Returns promise<items>. */
function loadUserCart() {
  var h = _authHeaders();
  if (!h) return Promise.resolve(getCart());
  return fetch(_CART_API, { headers: h })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(d) {
      var raw   = (d && d.data && d.data.items) ? d.data.items : [];
      var items = raw.map(_mapApiItem);
      localStorage.setItem('alva_cart', JSON.stringify(items));
      updateCartBadge();
      return items;
    })
    .catch(function() { return getCart(); });
}

/* After login: push guest items to server, then reload server cart. */
function mergeGuestCart() {
  var guest = [];
  try { guest = JSON.parse(localStorage.getItem('alva_cart_guest')) || []; } catch (e) {}
  localStorage.removeItem('alva_cart_guest');
  var h = _authHeaders();
  if (!h || guest.length === 0) return loadUserCart();
  return guest.reduce(function(p, item) {
    return p.then(function() {
      return fetch(_CART_API + '/items', {
        method: 'POST', headers: h,
        body: JSON.stringify({ item_id: item.id, quantity: item.qty })
      }).catch(function() {});
    });
  }, Promise.resolve()).then(loadUserCart);
}

/* Called on logout — wipe local cache. */
function clearCart() { localStorage.removeItem('alva_cart'); }

function addToCart(item, size, qty) {
  qty = qty || 1;
  var cart = getCart();
  var key  = item.id;
  var existing = cart.find(function(c) { return c.key === key; });

  if (existing) {
    existing.qty += qty;
    _saveCartLocal(cart);
    var h = _authHeaders();
    if (h && existing.cartItemId) {
      fetch(_CART_API + '/items/' + existing.cartItemId, {
        method: 'PUT', headers: h,
        body: JSON.stringify({ quantity: existing.qty })
      }).catch(function() {});
    }
  } else {
    var newItem = {
      cartItemId: null, key: key, id: item.id,
      name: item.name, brand: item.brand || '',
      price: parseFloat(item.price), image: item.image || '',
      size: size || item.size || '', qty: qty
    };
    cart.push(newItem);
    _saveCartLocal(cart);
    var h2 = _authHeaders();
    if (h2) {
      fetch(_CART_API + '/items', {
        method: 'POST', headers: h2,
        body: JSON.stringify({ item_id: item.id, quantity: qty })
      })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(d) {
        if (!d) return;
        var serverItems = (d.data && d.data.items) ? d.data.items : [];
        var matched = serverItems.find(function(ci) { return ci.item && ci.item.id === item.id; });
        if (matched) {
          var cur = getCart();
          var local = cur.find(function(c) { return c.key === key; });
          if (local) { local.cartItemId = matched.id; _saveCartLocal(cur); }
        }
      }).catch(function() {});
    }
  }
}

function removeFromCart(key) {
  var cart = getCart();
  var item = cart.find(function(c) { return c.key === key; });
  if (item && item.cartItemId) {
    var h = _authHeaders();
    if (h) fetch(_CART_API + '/items/' + item.cartItemId, { method: 'DELETE', headers: h }).catch(function() {});
  }
  _saveCartLocal(cart.filter(function(c) { return c.key !== key; }));
}

function updateQty(key, qty) {
  var cart = getCart();
  var item = cart.find(function(c) { return c.key === key; });
  if (!item) return;
  item.qty = Math.max(1, qty);
  _saveCartLocal(cart);
  var h = _authHeaders();
  if (h && item.cartItemId) {
    fetch(_CART_API + '/items/' + item.cartItemId, {
      method: 'PUT', headers: h,
      body: JSON.stringify({ quantity: item.qty })
    }).catch(function() {});
  }
}

function getCartCount() {
  return getCart().reduce(function(t, c) { return t + c.qty; }, 0);
}

function updateCartBadge() {
  var count = getCartCount();
  document.querySelectorAll('.cart-count').forEach(function(badge) {
    badge.textContent = count;
    badge.classList.toggle('visible', count > 0);
  });
}

/* =========================================================
   WISHLIST UTILITIES
   ========================================================= */
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('alva_wishlist')) || [];
  } catch (e) {
    return [];
  }
}

function toggleWishlist(id) {
  var list = getWishlist();
  var idx  = list.indexOf(id);
  if (idx === -1) { list.push(id); } else { list.splice(idx, 1); }
  localStorage.setItem('alva_wishlist', JSON.stringify(list));
  return idx === -1;
}

function isWishlisted(id) {
  return getWishlist().indexOf(id) !== -1;
}

/* =========================================================
   TOAST
   ========================================================= */
var _toastTimer = null;
var _toastEl    = null;

function showToast(message) {
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.className = 'toast';
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = message;
  _toastEl.classList.add('visible');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() { _toastEl.classList.remove('visible'); }, 3000);
}

/* =========================================================
   NAV SCROLL
   ========================================================= */
function initNavScroll() {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   SHARED ITEM CARD RENDERER  (API item format)
   item: { id, name, price, designer:{name}, images:[{url}] }
   ========================================================= */
function renderItemCard(item) {
  var image = (item.images && item.images[0]) ? item.images[0].url
    : 'https://placehold.co/400x500/1a1a1a/555?text=No+Image';
  var brand    = (item.designer && item.designer.name) ? item.designer.name : '';
  var price    = '$' + parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 0 });
  var liked    = isWishlisted(item.id);
  var badgeNew = item.is_signature
    ? '<div class="product-card-badge"><span class="badge badge-new">Signature</span></div>' : '';

  return [
    '<div class="product-card" data-id="' + item.id + '">',
      '<div class="product-card-image-wrap">',
        badgeNew,
        '<button class="product-card-like' + (liked ? ' liked' : '') + '" data-id="' + item.id + '" aria-label="Wishlist">',
          '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        '</button>',
        '<img src="' + image + '" alt="' + escHtml(item.name) + '" loading="lazy">',
      '</div>',
      '<div class="product-card-body">',
        brand ? '<div class="product-card-brand">' + escHtml(brand) + '</div>' : '',
        '<div class="product-card-name">' + escHtml(item.name) + '</div>',
        '<div class="product-card-footer">',
          '<span class="product-card-price">' + price + '</span>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', function() {
  initNavScroll();
  updateCartBadge();
});
