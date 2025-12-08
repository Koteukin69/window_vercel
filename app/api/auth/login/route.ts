import { NextResponse } from 'next/server';
import { getDb, DbUser } from '@/lib/db';
import { verifyPassword, generateToken, createSession, getAuthCookieOptions } from '@/lib/auth';
import { validateLogin, sanitizeString } from '@/lib/validation';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

interface LoginRequest {
  login: string;
  password: string;
  rememberMe?: boolean;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, '/api/auth/login');

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // Парсинг тела запроса
    const body = await request.json() as LoginRequest;

    // Санитизация
    const login = sanitizeString(body.login || '').toLowerCase();
    const password = body.password || '';
    const rememberMe = Boolean(body.rememberMe);

    // Валидация
    const validation = validateLogin({ login, password });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation Error', errors: validation.errors },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Поиск пользователя по email или имени
    const users = await sql`
      SELECT id, email, name, password_hash, avatar, created_at, updated_at
      FROM users
      WHERE email = ${login} OR LOWER(name) = ${login}
    ` as DbUser[];

    if (users.length === 0) {
      // Используем общее сообщение для безопасности
      return NextResponse.json(
        { error: 'Неверный email/логин или пароль' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Проверка пароля
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      console.log(`[AUTH] Failed login attempt for: ${login}`);
      return NextResponse.json(
        { error: 'Неверный email/логин или пароль' },
        { status: 401 }
      );
    }

    // Генерация токена и создание сессии
    const token = generateToken(user.id);
    await createSession(user.id, token);

    // Создание ответа с cookie
    const cookieOptions = getAuthCookieOptions(rememberMe);
    const response = NextResponse.json(
      {
        message: 'Вход выполнен успешно',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      },
      { status: 200 }
    );

    response.cookies.set(cookieOptions.name, token, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge
    });

    console.log(`[AUTH] User logged in: ${user.email}`);

    return response;
  } catch (error) {
    console.error('[AUTH] Login error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
