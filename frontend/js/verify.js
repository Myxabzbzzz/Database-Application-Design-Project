/* =========================================================
   ALVA – verify.js
   Email verification with 6-digit OTP
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  var token       = localStorage.getItem('alva_token');
  var email       = localStorage.getItem('alva_pending_email');
  var errorEl     = document.getElementById('error-verify');
  var btnVerify   = document.getElementById('btn-verify');
  var resendBtn   = document.getElementById('resend-btn');
  var resendTimer = document.getElementById('resend-timer');
  var emailDisplay = document.getElementById('email-display');
  var inputs      = Array.from(document.querySelectorAll('.otp-input'));

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  if (email && emailDisplay) {
    emailDisplay.textContent = email;
  }

  /* ---- OTP input behaviour ---- */
  inputs.forEach(function (input, idx) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace') {
        if (input.value === '' && idx > 0) {
          inputs[idx - 1].focus();
          inputs[idx - 1].value = '';
          inputs[idx - 1].classList.remove('filled');
        } else {
          input.value = '';
          input.classList.remove('filled');
        }
        e.preventDefault();
      }
    });

    input.addEventListener('input', function () {
      var val = input.value.replace(/\D/g, '').slice(-1);
      input.value = val;
      if (val) {
        input.classList.add('filled');
        if (idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        } else {
          input.blur();
        }
      } else {
        input.classList.remove('filled');
      }
    });

    input.addEventListener('paste', function (e) {
      e.preventDefault();
      var pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach(function (char, i) {
        if (inputs[i]) {
          inputs[i].value = char;
          inputs[i].classList.add('filled');
        }
      });
      var next = Math.min(pasted.length, inputs.length - 1);
      inputs[next].focus();
    });
  });

  function getCode() {
    return inputs.map(function (i) { return i.value; }).join('');
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }

  function setLoading(loading) {
    btnVerify.disabled = loading;
    btnVerify.textContent = loading ? 'Please wait…' : btnVerify.dataset.label;
  }

  /* ---- Submit ---- */
  document.getElementById('form-verify').addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();

    var code = getCode();
    if (code.length < 6) {
      showError('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);

    fetch('http://localhost/api/auth/email/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ code: code })
    })
    .then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data }; });
    })
    .then(function (result) {
      setLoading(false);
      if (result.status >= 200 && result.status < 300) {
        localStorage.removeItem('alva_pending_email');
        window.location.href = 'collection.html';
      } else {
        var msg = result.data.message || 'Invalid code. Please try again.';
        showError(msg);
        inputs.forEach(function (i) { i.value = ''; i.classList.remove('filled'); });
        inputs[0].focus();
      }
    })
    .catch(function () {
      setLoading(false);
      showError('Unable to connect. Please try again.');
    });
  });

  /* ---- Resend ---- */
  var resendCooldown = 0;
  var timerInterval  = null;

  function startCooldown(seconds) {
    resendCooldown = seconds;
    resendBtn.disabled = true;
    tick();
    timerInterval = setInterval(tick, 1000);
  }

  function tick() {
    if (resendCooldown <= 0) {
      clearInterval(timerInterval);
      resendBtn.disabled = false;
      resendTimer.textContent = '';
      return;
    }
    resendTimer.textContent = '(' + resendCooldown + 's)';
    resendCooldown--;
  }

  resendBtn.addEventListener('click', function () {
    clearError();

    fetch('http://localhost/api/auth/email/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data }; });
    })
    .then(function (result) {
      if (result.status >= 200 && result.status < 300) {
        startCooldown(60);
        inputs.forEach(function (i) { i.value = ''; i.classList.remove('filled'); });
        inputs[0].focus();
      } else {
        showError(result.data.message || 'Failed to resend. Please try again.');
      }
    })
    .catch(function () {
      showError('Unable to connect. Please try again.');
    });
  });

  startCooldown(60);
  inputs[0].focus();
});
