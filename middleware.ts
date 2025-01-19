import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import redis from "@/lib/redis";
import { ipAddress } from "@vercel/functions";

async function checkRateLimit(ip: string, limit: number, window: number): Promise<NextResponse | null> {
    const key = `rate-limit:${ip}`;

    const count = await redis.incr(key);
    if (count === 1) {
        await redis.expire(key, window); // Set expiry for new keys
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
    const ip =
        ipAddress(request) || 
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
        "127.0.0.1"; // Handle multiple proxies

    const limit = Number(process.env.RATE_LIMIT || 100); // Environment variables for flexibility
    const window = Number(process.env.RATE_LIMIT_WINDOW || 3600);

    try {
        const rateLimit = await checkRateLimit(ip, limit, window);
        if (rateLimit) return rateLimit;
    } catch (error) {
        console.error("Rate limiting error:", error); // Log Redis errors
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/shorten", // Only apply to the /shorten endpoint
};
