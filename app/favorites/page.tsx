'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import styles from './favorites.module.css';

function getTimeOfDayLabel(timeOfDay: string): string {
  switch (timeOfDay) {
    case 'morning':
      return 'Утро';
    case 'day':
      return 'День';
    case 'night':
      return 'Ночь';
    default:
      return timeOfDay;
  }
}

export default function Favorites() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, setShowAuthModal } = useAuth();
  const { favorites, isLoading, fetchFavorites, removeFromFavorites } = useFavorites();

  // Fetch favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, fetchFavorites]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowAuthModal(true);
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router, setShowAuthModal]);

  const handleRemove = async (city: string, timeOfDay: string) => {
    await removeFromFavorites(city, timeOfDay);
  };

  const handleCardClick = (city: string, timeOfDay: string) => {
    router.push(`/?city=${encodeURIComponent(city)}&time_of_day=${timeOfDay}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Избранное</h1>

      {favorites.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <h2 className={styles.emptyTitle}>Пусто</h2>
          <p className={styles.emptyText}>
            Вы еще не добавили ни одного видео в избранное.
            <br />
            Найдите интересные виды на главной странице!
          </p>
          <a href="/" className={styles.homeLink}>
            На главную
          </a>
        </div>
      ) : (
        <div className={styles.grid}>
          {favorites.map(favorite => (
            <div key={favorite.id} className={styles.card}>
              <div
                className={styles.cardContent}
                onClick={() => handleCardClick(favorite.city, favorite.timeOfDay)}
              >
                {favorite.poster ? (
                  <img
                    src={favorite.poster}
                    alt={favorite.city}
                    className={styles.cardImage}
                  />
                ) : (
                  <div className={styles.cardPlaceholder}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21,15 16,10 5,21" />
                    </svg>
                  </div>
                )}
                <div className={styles.cardOverlay}>
                  <h3 className={styles.cardTitle}>{favorite.city}</h3>
                  <p className={styles.cardTime}>{getTimeOfDayLabel(favorite.timeOfDay)}</p>
                </div>
              </div>
              <button
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(favorite.city, favorite.timeOfDay);
                }}
                aria-label="Удалить из избранного"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
