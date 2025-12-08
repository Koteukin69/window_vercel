'use client';

import { useState } from 'react';
import styles from './password_input.module.css';

interface PasswordInputProps {
  label: string;
  id: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export default function PasswordInput({
  label,
  id,
  placeholder,
  value,
  onChange,
  required = false
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-rows-[22px_27px] gap-[5px]">
      <label htmlFor={id} className="text-[18px] font-400">{label}</label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          className={styles.input}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={e => onChange?.(e.target.value)}
        />
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
