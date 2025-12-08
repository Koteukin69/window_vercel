import { NextResponse } from 'next/server';
import { getDb, DbUser } from '@/lib/db';
import { hashPassword, generateToken, createSession, getAuthCookieOptions } from '@/lib/auth';
import { validateRegistration, sanitizeString } from '@/lib/validation';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(ip, '/api/auth/register');

    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit);
    }

    // Парсинг тела запроса
    const body = await request.json() as RegisterRequest;

    // Санитизация
    const name = sanitizeString(body.name || '');
    const email = sanitizeString(body.email || '').toLowerCase();
    const password = body.password || '';
    const confirmPassword = body.confirmPassword || '';

    // Валидация
    const validation = validateRegistration({ name, email, password, confirmPassword });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation Error', errors: validation.errors },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Проверка существования пользователя
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    ` as DbUser[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 409 }
      );
    }

    // Хеширование пароля
    const passwordHash = await hashPassword(password);

    // Создание пользователя
    const result = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${passwordHash})
      RETURNING id, email, name, avatar, created_at, updated_at
    ` as DbUser[];

    const user = result[0];

    // Генерация токена и создание сессии
    const token = generateToken(user.id);
    await createSession(user.id, token);

    // Создание ответа с cookie
    const cookieOptions = getAuthCookieOptions(false);
    const response = NextResponse.json(
      {
        message: 'Регистрация успешна',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        }
      },
      { status: 201 }
    );

    response.cookies.set(cookieOptions.name, token, {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      path: cookieOptions.path,
      maxAge: cookieOptions.maxAge
    });

    console.log(`[AUTH] User registered: ${email}`);

    return response;
  } catch (error) {
    console.error('[AUTH] Registration error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
