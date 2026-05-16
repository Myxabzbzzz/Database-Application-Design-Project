/* =========================================================
   ALVA – main.js
   Global utilities: products, cart, nav, toast, render
   ========================================================= */

/* ---- Storage base URL (MinIO via Nginx) ---- */
window.STORAGE_BASE = 'http://localhost/storage/storage';

/* ---- PRODUCTS ---- */
window.PRODUCTS = [
  /* Dresses */
  {
    id: 1,
    name: 'Silk Bias-Cut Maxi Dress',
    brand: 'MAISON NOIR',
    price: 1890,
    oldPrice: null,
    category: 'Dresses',
    image: 'http://localhost/storage/storage/products/dress-black-silk.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#1a1a1a', '#5a3a2a'],
    rating: 4.9,
    reviews: 124,
    isNew: true
  },
  {
    id: 2,
    name: 'Draped Black Maxi Dress',
    brand: 'VEILED',
    price: 1450,
    oldPrice: null,
    category: 'Dresses',
    image: 'http://localhost/storage/storage/products/dress-black-maxi.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#1a1a1a'],
    rating: 4.7,
    reviews: 89,
    isNew: true
  },
  {
    id: 3,
    name: 'Champagne Column Gown',
    brand: 'LUMIÈRE',
    price: 3200,
    oldPrice: 3800,
    category: 'Dresses',
    image: 'http://localhost/storage/storage/products/dress-champagne-gown.png',
    sizes: ['XS', 'S', 'M'],
    colors: ['#c9a870', '#f0ebe4'],
    rating: 5.0,
    reviews: 42,
    isNew: false
  },
  {
    id: 4,
    name: 'Silver Slip Dress',
    brand: 'ECHOES',
    price: 980,
    oldPrice: null,
    category: 'Dresses',
    image: 'http://localhost/storage/storage/products/dress-silver-slip.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#b0b0b8'],
    rating: 4.6,
    reviews: 57,
    isNew: false
  },
  {
    id: 5,
    name: 'Gold Metallic Evening Dress',
    brand: 'LUMIÈRE',
    price: 2750,
    oldPrice: null,
    category: 'Dresses',
    image: 'http://localhost/storage/storage/products/dress-gold-metallic.png',
    sizes: ['S', 'M', 'L'],
    colors: ['#c9a870'],
    rating: 4.8,
    reviews: 31,
    isNew: true
  },
  {
    id: 6,
    name: 'Cream Pleated Midi Dress',
    brand: 'ARCHIVE',
    price: 1120,
    oldPrice: null,
    category: 'Dresses',
    image: 'http://localhost/storage/storage/products/dress-cream-pleated.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#f0ebe4', '#e8d5a8'],
    rating: 4.5,
    reviews: 68,
    isNew: false
  },
  /* Blazers */
  {
    id: 7,
    name: 'Ivory Structured Blazer',
    brand: 'STUDIO FORM',
    price: 1340,
    oldPrice: null,
    category: 'Blazers',
    image: 'http://localhost/storage/storage/products/blazer-ivory.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#f0ebe4'],
    rating: 4.8,
    reviews: 93,
    isNew: true
  },
  {
    id: 8,
    name: 'Charcoal Power Blazer',
    brand: 'STUDIO FORM',
    price: 1290,
    oldPrice: null,
    category: 'Blazers',
    image: 'http://localhost/storage/storage/products/blazer-charcoal.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#3c3c3c'],
    rating: 4.7,
    reviews: 75,
    isNew: false
  },
  {
    id: 9,
    name: 'Navy Double-Breasted Blazer',
    brand: 'ATELIER 9',
    price: 1560,
    oldPrice: null,
    category: 'Blazers',
    image: 'http://localhost/storage/storage/products/blazer-navy-double.png',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#1a2640'],
    rating: 4.9,
    reviews: 48,
    isNew: false
  },
  {
    id: 10,
    name: 'Dark Grey Tailored Blazer',
    brand: 'ATELIER 9',
    price: 1180,
    oldPrice: 1480,
    category: 'Blazers',
    image: 'http://localhost/storage/storage/products/blazer-dark-grey.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#4a4a4a'],
    rating: 4.5,
    reviews: 62,
    isNew: false
  },
  /* Coats */
  {
    id: 11,
    name: 'Belted Black Coat',
    brand: 'NOIR COLLECTIVE',
    price: 2890,
    oldPrice: null,
    category: 'Coats',
    image: 'http://localhost/storage/storage/products/coat-black-belted.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#1a1a1a'],
    rating: 4.9,
    reviews: 111,
    isNew: true
  },
  {
    id: 12,
    name: 'Oversized White Coat',
    brand: 'BLANC',
    price: 2640,
    oldPrice: null,
    category: 'Coats',
    image: 'http://localhost/storage/storage/products/coat-white-oversized.png',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#f0ebe4'],
    rating: 4.6,
    reviews: 54,
    isNew: false
  },
  {
    id: 13,
    name: 'Camel Wool Coat',
    brand: 'ARCHIVE',
    price: 2200,
    oldPrice: 2700,
    category: 'Coats',
    image: 'http://localhost/storage/storage/products/coat-beige.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#c9a870', '#8b6914'],
    rating: 4.7,
    reviews: 88,
    isNew: false
  },
  {
    id: 14,
    name: 'Forest Green Long Coat',
    brand: 'VERDANT',
    price: 2450,
    oldPrice: null,
    category: 'Coats',
    image: 'http://localhost/storage/storage/products/coat-green.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#2d4a3e'],
    rating: 4.8,
    reviews: 39,
    isNew: true
  },
  /* Knitwear */
  {
    id: 15,
    name: 'Beige Ribbed Knit Sweater',
    brand: 'WARMTH',
    price: 680,
    oldPrice: null,
    category: 'Knitwear',
    image: 'http://localhost/storage/storage/products/sweater-beige-knit.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#c9a870', '#f0ebe4'],
    rating: 4.6,
    reviews: 143,
    isNew: false
  },
  {
    id: 16,
    name: 'White Turtleneck Sweater',
    brand: 'WARMTH',
    price: 720,
    oldPrice: null,
    category: 'Knitwear',
    image: 'http://localhost/storage/storage/products/sweater-white-turtle.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#f0ebe4'],
    rating: 4.7,
    reviews: 97,
    isNew: false
  },
  {
    id: 17,
    name: 'Charcoal Crop Turtleneck',
    brand: 'WARMTH',
    price: 590,
    oldPrice: null,
    category: 'Knitwear',
    image: 'http://localhost/storage/storage/products/turtleneck-charcoal.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#3c3c3c'],
    rating: 4.5,
    reviews: 71,
    isNew: false
  },
  /* Bottoms */
  {
    id: 18,
    name: 'Charcoal Wide-Leg Trousers',
    brand: 'STUDIO FORM',
    price: 890,
    oldPrice: null,
    category: 'Trousers',
    image: 'http://localhost/storage/storage/products/pants-charcoal-wide.png',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['#3c3c3c'],
    rating: 4.8,
    reviews: 104,
    isNew: false
  },
  {
    id: 19,
    name: 'Leather Asymmetric Skirt',
    brand: 'VEILED',
    price: 1340,
    oldPrice: null,
    category: 'Trousers',
    image: 'http://localhost/storage/storage/products/skirt-leather-asym.png',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['#1a1a1a'],
    rating: 4.7,
    reviews: 55,
    isNew: true
  },
  /* Bags */
  {
    id: 20,
    name: 'Hobo Leather Bag',
    brand: 'CARRY',
    price: 2100,
    oldPrice: null,
    category: 'Bags',
    image: 'http://localhost/storage/storage/products/bag-black-hobo.png',
    sizes: ['One Size'],
    colors: ['#1a1a1a'],
    rating: 4.9,
    reviews: 88,
    isNew: true
  },
  {
    id: 21,
    name: 'Brown Leather Tote',
    brand: 'CARRY',
    price: 1850,
    oldPrice: null,
    category: 'Bags',
    image: 'http://localhost/storage/storage/products/bag-brown-tote.png',
    sizes: ['One Size'],
    colors: ['#5a3a2a'],
    rating: 4.8,
    reviews: 66,
    isNew: false
  },
  /* Footwear */
  {
    id: 22,
    name: 'Black Chelsea Boots',
    brand: 'SOLE NOIR',
    price: 1290,
    oldPrice: null,
    category: 'Footwear',
    image: 'http://localhost/storage/storage/products/boots-black-chelsea.png',
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['#1a1a1a'],
    rating: 4.8,
    reviews: 152,
    isNew: false
  },
  {
    id: 23,
    name: 'Nude Gold Heeled Mules',
    brand: 'SOLE NOIR',
    price: 890,
    oldPrice: 1100,
    category: 'Footwear',
    image: 'http://localhost/storage/storage/products/heels-nude-gold.png',
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['#e8d5a8', '#c9a870'],
    rating: 4.6,
    reviews: 79,
    isNew: false
  },
  /* Accessories */
  {
    id: 24,
    name: 'Gold Drop Earrings',
    brand: 'ADORN',
    price: 420,
    oldPrice: null,
    category: 'Accessories',
    image: 'http://localhost/storage/storage/products/earrings-gold.png',
    sizes: ['One Size'],
    colors: ['#c9a870'],
    rating: 4.9,
    reviews: 203,
    isNew: false
  }
];

