'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PasswordInput from '../password_input/password_input';
import PasswordStrength from '../password_strength/password_strength';
import styles from './auth_modal.module.css';

export default function AuthModal() {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register
  } = useAuth();

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Common state
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal closes or mode changes
  useEffect(() => {
    if (!showAuthModal) {
      setLoginEmail('');
      setLoginPassword('');
      setRememberMe(false);
      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setRegConfirmPassword('');
      setAgreeTerms(false);
      setError('');
      setFieldErrors({});
    }
  }, [showAuthModal, authModalMode]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword, rememberMe);

    if (!result.success) {
      setError(result.error || 'Ошибка входа');
    }

    setIsLoading(false);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!agreeTerms) {
      setError('Необходимо согласиться с пользовательским соглашением');
      return;
    }

    setIsLoading(true);

    const result = await register(regName, regEmail, regPassword, regConfirmPassword);

    if (!result.success) {
      if (result.errors) {
        const errors: Record<string, string> = {};
        result.errors.forEach(err => {
          errors[err.field] = err.message;
        });
        setFieldErrors(errors);
      }
      setError(result.error || 'Ошибка регистрации');
    }

    setIsLoading(false);
  };

  const handleClose = () => {
    setShowAuthModal(false);
  };

  const switchMode = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setError('');
    setFieldErrors({});
  };

  if (!showAuthModal) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Закрыть"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className={styles.title}>
          {authModalMode === 'login' ? 'Вход' : 'Регистрация'}
        </h2>

        {error && <div className={styles.error}>{error}</div>}

        {authModalMode === 'login' ? (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="login-email" className={styles.label}>Email или логин</label>
              <input
                id="login-email"
                type="text"
                className={styles.input}
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.inputGroup}>
              <PasswordInput
                label="Пароль"
                id="login-password"
                value={loginPassword}
                onChange={setLoginPassword}
                required
              />
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="remember-me"
                className={styles.checkbox}
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me">Запомнить меня</label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <div className={styles.links}>
              <button
                type="button"
                className={styles.link}
                onClick={() => alert('Функция восстановления пароля будет добавлена позже')}
              >
                Забыли пароль?
              </button>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode('register')}
              >
                У меня нет аккаунта
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="reg-name" className={styles.label}>Имя</label>
              <input
                id="reg-name"
                type="text"
                className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`}
                value={regName}
                onChange={e => setRegName(e.target.value)}
                required
              />
              {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-email" className={styles.label}>Email</label>
              <input
                id="reg-email"
                type="email"
                className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                autoComplete="email"
              />
              {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <PasswordInput
                label="Пароль"
                id="reg-password"
                value={regPassword}
                onChange={setRegPassword}
                required
              />
              <PasswordStrength password={regPassword} />
              {fieldErrors.password && <span className={styles.fieldError}>{fieldErrors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <PasswordInput
                label="Подтвердите пароль"
                id="reg-confirm-password"
                value={regConfirmPassword}
                onChange={setRegConfirmPassword}
                required
              />
              {fieldErrors.confirmPassword && <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>}
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="agree-terms"
                className={styles.checkbox}
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
              />
              <label htmlFor="agree-terms">
                Я согласен с{' '}
                <a href="/terms" target="_blank" className={styles.termsLink}>
                  пользовательским соглашением
                </a>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <div className={styles.links}>
              <button
                type="button"
                className={styles.link}
                onClick={() => switchMode('login')}
              >
                У меня уже есть аккаунт
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
