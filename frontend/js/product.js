/* =========================================================
   ALVA – product.js
   Product detail page logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

  var PRODUCTS = window.PRODUCTS || [];

  /* ---- Read URL param ---- */
  var params  = new URLSearchParams(window.location.search);
  var id      = parseInt(params.get('id')) || 1;
  var product = PRODUCTS.find(function(p) { return p.id === id; });

  if (!product) {
    product = PRODUCTS[0];
  }

  /* ---- State ---- */
  var selectedSize  = null;
  var selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : null;
  var quantity      = 1;

  /* ---- Populate page ---- */
  function populatePage() {
    /* Breadcrumb */
    var bcName = document.getElementById('bc-product-name');
    if (bcName) bcName.textContent = product.name;

    /* Brand */
    var brandEl = document.getElementById('product-brand');
    if (brandEl) brandEl.textContent = product.brand;

    /* Name */
    var nameEl = document.getElementById('product-name');
    if (nameEl) nameEl.textContent = product.name;

    /* Price */
    var priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = '$' + product.price.toLocaleString('en-US');

    var oldPriceEl = document.getElementById('product-price-old');
    if (oldPriceEl) {
      if (product.oldPrice) {
        oldPriceEl.textContent = '$' + product.oldPrice.toLocaleString('en-US');
        oldPriceEl.style.display = '';
      } else {
        oldPriceEl.style.display = 'none';
      }
    }

    /* Rating */
    var starsEl = document.getElementById('product-stars');
    if (starsEl) starsEl.textContent = starsHTML(product.rating);

    var reviewsEl = document.getElementById('product-reviews');
    if (reviewsEl) reviewsEl.textContent = '(' + product.reviews + ' reviews)';

    /* Main image */
    var mainImg = document.getElementById('main-product-image');
    if (mainImg) {
      mainImg.src = product.image;
      mainImg.alt = product.name;
    }

    /* Thumbnails */
    var thumbsContainer = document.getElementById('product-thumbs');
    if (thumbsContainer) {
      var thumbImages = getThumbs(product);
      thumbsContainer.innerHTML = thumbImages.map(function(src, i) {
        return [
          '<div class="product-thumb' + (i === 0 ? ' active' : '') + '" data-src="' + src + '">',
            '<img src="' + src + '" alt="Thumbnail ' + (i+1) + '" loading="lazy">',
          '</div>'
        ].join('');
      }).join('');

      thumbsContainer.querySelectorAll('.product-thumb').forEach(function(thumb) {
        thumb.addEventListener('click', function() {
          thumbsContainer.querySelectorAll('.product-thumb').forEach(function(t) {
            t.classList.remove('active');
          });
          thumb.classList.add('active');
          if (mainImg) {
            mainImg.src = thumb.dataset.src;
          }
        });
      });
    }

    /* Sizes */
    var sizeContainer = document.getElementById('size-selector');
    if (sizeContainer) {
      sizeContainer.innerHTML = product.sizes.map(function(sz) {
        return '<button class="size-btn" data-size="' + sz + '">' + sz + '</button>';
      }).join('');

      sizeContainer.querySelectorAll('.size-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          sizeContainer.querySelectorAll('.size-btn').forEach(function(b) {
            b.classList.remove('active');
          });
          btn.classList.add('active');
          selectedSize = btn.dataset.size;
        });
      });
    }

    /* Colors */
    var colorContainer = document.getElementById('color-selector');
    if (colorContainer && product.colors && product.colors.length > 0) {
      colorContainer.innerHTML = product.colors.map(function(clr, i) {
        return [
          '<div class="color-swatch' + (i === 0 ? ' active' : '') + '"',
            ' style="background:' + clr + ';"',
            ' data-color="' + clr + '"',
            ' title="' + clr + '">',
          '</div>'
        ].join('');
      }).join('');

      colorContainer.querySelectorAll('.color-swatch').forEach(function(sw) {
        sw.addEventListener('click', function() {
          colorContainer.querySelectorAll('.color-swatch').forEach(function(s) {
            s.classList.remove('active');
          });
          sw.classList.add('active');
          selectedColor = sw.dataset.color;
        });
      });
    }
  }

  /* ---- Thumb images helper ---- */
  function getThumbs(p) {
    /* Use same-category products as extra thumbs */
    var sameCategory = PRODUCTS.filter(function(q) {
      return q.id !== p.id && q.category === p.category;
    }).slice(0, 3);

    var thumbs = [p.image];
    sameCategory.forEach(function(q) { thumbs.push(q.image); });
    while (thumbs.length < 4) { thumbs.push(p.image); }
    return thumbs.slice(0, 4);
  }

  /* ---- Stars helper ---- */
  function starsHTML(rating) {
    var full  = Math.floor(rating);
    var half  = rating % 1 >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    var s = '';
    for (var i = 0; i < full; i++)  s += '★';
    if (half) s += '½';
    for (var j = 0; j < empty; j++) s += '☆';
    return s;
  }

  /* ---- Quantity Controls ---- */
  var qtyValue = document.getElementById('qty-value');
  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus  = document.getElementById('qty-plus');

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function() {
      if (quantity > 1) {
        quantity--;
        if (qtyValue) qtyValue.textContent = quantity;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function() {
      quantity++;
      if (qtyValue) qtyValue.textContent = quantity;
    });
  }

  /* ---- Add to Cart ---- */
  var addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      if (!selectedSize && product.sizes.length > 1) {
        showToast('Please select a size');
        /* highlight size section */
        var sizeContainer = document.getElementById('size-selector');
        if (sizeContainer) {
          sizeContainer.style.transition = 'outline 0.1s';
          sizeContainer.style.outline = '1px solid var(--gold)';
          setTimeout(function() { sizeContainer.style.outline = ''; }, 1500);
        }
        return;
      }
      var size = selectedSize || product.sizes[0] || 'One Size';
      addToCart(product, size, quantity);
      showToast('Added to cart — ' + product.name);
      updateCartBadge();
    });
  }

  /* ---- Wishlist Button ---- */
  var wishlistBtn = document.getElementById('wishlist-btn');
  if (wishlistBtn) {
    var isWished = isWishlisted(product.id);
    wishlistBtn.classList.toggle('active', isWished);

    wishlistBtn.addEventListener('click', function() {
      var added = toggleWishlist(product.id);
      wishlistBtn.classList.toggle('active', added);
      showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
    });
  }

  /* ---- Accordion ---- */
  var accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(function(item) {
    var header = item.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', function() {
      var wasOpen = item.classList.contains('open');
      /* close all */
      accordionItems.forEach(function(i) { i.classList.remove('open'); });
      /* open this one if it was closed */
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---- "You May Also Like" ---- */
  function renderRelated() {
    var relatedContainer = document.getElementById('related-products');
    if (!relatedContainer) return;

    var related = PRODUCTS.filter(function(p) {
      return p.id !== product.id && p.category === product.category;
    }).slice(0, 4);

    if (related.length < 4) {
      var others = PRODUCTS.filter(function(p) {
        return p.id !== product.id && p.category !== product.category;
      });
      while (related.length < 4 && others.length > 0) {
        related.push(others.shift());
      }
    }

    relatedContainer.innerHTML = related.map(function(p, i) {
      return renderProductCard(p, i);
    }).join('');

    relatedContainer.querySelectorAll('.product-card').forEach(function(card) {
      card.addEventListener('click', function(e) {
        if (e.target.closest('button')) return;
        window.location.href = 'product.html?id=' + card.dataset.id;
      });
    });
  }

  /* ---- Init ---- */
  populatePage();
  renderRelated();

});
