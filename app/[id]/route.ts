import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'

const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Step 1: Check Redis cache first
    const cachedLongUrl = await redis.get(`${id}`);
    if (cachedLongUrl) {
      // Update click count asynchronously
      await prisma.url.update({
        where: { shortUrl: id },
        data: { clicks: { increment: 1 } }
      }).catch(console.error); // Non-blocking error handling

      return NextResponse.redirect(cachedLongUrl);
    }

    // Step 2: If not in cache, check database
    const url = await prisma.url.update({
      where: { shortUrl: id },
      data: { clicks: { increment: 1 } }
    });

    if (!url) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Cache the result in Redis
    await redis.set(`${id}`, url.longUrl, 'EX', 3600); // Cache for 1 hour

    return NextResponse.redirect(url.longUrl);

  } catch (error) {
    console.error('Error retrieving URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}