/* =========================================================
   CART UTILITIES
   ========================================================= */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('alva_cart')) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('alva_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(product, size, qty) {
  qty = qty || 1;
  const cart = getCart();
  const key = product.id + '_' + size;
  const existing = cart.find(function(item) { return item.key === key; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key: key,
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: size,
      qty: qty
    });
  }
  saveCart(cart);
}

function removeFromCart(key) {
  const cart = getCart().filter(function(item) { return item.key !== key; });
  saveCart(cart);
}

function updateQty(key, qty) {
  const cart = getCart();
  const item = cart.find(function(i) { return i.key === key; });
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart(cart);
  }
}

function getCartCount() {
  return getCart().reduce(function(total, item) { return total + item.qty; }, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-count');
  badges.forEach(function(badge) {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
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

function toggleWishlist(productId) {
  const wishlist = getWishlist();
  const idx = wishlist.indexOf(productId);
  if (idx === -1) {
    wishlist.push(productId);
  } else {
    wishlist.splice(idx, 1);
  }
  localStorage.setItem('alva_wishlist', JSON.stringify(wishlist));
  return idx === -1; // true if added
}

function isWishlisted(productId) {
  return getWishlist().indexOf(productId) !== -1;
}

/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */
var _toastTimer = null;
var _toastEl = null;

function showToast(message) {
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.className = 'toast';
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = message;
  _toastEl.classList.add('visible');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(function() {
    _toastEl.classList.remove('visible');
  }, 3000);
}

/* =========================================================
   NAV SCROLL BEHAVIOR
   ========================================================= */
function initNavScroll() {
  var nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =========================================================
   RENDER PRODUCT CARD
   ========================================================= */
function starsHTML(rating) {
  var full = Math.floor(rating);
  var half = rating % 1 >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;
  var html = '';
  for (var i = 0; i < full; i++) html += '★';
  if (half) html += '½';
  for (var j = 0; j < empty; j++) html += '☆';
  return html;
}

function formatPrice(n) {
  return '$' + n.toLocaleString('en-US');
}

function renderProductCard(product, index) {
  var liked = isWishlisted(product.id);
  var badgeHTML = product.isNew
    ? '<div class="product-card-badge"><span class="badge badge-new">New</span></div>'
    : '';

  var oldPriceHTML = product.oldPrice
    ? '<span class="product-card-price-old">' + formatPrice(product.oldPrice) + '</span>'
    : '';

  return [
    '<div class="product-card" data-id="' + product.id + '" data-index="' + index + '">',
      '<div class="product-card-image-wrap">',
        badgeHTML,
        '<button class="product-card-like' + (liked ? ' liked' : '') + '" data-id="' + product.id + '" aria-label="Wishlist" onclick="event.stopPropagation();handleCardLike(this,' + product.id + ')">',
          '<svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
        '</button>',
        '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy">',
        '<div class="product-card-quick">',
          '<button class="btn btn-sm" style="flex:1;font-size:0.65rem;" onclick="event.stopPropagation();handleCardAddToCart(' + product.id + ')">Add to Cart</button>',
        '</div>',
      '</div>',
      '<div class="product-card-body">',
        '<div class="product-card-brand">' + product.brand + '</div>',
        '<div class="product-card-name">' + product.name + '</div>',
        '<div class="product-card-footer">',
          '<div>',
            '<span class="product-card-price">' + formatPrice(product.price) + '</span>',
            oldPriceHTML,
          '</div>',
          '<div class="product-card-stars">' + starsHTML(product.rating) + '</div>',
        '</div>',
      '</div>',
    '</div>'
  ].join('');
}

/* =========================================================
   CARD EVENT HANDLERS (global so onclick can find them)
   ========================================================= */
function handleCardLike(btn, productId) {
  var added = toggleWishlist(productId);
  btn.classList.toggle('liked', added);
  showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
}

function handleCardAddToCart(productId) {
  var product = window.PRODUCTS.find(function(p) { return p.id === productId; });
  if (!product) return;
  var size = product.sizes[0] || 'One Size';
  addToCart(product, size, 1);
  showToast('Added to cart — ' + product.name);
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', function() {
  initNavScroll();
  updateCartBadge();
});
