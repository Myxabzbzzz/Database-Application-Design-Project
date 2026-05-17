/* =========================================================
   ALVA – profile.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var token = localStorage.getItem('alva_token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  var loadingEl  = document.getElementById('profile-loading');
  var contentEl  = document.getElementById('profile-content');
  var errorEl    = document.getElementById('profile-error');

  fetch('http://localhost/api/auth/me', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  .then(function (res) {
    if (res.status === 401) {
      localStorage.removeItem('alva_token');
      window.location.href = 'login.html';
      return null;
    }
    return res.json();
  })
  .then(function (data) {
    if (!data) return;

    var user = data.data || data;

    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';

    var name  = user.name  || '—';
    var email = user.email || '—';
    var role  = user.role  || user.type || 'customer';
    var verified = !!user.email_verified_at;
    var since = user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : '—';

    document.getElementById('profile-name').textContent  = name;
    document.getElementById('profile-email').textContent = email;
    document.getElementById('detail-name').textContent   = name;
    document.getElementById('detail-email').textContent  = email;
    document.getElementById('detail-role').textContent   = role.charAt(0).toUpperCase() + role.slice(1);
    document.getElementById('detail-since').textContent  = since;

    if (verified) {
      document.getElementById('profile-verified-badge').style.display   = 'inline-flex';
    } else {
      var unverifiedBtn = document.getElementById('profile-unverified-badge');
      unverifiedBtn.style.display = 'inline-flex';
      unverifiedBtn.addEventListener('click', function () {
        unverifiedBtn.disabled    = true;
        unverifiedBtn.textContent = 'Sending…';
        // save email so verify.html can display it
        localStorage.setItem('alva_pending_email', email);
        fetch('http://localhost/api/auth/email/resend', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
        .finally(function () {
          window.location.href = 'verify.html';
        });
      });
    }
  })
  .catch(function () {
    loadingEl.style.display = 'none';
    errorEl.style.display   = 'block';
  });

  document.getElementById('btn-logout').addEventListener('click', function () {
    fetch('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).finally(function () {
      clearCart();
      localStorage.removeItem('alva_token');
      localStorage.removeItem('alva_pending_email');
      window.location.href = 'login.html';
    });
  });

});
