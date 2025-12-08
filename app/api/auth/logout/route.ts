import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Получение токена из cookies
    const cookieHeader = request.headers.get('cookie');
    let token: string | undefined;

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      token = cookies['auth_token'];
    }

    // Удаление сессии из БД
    if (token) {
      await deleteSession(token);
    }

    // Удаление cookie
    const response = NextResponse.json(
      { message: 'Выход выполнен успешно' },
      { status: 200 }
    );

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0 // Немедленное удаление
    });

    console.log('[AUTH] User logged out');

    return response;
  } catch (error) {
    console.error('[AUTH] Logout error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
