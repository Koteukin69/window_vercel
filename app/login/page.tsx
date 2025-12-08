'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { setShowAuthModal, setAuthModalMode } = useAuth();

  useEffect(() => {
    setAuthModalMode('login');
    setShowAuthModal(true);
    router.push('/');
  }, [router, setShowAuthModal, setAuthModalMode]);

  return null;
}
