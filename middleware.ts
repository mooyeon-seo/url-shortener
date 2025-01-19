import { Redis } from "ioredis";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import redis from "@/lib/redis";
import { ipAddress } from '@vercel/functions'

async function checkRateLimit(ip: string): Promise<NextResponse | null> {
    const limit = 100; // requests per window
    const window = 3600; // 1 hour in seconds
    const key = `rate-limit:${ip}`;

    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, window);
    }

    if (count > limit) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    return null;
}

export async function middleware(request: NextRequest) {
    const ip = ipAddress(request) || request.headers.get('x-forwarded-for') || "127.0.0.1";
    const rateLimit = await checkRateLimit(ip);

    if (rateLimit) {
        return rateLimit;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
}