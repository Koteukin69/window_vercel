// Регулярные выражения для валидации
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Валидация email
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!email || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email обязателен' });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Некорректный формат email' });
  } else if (email.length > 255) {
    errors.push({ field: 'email', message: 'Email слишком длинный' });
  }

  return { valid: errors.length === 0, errors };
}

// Валидация пароля
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!password) {
    errors.push({ field: 'password', message: 'Пароль обязателен' });
  } else {
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push({ field: 'password', message: `Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов` });
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Пароль должен содержать хотя бы одну заглавную букву' });
    }
    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Пароль должен содержать хотя бы одну строчную букву' });
    }
    if (!/[0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Пароль должен содержать хотя бы одну цифру' });
    }
  }

  return { valid: errors.length === 0, errors };
}

// Проверка надежности пароля (для индикатора)
export function getPasswordStrength(password: string): {
  score: number;
  label: 'weak' | 'medium' | 'strong' | 'very_strong';
  color: string;
} {
  if (!password) {
    return { score: 0, label: 'weak', color: '#ff4444' };
  }

  let score = 0;

  // Длина
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Разнообразие символов
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Оценка
  if (score <= 2) return { score, label: 'weak', color: '#ff4444' };
  if (score <= 4) return { score, label: 'medium', color: '#ffaa00' };
  if (score <= 5) return { score, label: 'strong', color: '#44bb44' };
  return { score, label: 'very_strong', color: '#22aa22' };
}

// Валидация имени
export function validateName(name: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!name || name.trim() === '') {
    errors.push({ field: 'name', message: 'Имя обязательно' });
  } else if (name.trim().length < NAME_MIN_LENGTH) {
    errors.push({ field: 'name', message: `Имя должно содержать минимум ${NAME_MIN_LENGTH} символа` });
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.push({ field: 'name', message: 'Имя слишком длинное' });
  }

  return { valid: errors.length === 0, errors };
}

// Валидация подтверждения пароля
export function validatePasswordConfirm(password: string, confirmPassword: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Подтвердите пароль' });
  } else if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Пароли не совпадают' });
  }

  return { valid: errors.length === 0, errors };
}

// Полная валидация для регистрации
export function validateRegistration(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  const nameResult = validateName(data.name);
  const emailResult = validateEmail(data.email);
  const passwordResult = validatePassword(data.password);
  const confirmResult = validatePasswordConfirm(data.password, data.confirmPassword);

  errors.push(...nameResult.errors);
  errors.push(...emailResult.errors);
  errors.push(...passwordResult.errors);
  errors.push(...confirmResult.errors);

  return { valid: errors.length === 0, errors };
}

// Валидация для входа
export function validateLogin(data: { login: string; password: string }): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.login || data.login.trim() === '') {
    errors.push({ field: 'login', message: 'Email или логин обязателен' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Пароль обязателен' });
  }

  return { valid: errors.length === 0, errors };
}

// Санитизация строки (базовая очистка)
export function sanitizeString(str: string): string {
  return str.trim().slice(0, 1000);
}
