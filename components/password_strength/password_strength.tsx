'use client';

import styles from './password_strength.module.css';

interface PasswordStrengthProps {
  password: string;
}

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: '', color: 'transparent' };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, label: 'Слабый', color: '#ff4444' };
  if (score <= 4) return { score, label: 'Средний', color: '#ffaa00' };
  if (score <= 5) return { score, label: 'Надежный', color: '#44bb44' };
  return { score, label: 'Очень надежный', color: '#22aa22' };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = getPasswordStrength(password);
  const percentage = Math.min((strength.score / 7) * 100, 100);

  if (!password) return null;

  return (
    <div className={styles.container}>
      <div className={styles.barContainer}>
        <div
          className={styles.bar}
          style={{
            width: `${percentage}%`,
            backgroundColor: strength.color
          }}
        />
      </div>
      <span className={styles.label} style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
}
