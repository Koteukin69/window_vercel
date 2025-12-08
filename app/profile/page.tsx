'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PasswordInput from '@/components/password_input/password_input';
import PasswordStrength from '@/components/password_strength/password_strength';
import styles from './profile.module.css';

export default function Profile() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, updateProfile, changePassword, logout, setShowAuthModal } = useAuth();

  // Profile edit state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router, setShowAuthModal]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsUpdating(true);

    const updates: { name?: string; email?: string } = {};

    if (editName !== user?.name) {
      updates.name = editName;
    }
    if (editEmail !== user?.email) {
      updates.email = editEmail;
    }

    if (Object.keys(updates).length === 0) {
      setProfileError('Нет изменений для сохранения');
      setIsUpdating(false);
      return;
    }

    const result = await updateProfile(updates);

    if (result.success) {
      setProfileSuccess('Профиль обновлен');
    } else {
      setProfileError(result.error || 'Ошибка обновления профиля');
    }

    setIsUpdating(false);
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    setIsChangingPassword(true);

    const result = await changePassword(currentPassword, newPassword, confirmPassword);

    if (result.success) {
      setPasswordSuccess('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(result.error || 'Ошибка смены пароля');
    }

    setIsChangingPassword(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Профиль</h1>

      <div className={styles.userHeader}>
        <div className={styles.avatar}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.userName}>{user.name}</div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Мои данные</h2>

        {profileError && <div className={styles.error}>{profileError}</div>}
        {profileSuccess && <div className={styles.success}>{profileSuccess}</div>}

        <form onSubmit={handleProfileUpdate} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="edit-name" className={styles.label}>Имя</label>
            <input
              id="edit-name"
              type="text"
              className={styles.input}
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="edit-email" className={styles.label}>Email</label>
            <input
              id="edit-email"
              type="email"
              className={styles.input}
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={isUpdating}
          >
            {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Смена пароля</h2>

        {passwordError && <div className={styles.error}>{passwordError}</div>}
        {passwordSuccess && <div className={styles.success}>{passwordSuccess}</div>}

        <form onSubmit={handlePasswordChange} className={styles.form}>
          <div className={styles.inputGroup}>
            <PasswordInput
              label="Текущий пароль"
              id="current-password"
              value={currentPassword}
              onChange={setCurrentPassword}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <PasswordInput
              label="Новый пароль"
              id="new-password"
              value={newPassword}
              onChange={setNewPassword}
              required
            />
            <PasswordStrength password={newPassword} />
          </div>

          <div className={styles.inputGroup}>
            <PasswordInput
              label="Подтвердите новый пароль"
              id="confirm-new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? 'Изменение...' : 'Изменить пароль'}
          </button>
        </form>
      </section>

      <div className={styles.logoutSection}>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
