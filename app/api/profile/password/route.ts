import { NextResponse } from 'next/server';
import { getDb, DbUser } from '@/lib/db';
import { getUserFromRequest, verifyPassword, hashPassword } from '@/lib/auth';
import { validatePassword } from '@/lib/validation';

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// PUT /api/profile/password - смена пароля
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json() as PasswordChangeRequest;
    const { currentPassword, newPassword, confirmPassword } = body;

    // Валидация входных данных
    if (!currentPassword) {
      return NextResponse.json(
        { error: 'Validation Error', errors: [{ field: 'currentPassword', message: 'Текущий пароль обязателен' }] },
        { status: 400 }
      );
    }

    // Валидация нового пароля
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Validation Error', errors: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Проверка совпадения паролей
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'Validation Error', errors: [{ field: 'confirmPassword', message: 'Пароли не совпадают' }] },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Получаем текущий хеш пароля
    const users = await sql`
      SELECT password_hash FROM users WHERE id = ${user.id}
    ` as DbUser[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем текущий пароль
    const isValidPassword = await verifyPassword(currentPassword, users[0].password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный текущий пароль' },
        { status: 401 }
      );
    }

    // Хешируем новый пароль
    const newPasswordHash = await hashPassword(newPassword);

    // Обновляем пароль
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${user.id}
    `;

    console.log(`[PROFILE] Password changed for user: ${user.email}`);

    return NextResponse.json({
      message: 'Пароль успешно изменен'
    });
  } catch (error) {
    console.error('[PROFILE] Password change error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
