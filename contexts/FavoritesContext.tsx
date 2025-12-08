'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface FavoriteItem {
  id: number;
  city: string;
  timeOfDay: string;
  poster: string | null;
  src: { [key: string]: string } | null;
  description: string | null;
  createdAt: Date;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isLoading: boolean;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (city: string, timeOfDay: string) => Promise<{ success: boolean; error?: string }>;
  removeFromFavorites: (city: string, timeOfDay: string) => Promise<{ success: boolean; error?: string }>;
  isFavorite: (city: string, timeOfDay: string) => boolean;
  toggleFavorite: (city: string, timeOfDay: string) => Promise<{ success: boolean; error?: string }>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites);
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addToFavorites = async (city: string, timeOfDay: string) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Необходимо войти в аккаунт' };
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, timeOfDay })
      });

      const data = await response.json();

      if (response.ok) {
        await fetchFavorites();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Ошибка добавления в избранное' };
      }
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  };

  const removeFromFavorites = async (city: string, timeOfDay: string) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Необходимо войти в аккаунт' };
    }

    try {
      const response = await fetch(`/api/favorites?city=${encodeURIComponent(city)}&timeOfDay=${encodeURIComponent(timeOfDay)}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        setFavorites(prev => prev.filter(f =>
          !(f.city.toLowerCase() === city.toLowerCase() && f.timeOfDay === timeOfDay)
        ));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Ошибка удаления из избранного' };
      }
    } catch {
      return { success: false, error: 'Ошибка сети' };
    }
  };

  const isFavorite = useCallback((city: string, timeOfDay: string) => {
    return favorites.some(f =>
      f.city.toLowerCase() === city.toLowerCase() && f.timeOfDay === timeOfDay
    );
  }, [favorites]);

  const toggleFavorite = async (city: string, timeOfDay: string) => {
    if (isFavorite(city, timeOfDay)) {
      return removeFromFavorites(city, timeOfDay);
    } else {
      return addToFavorites(city, timeOfDay);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
