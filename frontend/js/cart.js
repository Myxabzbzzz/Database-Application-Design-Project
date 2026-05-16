/* =========================================================
   ALVA – cart.js
   Shopping cart page logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

  var PROMO_CODES = { 'ALVA10': 0.10 };

  var cartItemsEl  = document.getElementById('cart-items');
  var cartEmptyEl  = document.getElementById('cart-empty');
  var cartMainEl   = document.getElementById('cart-main');
  var cartCountBadgeEl = document.getElementById('cart-count-label');

  var subtotalEl   = document.getElementById('summary-subtotal');
  var discountRowEl= document.getElementById('summary-discount-row');
  var discountEl   = document.getElementById('summary-discount');
  var totalEl      = document.getElementById('summary-total');

  var promoInput   = document.getElementById('promo-input');
  var promoBtn     = document.getElementById('promo-btn');
  var promoMsg     = document.getElementById('promo-message');

  var checkoutBtn  = document.getElementById('checkout-btn');

  var appliedPromo = null;

  /* ---- FORMAT ---- */
  function fmt(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  /* ---- RENDER CART ---- */
  function renderCart() {
    var cart = getCart();

    if (cartCountBadgeEl) {
      var total = cart.reduce(function(s, i) { return s + i.qty; }, 0);
      cartCountBadgeEl.textContent = total > 0 ? '(' + total + ' items)' : '';
    }

    if (cart.length === 0) {
      if (cartEmptyEl) cartEmptyEl.classList.add('visible');
      if (cartMainEl)  cartMainEl.style.display = 'none';
      return;
    }

    if (cartEmptyEl) cartEmptyEl.classList.remove('visible');
    if (cartMainEl)  cartMainEl.style.display = '';

    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = cart.map(function(item) {
      return [
        '<div class="cart-item" data-key="' + item.key + '">',
          '<div class="cart-item-image">',
            '<img src="' + item.image + '" alt="' + item.name + '">',
          '</div>',
          '<div class="cart-item-info">',
            '<div class="cart-item-brand">' + item.brand + '</div>',
            '<div class="cart-item-name">' + item.name + '</div>',
            '<div class="cart-item-size">Size: ' + item.size + '</div>',
          '</div>',
          '<div class="cart-item-price">' + fmt(item.price) + '</div>',
          '<div class="cart-item-qty">',
            '<button class="cart-qty-btn" data-action="minus" data-key="' + item.key + '">−</button>',
            '<span class="cart-qty-val">' + item.qty + '</span>',
            '<button class="cart-qty-btn" data-action="plus" data-key="' + item.key + '">+</button>',
          '</div>',
          '<button class="cart-item-remove" data-key="' + item.key + '" aria-label="Remove item">',
            '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
          '</button>',
        '</div>'
      ].join('');
    }).join('');

    /* Wire up qty buttons */
    cartItemsEl.querySelectorAll('.cart-qty-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var key    = btn.dataset.key;
        var action = btn.dataset.action;
        var cart2  = getCart();
        var item   = cart2.find(function(i) { return i.key === key; });
        if (!item) return;
        if (action === 'minus') {
          if (item.qty <= 1) {
            removeFromCart(key);
          } else {
            updateQty(key, item.qty - 1);
          }
        } else {
          updateQty(key, item.qty + 1);
        }
        renderCart();
        updateTotals();
        updateCartBadge();
      });
    });

    /* Wire up remove buttons */
    cartItemsEl.querySelectorAll('.cart-item-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        removeFromCart(btn.dataset.key);
        renderCart();
        updateTotals();
        updateCartBadge();
      });
    });

    updateTotals();
  }

  /* ---- TOTALS ---- */
  function updateTotals() {
    var cart = getCart();
    var subtotal = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);

    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);

    var discount = 0;
    if (appliedPromo && PROMO_CODES[appliedPromo]) {
      discount = Math.round(subtotal * PROMO_CODES[appliedPromo]);
      if (discountRowEl) discountRowEl.style.display = '';
      if (discountEl) discountEl.textContent = '−' + fmt(discount);
    } else {
      if (discountRowEl) discountRowEl.style.display = 'none';
    }

    var total = subtotal - discount;
    if (totalEl) totalEl.textContent = fmt(total);
  }

  /* ---- PROMO CODE ---- */
  if (promoBtn) {
    promoBtn.addEventListener('click', function() {
      var code = (promoInput ? promoInput.value.trim().toUpperCase() : '');
      if (!code) {
        showPromoMsg('Please enter a promo code.', false);
        return;
      }
      if (PROMO_CODES[code]) {
        appliedPromo = code;
        var pct = Math.round(PROMO_CODES[code] * 100);
        showPromoMsg('Code "' + code + '" applied — ' + pct + '% off!', true);
        updateTotals();
      } else {
        appliedPromo = null;
        showPromoMsg('Invalid promo code.', false);
        updateTotals();
      }
    });
  }

  if (promoInput) {
    promoInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') promoBtn && promoBtn.click();
    });
  }

  function showPromoMsg(msg, success) {
    if (!promoMsg) return;
    promoMsg.textContent = msg;
    promoMsg.className = 'promo-message ' + (success ? 'success' : 'error');
  }

  /* ---- CHECKOUT ---- */
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      var token = localStorage.getItem('alva_token');
      if (!token) {
        window.location.href = 'login.html';
        return;
      }
      var cart = getCart();
      if (cart.length === 0) {
        showToast('Your cart is empty.');
        return;
      }
      window.location.href = 'checkout.html';
    });
  }

  /* ---- SEED DEMO ITEMS if cart is empty ---- */
  function seedDemoCart() {
    if (getCart().length === 0) {
      var PRODUCTS = window.PRODUCTS || [];
      var dress   = PRODUCTS.find(function(p) { return p.id === 1; });
      var blazer  = PRODUCTS.find(function(p) { return p.id === 7; });
      if (dress)  addToCart(dress, 'M', 1);
      if (blazer) addToCart(blazer, 'S', 1);
    }
  }

  /* ---- INIT ---- */
  seedDemoCart();
  renderCart();
  updateCartBadge();

});
