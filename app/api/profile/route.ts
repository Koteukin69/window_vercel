import { NextResponse } from 'next/server';
import { getDb, DbUser } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { validateName, validateEmail, sanitizeString } from '@/lib/validation';

// GET /api/profile - получение данных профиля
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('[PROFILE] Get error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - обновление данных профиля
export async function PUT(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json() as { name?: string; email?: string };

    const updates: { name?: string; email?: string } = {};
    const errors: Array<{ field: string; message: string }> = [];

    // Валидация имени
    if (body.name !== undefined) {
      const name = sanitizeString(body.name);
      const nameValidation = validateName(name);
      if (!nameValidation.valid) {
        errors.push(...nameValidation.errors);
      } else {
        updates.name = name;
      }
    }

    // Валидация email
    if (body.email !== undefined) {
      const email = sanitizeString(body.email).toLowerCase();
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        errors.push(...emailValidation.errors);
      } else {
        // Проверка уникальности email
        const sql = getDb();
        const existingUsers = await sql`
          SELECT id FROM users WHERE email = ${email} AND id != ${user.id}
        ` as DbUser[];

        if (existingUsers.length > 0) {
          errors.push({ field: 'email', message: 'Этот email уже используется' });
        } else {
          updates.email = email;
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation Error', errors },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'Нет данных для обновления' },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Обновление пользователя
    let updatedUser: DbUser[];

    if (updates.name && updates.email) {
      updatedUser = await sql`
        UPDATE users
        SET name = ${updates.name}, email = ${updates.email}, updated_at = NOW()
        WHERE id = ${user.id}
        RETURNING id, email, name, avatar, created_at, updated_at
      ` as DbUser[];
    } else if (updates.name) {
      updatedUser = await sql`
        UPDATE users
        SET name = ${updates.name}, updated_at = NOW()
        WHERE id = ${user.id}
        RETURNING id, email, name, avatar, created_at, updated_at
      ` as DbUser[];
    } else {
      updatedUser = await sql`
        UPDATE users
        SET email = ${updates.email!}, updated_at = NOW()
        WHERE id = ${user.id}
        RETURNING id, email, name, avatar, created_at, updated_at
      ` as DbUser[];
    }

    console.log(`[PROFILE] Updated user: ${user.email}`);

    return NextResponse.json({
      message: 'Профиль обновлен',
      user: {
        id: updatedUser[0].id,
        email: updatedUser[0].email,
        name: updatedUser[0].name,
        avatar: updatedUser[0].avatar,
        createdAt: updatedUser[0].created_at,
        updatedAt: updatedUser[0].updated_at
      }
    });
  } catch (error) {
    console.error('[PROFILE] Update error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
