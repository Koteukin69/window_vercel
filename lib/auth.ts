import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, DbUser, DbSession } from './db';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';
const SESSION_EXPIRY_DAYS = 7;

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Генерация JWT токена
export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Верификация JWT токена
export function verifyToken(token: string): { userId: number } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch {
    return null;
  }
}

// Хеширование токена для хранения в БД
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

// Создание сессии в БД
export async function createSession(userId: number, token: string): Promise<void> {
  const sql = getDb();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${tokenHash}, ${expiresAt.toISOString()})
  `;
}

// Удаление сессии
export async function deleteSession(token: string): Promise<void> {
  const sql = getDb();
  const decoded = verifyToken(token);
  if (!decoded) return;

  // Удаляем все сессии пользователя с данным токеном
  // Так как мы храним хеш, нужно получить все сессии пользователя и проверить
  const sessions = await sql`
    SELECT * FROM sessions WHERE user_id = ${decoded.userId}
  ` as DbSession[];

  for (const session of sessions) {
    const matches = await bcrypt.compare(token, session.token_hash);
    if (matches) {
      await sql`DELETE FROM sessions WHERE id = ${session.id}`;
      break;
    }
  }
}

// Очистка просроченных сессий
export async function cleanExpiredSessions(): Promise<void> {
  const sql = getDb();
  await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
}

// Получение текущего пользователя из токена в cookies
export async function getCurrentUser(): Promise<DbUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const sql = getDb();
    const users = await sql`
      SELECT id, email, name, avatar, created_at, updated_at
      FROM users WHERE id = ${decoded.userId}
    ` as DbUser[];

    return users[0] || null;
  } catch {
    return null;
  }
}

// Получение пользователя из request headers (для API routes)
export async function getUserFromRequest(request: Request): Promise<DbUser | null> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = parseCookies(cookieHeader);
    const token = cookies['auth_token'];

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const sql = getDb();
    const users = await sql`
      SELECT id, email, name, avatar, created_at, updated_at
      FROM users WHERE id = ${decoded.userId}
    ` as DbUser[];

    return users[0] || null;
  } catch {
    return null;
  }
}

// Парсинг cookies из заголовка
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) {
      cookies[name] = rest.join('=');
    }
  });
  return cookies;
}

// Установка auth cookie
export function getAuthCookieOptions(rememberMe: boolean = false) {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 дней или 7 дней

  return {
    name: 'auth_token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge
  };
}
