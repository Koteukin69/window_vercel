'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import styles from './favorite_button.module.css';

interface FavoriteButtonProps {
  city: string;
  timeOfDay: string;
  size?: 'small' | 'medium';
}

export default function FavoriteButton({ city, timeOfDay, size = 'small' }: FavoriteButtonProps) {
  const { isAuthenticated, setShowAuthModal } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const favorite = isFavorite(city, timeOfDay);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);
    await toggleFavorite(city, timeOfDay);
    setIsLoading(false);
  };

  const iconSize = size === 'small' ? 18 : 24;

  return (
    <button
      className={`${styles.button} ${styles[size]} ${favorite ? styles.active : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      title={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={favorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
