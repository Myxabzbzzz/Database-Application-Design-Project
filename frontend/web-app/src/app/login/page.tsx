'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Типы ────────────────────────────────────────────────────────────────────

type Tab = 'signin' | 'signup';

// ─── Вспомогательный компонент: поле ввода ───────────────────────────────────

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
}

function InputField({ label, type, value, placeholder, onChange, rightSlot }: InputFieldProps) {
  return (
    <div className="input-group">
      <div className="input-header">
        <label className="input-label">{label}</label>
        {rightSlot && <div className="input-right-slot">{rightSlot}</div>}
      </div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        autoComplete="off"
      />
    </div>
  );
}

// ─── Иконка «скрыть/показать пароль» ─────────────────────────────────────────

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    // Открытый глаз
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    // Перечёркнутый глаз
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Главная страница ─────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('signin');

  // Sign In state
  const [signInEmail, setSignInEmail]       = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPass, setShowSignInPass] = useState(false);

  // Sign Up state
  const [signUpEmail, setSignUpEmail]             = useState('');
  const [signUpPassword, setSignUpPassword]       = useState('');
  const [signUpConfirm, setSignUpConfirm]         = useState('');
  const [showSignUpPass, setShowSignUpPass]       = useState(false);
  const [showSignUpConfirm, setShowSignUpConfirm] = useState(false);

  // Общее
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Кнопка активна только если заполнены нужные поля
  const signInReady  = signInEmail.trim() !== '' && signInPassword.trim() !== '';
  const signUpReady  =
    signUpEmail.trim() !== '' &&
    signUpPassword.trim() !== '' &&
    signUpConfirm.trim() !== '' &&
    signUpPassword === signUpConfirm;

  // ── Обработчики ─────────────────────────────────────────────────────────────

  async function handleSignIn() {
    if (!signInReady) return;
    setError('');
    setLoading(true);

    // TODO [БЕКЕНД]: Нужен эндпоинт для входа пользователя.
    // Принимает:  POST { email: string, password: string }
    // Возвращает: { token: string, user: { id: string, name: string, email: string } }
    //
    // Пример подключения:
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: signInEmail, password: signInPassword }),
    // });
    // const data = await res.json();
    // if (!res.ok) { setError(data.message || 'Ошибка входа'); setLoading(false); return; }
    // localStorage.setItem('token', data.token);
    // router.push('/');

    // Заглушка — убрать когда будет бекенд:
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert('Sign In clicked (backend not connected)');
  }

  async function handleSignUp() {
    if (!signUpReady) return;
    if (signUpPassword !== signUpConfirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    // TODO [БЕКЕНД]: Нужен эндпоинт для регистрации нового пользователя.
    // Принимает:  POST { email: string, password: string }
    // Возвращает: { token: string, user: { id: string, name: string, email: string } }
    // После успешной регистрации — сохрани токен и редиректни на главную.
    //
    // Пример подключения:
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: signUpEmail, password: signUpPassword }),
    // });
    // const data = await res.json();
    // if (!res.ok) { setError(data.message || 'Ошибка регистрации'); setLoading(false); return; }
    // localStorage.setItem('token', data.token);
    // router.push('/');

    // Заглушка — убрать когда будет бекенд:
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    alert('Sign Up clicked (backend not connected)');
  }

  async function handleForgotPassword() {
    // TODO [БЕКЕНД]: Нужен эндпоинт для восстановления пароля.
    // Принимает:  POST { email: string }
    // Возвращает: { message: string } — сообщение что письмо отправлено
    //
    // Пример подключения:
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: signInEmail }),
    // });
    // const data = await res.json();
    // alert(data.message);

    // Заглушка:
    alert(`Password reset link sent to: ${signInEmail || '(enter your email first)'}`);
  }

  // ── Рендер ──────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { font-family: 'Jost', sans-serif; }

        .auth-page {
          display: flex;
          min-height: 100vh;
          width: 100%;
        }

        /* ── ЛЕВАЯ ПАНЕЛЬ (фото) ── */
        .auth-left {
          position: relative;
          flex: 0 0 50%;
          background: #0a0a0a;
          overflow: hidden;
        }

        /* TODO [БЕКЕНД/КОНТЕНТ]: Замени background-image на реальное фото модели.
           Можно хранить в /public/images/auth-hero.jpg
           или получать URL из CMS. */
        .auth-left-image {
          position: absolute;
          inset: 0;
          background-image: url('/images/auth-hero.jpg');
          background-size: cover;        /* ← natural dimensions */
          background-repeat: no-repeat; /* prevent tiling */
          background-position: center top;
          opacity: 0.85;
        }

        /* Градиент снизу для текста */
        .auth-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%);
        }

        .auth-left-content {
          position: absolute;
          bottom: 48px;
          left: 48px;
          right: 48px;
          color: #fff;
        }

        .auth-logo {
          font-family: 'EB Garamond', serif;
          font-size: 52px;
          font-weight: 400;
          letter-spacing: 0.08em;
          line-height: 1;
          margin-bottom: 16px;
        }

        .auth-tagline {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.02em;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
          max-width: 280px;
        }

        /* ── ПРАВАЯ ПАНЕЛЬ (форма) ── */
        .auth-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 100px;
          background: #ffffff;
        }

        /* ── ТАБЫ ── */
        .auth-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 56px;
        }

        .auth-tab {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #b0a9a0;
          padding: 0 0 10px;
          margin-right: 36px;
          border-bottom: 1.5px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          text-transform: uppercase;
        }

        .auth-tab.active {
          color: #111;
          border-bottom-color: #111;
        }

        .auth-tab:hover:not(.active) {
          color: #555;
        }

        /* ── ЗАГОЛОВОК ── */
        .auth-heading {
          font-family: 'EB Garamond', serif;
          font-size: 48px;
          font-weight: 400;
          color: #111;
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .auth-subheading {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: #888;
          letter-spacing: 0.01em;
          margin-bottom: 44px;
        }

        /* ── ПОЛЯ ── */
        .input-group {
          margin-bottom: 28px;
        }

        .input-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .input-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: #888;
          text-transform: uppercase;
        }

        .input-right-slot {
          display: flex;
          align-items: center;
        }

        .forgot-link {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #555;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
          background: none;
          border: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .forgot-link:hover { color: #111; }

        .show-pass-link {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #888;
          cursor: pointer;
          background: none;
          border: none;
          transition: color 0.2s;
        }

        .show-pass-link:hover { color: #111; }

        .input-wrapper {
          position: relative;
        }

        .input-field {
          width: 100%;
          border: none;
          border-bottom: 1px solid #d8d3ce;
          background: transparent;
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #111;
          padding: 6px 36px 10px 0;
          outline: none;
          transition: border-color 0.2s;
          letter-spacing: 0.01em;
        }

        .input-field::placeholder {
          color: #c5bfba;
          font-weight: 300;
        }

        .input-field:focus {
          border-bottom-color: #111;
        }

        .pass-toggle {
          position: absolute;
          right: 0;
          bottom: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .pass-toggle:hover { color: #111; }

        /* ── КНОПКА ── */
        .btn-continue {
          width: 100%;
          height: 54px;
          background: #111;
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-top: 8px;
          margin-bottom: 32px;
          transition: background 0.2s, opacity 0.2s;
          position: relative;
          overflow: hidden;
        }

        .btn-continue:disabled {
          background: #e8e4e0;
          color: #aaa;
          cursor: not-allowed;
        }

        .btn-continue:not(:disabled):hover {
          background: #222;
        }

        .btn-continue.loading::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          animation: shimmer 1s infinite;
        }

        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* ── ОШИБКА ── */
        .auth-error {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          color: #c0392b;
          margin-bottom: 12px;
          letter-spacing: 0.02em;
        }

        /* ── ПОДВАЛ ── */
        .auth-footer {
          font-family: 'Jost', sans-serif;
          font-size: 12px;
          font-weight: 300;
          color: #aaa;
          letter-spacing: 0.01em;
          line-height: 1.5;
        }

        .auth-footer a {
          color: #888;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }

        .auth-footer a:hover { color: #111; }

        /* ── Адаптив ── */
        @media (max-width: 900px) {
          .auth-left  { display: none; }
          .auth-right { padding: 60px 40px; }
        }

        @media (max-width: 480px) {
          .auth-right { padding: 40px 24px; }
          .auth-heading { font-size: 36px; }
        }
      `}</style>

      <div className="auth-page">

        {/* ── Левая панель ── */}
        <div className="auth-left">
          <div className="auth-left-image" />
          <div className="auth-left-overlay" />
          <div className="auth-left-content">
            <div className="auth-logo">ALVA</div>
            <p className="auth-tagline">
              Refining the essence of modern elegance. Your exclusive journey begins here.
            </p>
          </div>
        </div>

        {/* ── Правая панель ── */}
        <div className="auth-right">

          {/* Табы */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => { setTab('signin'); setError(''); }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => { setTab('signup'); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          {/* Заголовок */}
          <h1 className="auth-heading">
            {tab === 'signin' ? 'Welcome Back' : 'Welcome'}
          </h1>
          <p className="auth-subheading">
            Enter your credentials to access your private collection.
          </p>

          {/* Ошибка */}
          {error && <p className="auth-error">{error}</p>}

          {/* ── ФОРМА ВХОДА ── */}
          {tab === 'signin' && (
            <>
              <InputField
                label="Email Address"
                type="email"
                value={signInEmail}
                placeholder="email@aura-exclusive.com"
                onChange={setSignInEmail}
              />

              <div className="input-group">
                <div className="input-header">
                  <label className="input-label">Password</label>
                  <button className="forgot-link" onClick={handleForgotPassword}>
                    Forgot?
                  </button>
                </div>
                <div className="input-wrapper">
                  <input
                    type={showSignInPass ? 'text' : 'password'}
                    value={signInPassword}
                    placeholder="••••••••"
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="input-field"
                  />
                  <button
                    className="pass-toggle"
                    onClick={() => setShowSignInPass((p) => !p)}
                    tabIndex={-1}
                  >
                    <EyeIcon visible={showSignInPass} />
                  </button>
                </div>
              </div>

              <button
                className={`btn-continue ${loading ? 'loading' : ''}`}
                disabled={!signInReady || loading}
                onClick={handleSignIn}
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </>
          )}

          {/* ── ФОРМА РЕГИСТРАЦИИ ── */}
          {tab === 'signup' && (
            <>
              <InputField
                label="Email Address"
                type="email"
                value={signUpEmail}
                placeholder="email@aura-exclusive.com"
                onChange={setSignUpEmail}
              />

              <div className="input-group">
                <div className="input-header">
                  <label className="input-label">New Password</label>
                  {signUpPassword && (
                    <button className="show-pass-link" onClick={() => setShowSignUpPass((p) => !p)}>
                      {showSignUpPass ? 'Hide password' : 'Show password'}
                    </button>
                  )}
                </div>
                <div className="input-wrapper">
                  <input
                    type={showSignUpPass ? 'text' : 'password'}
                    value={signUpPassword}
                    placeholder="••••••••"
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="input-field"
                  />
                  {!signUpPassword && (
                    <button
                      className="pass-toggle"
                      onClick={() => setShowSignUpPass((p) => !p)}
                      tabIndex={-1}
                    >
                      <EyeIcon visible={showSignUpPass} />
                    </button>
                  )}
                </div>
              </div>

              <div className="input-group">
                <div className="input-header">
                  <label className="input-label">Confirm Password</label>
                  {signUpConfirm && (
                    <button className="show-pass-link" onClick={() => setShowSignUpConfirm((p) => !p)}>
                      {showSignUpConfirm ? 'Hide password' : 'Show password'}
                    </button>
                  )}
                </div>
                <div className="input-wrapper">
                  <input
                    type={showSignUpConfirm ? 'text' : 'password'}
                    value={signUpConfirm}
                    placeholder="••••••••"
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    className="input-field"
                  />
                  {!signUpConfirm && (
                    <button
                      className="pass-toggle"
                      onClick={() => setShowSignUpConfirm((p) => !p)}
                      tabIndex={-1}
                    >
                      <EyeIcon visible={showSignUpConfirm} />
                    </button>
                  )}
                </div>
              </div>

              <button
                className={`btn-continue ${loading ? 'loading' : ''}`}
                disabled={!signUpReady || loading}
                onClick={handleSignUp}
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </>
          )}

          {/* Подвал */}
          <p className="auth-footer">
            By continuing, you agree to ALVA's{' '}
            {/* TODO [БЕКЕНД/КОНТЕНТ]: Замени href на реальные страницы Terms и Privacy */}
            <a onClick={() => router.push('/terms')}>Terms of Service</a>{' '}
            and{' '}
            <a onClick={() => router.push('/privacy')}>Privacy Policy</a>.
          </p>

        </div>
      </div>
    </>
  );
}
