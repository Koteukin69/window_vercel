import { NextResponse } from 'next/server';
import { getDb, DbFavorite } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

interface Video {
  city: string;
  time_of_day: 'morning' | 'day' | 'night';
  poster: string;
  src: { [key: string]: string };
  description: string;
}

// GET /api/favorites - получение списка избранного
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const sql = getDb();

    // Получаем избранное с данными видео
    const favorites = await sql`
      SELECT f.id, f.video_city, f.video_time_of_day, f.created_at,
             v.poster, v.src, v.description
      FROM favorites f
      LEFT JOIN videos v ON LOWER(f.video_city) = LOWER(v.city)
                         AND f.video_time_of_day = v.time_of_day
      WHERE f.user_id = ${user.id}
      ORDER BY f.created_at DESC
    ` as Array<{
      id: number;
      video_city: string;
      video_time_of_day: string;
      created_at: Date;
      poster: string | null;
      src: { [key: string]: string } | null;
      description: string | null;
    }>;

    return NextResponse.json({
      favorites: favorites.map(f => ({
        id: f.id,
        city: f.video_city,
        timeOfDay: f.video_time_of_day,
        poster: f.poster,
        src: f.src,
        description: f.description,
        createdAt: f.created_at
      }))
    });
  } catch (error) {
    console.error('[FAVORITES] Get error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - добавление в избранное
export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const body = await request.json() as { city: string; timeOfDay: string };
    const { city, timeOfDay } = body;

    if (!city || !timeOfDay) {
      return NextResponse.json(
        { error: 'Необходимо указать город и время суток' },
        { status: 400 }
      );
    }

    const validTimeOfDay = ['morning', 'day', 'night'];
    if (!validTimeOfDay.includes(timeOfDay)) {
      return NextResponse.json(
        { error: 'Некорректное время суток' },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Проверяем существование видео
    const videos = await sql`
      SELECT city FROM videos
      WHERE LOWER(city) = LOWER(${city}) AND time_of_day = ${timeOfDay}
    ` as Video[];

    if (videos.length === 0) {
      return NextResponse.json(
        { error: 'Видео не найдено' },
        { status: 404 }
      );
    }

    // Проверяем, не добавлено ли уже
    const existing = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${user.id}
        AND LOWER(video_city) = LOWER(${city})
        AND video_time_of_day = ${timeOfDay}
    ` as DbFavorite[];

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Уже добавлено в избранное' },
        { status: 409 }
      );
    }

    // Добавляем в избранное
    const result = await sql`
      INSERT INTO favorites (user_id, video_city, video_time_of_day)
      VALUES (${user.id}, ${city}, ${timeOfDay})
      RETURNING id, video_city, video_time_of_day, created_at
    ` as DbFavorite[];

    console.log(`[FAVORITES] Added: ${city} (${timeOfDay}) for user: ${user.email}`);

    return NextResponse.json({
      message: 'Добавлено в избранное',
      favorite: {
        id: result[0].id,
        city: result[0].video_city,
        timeOfDay: result[0].video_time_of_day,
        createdAt: result[0].created_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('[FAVORITES] Add error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - удаление из избранного
export async function DELETE(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const timeOfDay = url.searchParams.get('timeOfDay');
    const id = url.searchParams.get('id');

    const sql = getDb();

    let result;

    if (id) {
      // Удаление по ID
      result = await sql`
        DELETE FROM favorites
        WHERE id = ${parseInt(id)} AND user_id = ${user.id}
        RETURNING id
      `;
    } else if (city && timeOfDay) {
      // Удаление по городу и времени
      result = await sql`
        DELETE FROM favorites
        WHERE user_id = ${user.id}
          AND LOWER(video_city) = LOWER(${city})
          AND video_time_of_day = ${timeOfDay}
        RETURNING id
      `;
    } else {
      return NextResponse.json(
        { error: 'Необходимо указать id или city и timeOfDay' },
        { status: 400 }
      );
    }

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Запись не найдена' },
        { status: 404 }
      );
    }

    console.log(`[FAVORITES] Removed favorite for user: ${user.email}`);

    return NextResponse.json({
      message: 'Удалено из избранного'
    });
  } catch (error) {
    console.error('[FAVORITES] Delete error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
