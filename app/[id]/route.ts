import prisma from '@/config/db'
import { Redis } from 'ioredis'
import { NextRequest, NextResponse } from 'next/server'

// Configure Redis with explicit database selection
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  db: 0  // Explicitly set database index
})

redis.on('error', (err) => console.error('Redis Client Error', err));

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    return NextResponse.json(
      { error: 'Invalid ID format' },
      { status: 400 }
    );
  }

  try {
    const cachedUrl = await redis.get(`url:${id}`); // Use `id` directly here
    if (cachedUrl) {
      await prisma.url.update({
        where: { shortUrl: id },
        data: { clicks: { increment: 1 } }
      });

      return NextResponse.redirect(cachedUrl);
    }

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

    await redis.set(`url:${id}`, url.longUrl, 'EX', 86400); // Use `id` here too
    return NextResponse.redirect(url.longUrl);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}