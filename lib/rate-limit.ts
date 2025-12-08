import { getDb } from './db';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000 // 1 минута
};

const ENDPOINT_CONFIGS: Record<string, RateLimitConfig> = {
  '/api/auth/login': { maxRequests: 5, windowMs: 60 * 1000 }, // 5 попыток в минуту
  '/api/auth/register': { maxRequests: 3, windowMs: 60 * 1000 }, // 3 регистрации в минуту
  '/api/auth/logout': { maxRequests: 10, windowMs: 60 * 1000 },
  '/api/profile': { maxRequests: 30, windowMs: 60 * 1000 },
  '/api/favorites': { maxRequests: 30, windowMs: 60 * 1000 }
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

// Получение IP-адреса из запроса
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return '127.0.0.1';
}

// Проверка rate limit
export async function checkRateLimit(
  ip: string,
  endpoint: string
): Promise<RateLimitResult> {
  const config = ENDPOINT_CONFIGS[endpoint] || DEFAULT_CONFIG;
  const sql = getDb();

  try {
    // Получаем текущую запись
    const records = await sql`
      SELECT * FROM rate_limits
      WHERE ip_address = ${ip} AND endpoint = ${endpoint}
    ` as Array<{
      id: number;
      ip_address: string;
      endpoint: string;
      request_count: number;
      window_start: Date;
    }>;

    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    if (records.length === 0) {
      // Создаем новую запись
      await sql`
        INSERT INTO rate_limits (ip_address, endpoint, request_count, window_start)
        VALUES (${ip}, ${endpoint}, 1, ${now.toISOString()})
      `;

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(now.getTime() + config.windowMs)
      };
    }

    const record = records[0];
    const recordWindowStart = new Date(record.window_start);

    // Если окно устарело, сбрасываем счетчик
    if (recordWindowStart < windowStart) {
      await sql`
        UPDATE rate_limits
        SET request_count = 1, window_start = ${now.toISOString()}
        WHERE id = ${record.id}
      `;

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt: new Date(now.getTime() + config.windowMs)
      };
    }

    // Проверяем лимит
    if (record.request_count >= config.maxRequests) {
      const resetAt = new Date(recordWindowStart.getTime() + config.windowMs);
      return {
        allowed: false,
        remaining: 0,
        resetAt
      };
    }

    // Увеличиваем счетчик
    await sql`
      UPDATE rate_limits
      SET request_count = request_count + 1
      WHERE id = ${record.id}
    `;

    return {
      allowed: true,
      remaining: config.maxRequests - record.request_count - 1,
      resetAt: new Date(recordWindowStart.getTime() + config.windowMs)
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // В случае ошибки БД, разрешаем запрос (fail open)
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.windowMs)
    };
  }
}

// Middleware response для rate limit exceeded
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too Many Requests',
      message: 'Слишком много запросов. Пожалуйста, подождите.',
      retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((result.resetAt.getTime() - Date.now()) / 1000).toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': result.resetAt.toISOString()
      }
    }
  );
}

// Очистка старых записей rate limit (запускать периодически)
export async function cleanOldRateLimits(): Promise<void> {
  const sql = getDb();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  await sql`
    DELETE FROM rate_limits
    WHERE window_start < ${oneHourAgo.toISOString()}
  `;
}
