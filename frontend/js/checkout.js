(function () {
  var STRIPE_PK = 'pk_test_51TXpf3CiuvnINDTr2JTbNwQDkItrwvwtE7u2N0JaTxQAE6cUT1dbFUasbbanU31dHwkvs1xiZKMwencSAMAMchgq00HLhMvhlx';
  var API_BASE  = 'http://localhost/api/payments';

  var token = localStorage.getItem('alva_token');

  if (!token) {
    document.getElementById('auth-guard').style.display = 'block';
    return;
  }

  var cart = getCart();
  if (!cart.length) {
    window.location.href = 'cart.html';
    return;
  }

  document.getElementById('checkout-form-wrapper').style.display = 'block';

  // Pre-fill email if stored
  var storedEmail = localStorage.getItem('alva_email');
  if (storedEmail) document.getElementById('co-email').value = storedEmail;

  // Render order summary
  var total = 0;
  var summaryItems = document.getElementById('summary-items');
  cart.forEach(function (item) {
    var lineTotal = item.price * item.qty;
    total += lineTotal;
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:0.85rem;';
    row.innerHTML =
      '<span style="color:var(--text-2);flex:1;">' + item.name +
      ' <span style="color:var(--text-3);">×' + item.qty + '</span></span>' +
      '<span>$' + lineTotal.toFixed(2) + '</span>';
    summaryItems.appendChild(row);
  });
  document.getElementById('summary-subtotal').textContent = '$' + total.toFixed(2);
  document.getElementById('summary-total').textContent    = '$' + total.toFixed(2);

  // Stripe Elements
  var stripe   = Stripe(STRIPE_PK);
  var elements = stripe.elements();
  var card = elements.create('card', {
    style: {
      base: {
        color:           '#f0ebe4',
        fontFamily:      '"Jost", sans-serif',
        fontSize:        '15px',
        fontSmoothing:   'antialiased',
        '::placeholder': { color: '#6b6460' },
        iconColor:       '#c9a870',
      },
      invalid: { color: '#e05c5c', iconColor: '#e05c5c' },
    },
  });
  card.mount('#card-element');

  card.on('change', function (e) {
    document.getElementById('card-error').textContent = e.error ? e.error.message : '';
  });

  // Submit
  document.getElementById('pay-btn').addEventListener('click', function () {
    var name  = document.getElementById('co-name').value.trim();
    var email = document.getElementById('co-email').value.trim();

    if (!name || !email) {
      document.getElementById('card-error').textContent = 'Please fill in your name and email.';
      return;
    }

    setLoading(true);
    document.getElementById('card-error').textContent = '';

    var items = cart.map(function (item) {
      return { name: item.name, price: item.price, quantity: item.qty };
    });

    fetch(API_BASE + '/checkout', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ items: items, name: name, email: email }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.client_secret) {
          throw new Error(data.message || 'Could not create payment.');
        }

        return stripe.confirmCardPayment(data.client_secret, {
          payment_method: {
            card:            card,
            billing_details: { name: name, email: email },
          },
        }).then(function (result) {
          if (result.error) {
            throw new Error(result.error.message);
          }
          // Success
          localStorage.removeItem('alva_cart');
          updateCartCount();
          document.getElementById('checkout-form-wrapper').style.display = 'none';
          document.getElementById('success-order-id').textContent = '#' + data.order_id;
          document.getElementById('checkout-success').style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      })
      .catch(function (err) {
        document.getElementById('card-error').textContent = err.message || 'Payment failed.';
        setLoading(false);
      });
  });

  function setLoading(on) {
    document.getElementById('pay-btn').disabled          = on;
    document.getElementById('pay-btn-text').style.display    = on ? 'none'   : 'inline';
    document.getElementById('pay-btn-spinner').style.display = on ? 'inline' : 'none';
  }

  function updateCartCount() {
    var els = document.querySelectorAll('.cart-count');
    for (var i = 0; i < els.length; i++) els[i].textContent = '';
  }
}());
