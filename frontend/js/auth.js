/* =========================================================
   ALVA – auth.js
   Sign In / Sign Up logic
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {

  /* ---- Elements ---- */
  var tabSignIn  = document.getElementById('tab-signin');
  var tabSignUp  = document.getElementById('tab-signup');
  var formSignIn = document.getElementById('form-signin');
  var formSignUp = document.getElementById('form-signup');
  var errorSignIn = document.getElementById('error-signin');
  var errorSignUp = document.getElementById('error-signup');

  /* ---- Tab Switching ---- */
  function activateTab(tab) {
    if (tab === 'signin') {
      tabSignIn.classList.add('active');
      tabSignUp.classList.remove('active');
      formSignIn.classList.add('active');
      formSignUp.classList.remove('active');
      clearErrors();
    } else {
      tabSignUp.classList.add('active');
      tabSignIn.classList.remove('active');
      formSignUp.classList.add('active');
      formSignIn.classList.remove('active');
      clearErrors();
    }
  }

  if (tabSignIn) {
    tabSignIn.addEventListener('click', function() { activateTab('signin'); });
  }
  if (tabSignUp) {
    tabSignUp.addEventListener('click', function() { activateTab('signup'); });
  }

  /* ---- Error Helpers ---- */
  function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
  }

  function clearErrors() {
    [errorSignIn, errorSignUp].forEach(function(el) {
      if (el) {
        el.textContent = '';
        el.classList.remove('visible');
      }
    });
    document.querySelectorAll('.form-input.error').forEach(function(inp) {
      inp.classList.remove('error');
    });
  }

  function parseApiError(data) {
    if (data.errors) {
      var msgs = [];
      Object.keys(data.errors).forEach(function(field) {
        var arr = data.errors[field];
        if (Array.isArray(arr)) {
          arr.forEach(function(m) { msgs.push(m); });
        } else {
          msgs.push(arr);
        }
      });
      return msgs.join('\n');
    }
    if (data.message) return data.message;
    return 'An unexpected error occurred.';
  }

  function setLoading(btn, loading) {
    btn.disabled = loading;
    btn.textContent = loading ? 'Please wait…' : btn.dataset.label;
  }

  /* ---- Show/Hide Password Toggles ---- */
  document.querySelectorAll('.form-input-toggle').forEach(function(btn) {
    var inputId = btn.dataset.target;
    var input = document.getElementById(inputId);
    if (!input) return;
    btn.addEventListener('click', function() {
      var isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      /* swap icon */
      btn.innerHTML = isPassword ? iconEyeOff() : iconEye();
    });
  });

  function iconEye() {
    return '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
  function iconEyeOff() {
    return '<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
  }

  /* ---- Forgot Password ---- */
  var forgotLink = document.getElementById('forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Password reset is not yet available. Please contact support.');
    });
  }

  /* ---- Sign In ---- */
  if (formSignIn) {
    var btnSignIn = formSignIn.querySelector('button[type="submit"]');
    if (btnSignIn) btnSignIn.dataset.label = btnSignIn.textContent;

    formSignIn.addEventListener('submit', function(e) {
      e.preventDefault();
      clearErrors();

      var email    = document.getElementById('signin-email').value.trim();
      var password = document.getElementById('signin-password').value;

      if (!email || !password) {
        showError(errorSignIn, 'Please enter your email and password.');
        return;
      }

      setLoading(btnSignIn, true);

      fetch('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      })
      .then(function(res) {
        return res.json().then(function(data) {
          return { status: res.status, data: data };
        });
      })
      .then(function(result) {
        setLoading(btnSignIn, false);
        if (result.status >= 200 && result.status < 300) {
          var token = result.data.token || (result.data.data && result.data.data.token);
          if (token) {
            localStorage.setItem('alva_token', token);
          }
          window.location.href = 'collection.html';
        } else {
          showError(errorSignIn, parseApiError(result.data));
        }
      })
      .catch(function(err) {
        setLoading(btnSignIn, false);
        showError(errorSignIn, 'Unable to connect. Please check your connection and try again.');
      });
    });
  }

  /* ---- Sign Up ---- */
  if (formSignUp) {
    var btnSignUp = formSignUp.querySelector('button[type="submit"]');
    if (btnSignUp) btnSignUp.dataset.label = btnSignUp.textContent;

    formSignUp.addEventListener('submit', function(e) {
      e.preventDefault();
      clearErrors();

      var name     = document.getElementById('signup-name').value.trim();
      var email    = document.getElementById('signup-email').value.trim();
      var password = document.getElementById('signup-password').value;
      var confirm  = document.getElementById('signup-confirm').value;

      if (!name || !email || !password || !confirm) {
        showError(errorSignUp, 'Please fill in all fields.');
        return;
      }

      if (password !== confirm) {
        showError(errorSignUp, 'Passwords do not match.');
        document.getElementById('signup-password').classList.add('error');
        document.getElementById('signup-confirm').classList.add('error');
        return;
      }

      if (password.length < 8) {
        showError(errorSignUp, 'Password must be at least 8 characters.');
        document.getElementById('signup-password').classList.add('error');
        return;
      }

      setLoading(btnSignUp, true);

      fetch('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirmation: confirm
        })
      })
      .then(function(res) {
        return res.json().then(function(data) {
          return { status: res.status, data: data };
        });
      })
      .then(function(result) {
        setLoading(btnSignUp, false);
        if (result.status >= 200 && result.status < 300) {
          var token = result.data.token || (result.data.data && result.data.data.token);
          if (token) {
            localStorage.setItem('alva_token', token);
          }
          window.location.href = 'collection.html';
        } else {
          showError(errorSignUp, parseApiError(result.data));
        }
      })
      .catch(function(err) {
        setLoading(btnSignUp, false);
        showError(errorSignUp, 'Unable to connect. Please check your connection and try again.');
      });
    });
  }

});
