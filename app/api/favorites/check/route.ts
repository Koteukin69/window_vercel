import { NextResponse } from 'next/server';
import { getDb, DbFavorite } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// GET /api/favorites/check?city=...&timeOfDay=... - проверка наличия в избранном
export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ isFavorite: false });
    }

    const url = new URL(request.url);
    const city = url.searchParams.get('city');
    const timeOfDay = url.searchParams.get('timeOfDay');

    if (!city || !timeOfDay) {
      return NextResponse.json(
        { error: 'Необходимо указать город и время суток' },
        { status: 400 }
      );
    }

    const sql = getDb();

    const favorites = await sql`
      SELECT id FROM favorites
      WHERE user_id = ${user.id}
        AND LOWER(video_city) = LOWER(${city})
        AND video_time_of_day = ${timeOfDay}
    ` as DbFavorite[];

    return NextResponse.json({
      isFavorite: favorites.length > 0,
      favoriteId: favorites.length > 0 ? favorites[0].id : null
    });
  } catch (error) {
    console.error('[FAVORITES] Check error:', error);
    return NextResponse.json({ isFavorite: false });
  }
}
