'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useEffect } from 'react';
import styles from './sidebar_nav.module.css';

export default function SidebarNav() {
  const { isAuthenticated, user, setShowAuthModal, setAuthModalMode } = useAuth();
  const { fetchFavorites } = useFavorites();

  // Fetch favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
    } else {
      window.location.href = '/profile';
    }
  };

  const handleFavoritesClick = () => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
    } else {
      window.location.href = '/favorites';
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleAccountClick} className={styles.navButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className={styles.label}>
          {isAuthenticated ? user?.name?.split(' ')[0] || 'Аккаунт' : 'Войти'}
        </span>
      </button>

      <button onClick={handleFavoritesClick} className={styles.navButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className={styles.label}>Избранное</span>
      </button>

      <div className={styles.spacer}></div>

      <a href="/about" className={styles.navButton}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span className={styles.label}>О Проекте</span>
      </a>
    </div>
  );
}
